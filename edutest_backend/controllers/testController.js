// backend/controllers/testController.js
const asyncHandler = require('express-async-handler');
const Test = require('../models/Test');
const TestSession = require('../models/TestSession');
const { generateQuestionsFromAI } = require('../utils/aiService'); // Import AI service

/**
 * @desc    Create a new test (Admin only)
 * @route   POST /api/tests
 * @access  Private (Admin only)
 */
const createTest = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    notesContent,
    numQuestions,
    timeLimit,
    negativeMarkingRatio,
    cutoffMark,
  } = req.body;


  // Basic validation
  if (
    !name ||
    !notesContent ||
    !numQuestions ||
    !timeLimit
    // ||
    // cutoffMark === undefined ||
    // cutoffMark === null
  ) {
    res.status(400);
    throw new Error(
      "Please provide test name, notes, number of questions, and time limit, cutoff-marks"
    );
  }

  if (cutoffMark < 0 || cutoffMark > 100) {
    res.status(400);
    throw new Error("Cut-off mark must be between 0 and 100.");
  }

let generatedQuestions;
try {
  // Generate questions using AI service
  generatedQuestions = await generateQuestionsFromAI(
    notesContent,
    numQuestions
  );

  // If successful, proceed with saving or sending the questions
  // res.status(200).json({
  //   message: "Questions generated successfully!",
  //   questions: generatedQuestions,
  // });
  
} catch (aiError) {
  // Catch the error specifically from the AI service
  console.error("Error during AI question generation:", aiError.message);
  res.status(500).json({
    message:
      aiError.message ||
      "An unexpected error occurred during question generation. Please try again.",
    // You can add a specific flag if needed to indicate AI failure
    aiGenerationFailed: true,
  });
  throw new Error(
    `Failed to generate questions from notes using AI: ${aiError.message}. Please check your API key or notes content.`
  );
}

if (!generatedQuestions || generatedQuestions.length === 0) {
  res.status(500);
  throw new Error(
    "AI generated no questions or an invalid format. Please try again or check notes content."
  );
}

  // Create the test in the database
  const test = await Test.create({
    name,
    description,
    createdBy: req.user._id, // Admin who created it
    notesContent,
    numQuestions: generatedQuestions.length, // Use actual generated count
    timeLimit,
    negativeMarkingRatio,
    cutoffMark,
    // scheduledDate: new Date(scheduledDate), // Convert to Date object
    // scheduledDate, // Convert to Date object
    // scheduledTime,
    questions: generatedQuestions,
    // assignedTo will be empty initially, assigned via admin panel
  });

  if (test) {
    res.status(201).json({
      message: 'Test created and questions generated successfully!',
      testId: test._id,
      testName: test.name,
      numQuestions: test.numQuestions,
    });
  } else {
    res.status(400);
    throw new new Error('Invalid test data provided.');
  }
});

/**
 * @desc    Get all tests (Admin only)
 * @route   GET /api/tests
 * @access  Private (Admin only)
 */
const getAllTests = asyncHandler(async (req, res) => {
  // Fetch all tests, optionally populate createdBy to show admin name
  const tests = await Test.find({}).populate('createdBy', 'name email');
  res.json(tests);
});


/**
 * @desc    Get a specific test by ID (for candidate to take)
 * @route   GET /api/tests/:id
 * @access  Private (Candidate only)
 */
const getTestById = asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id).select('-notesContent -questions.correctAnswerIndex'); // Do not send correct answers to frontend

  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }

  // Optional: Check if the test is assigned to the current candidate
  // if (!test.assignedTo.includes(req.user._id.toString())) {
  //   res.status(403);
  //   throw new Error('You are not authorized to take this test.');
  // }

  res.json({
    id: test._id,
    name: test.name,
    description: test.description,
    numQuestions: test.numQuestions,
    timeLimit: test.timeLimit,
    negativeMarkingRatio: test.negativeMarkingRatio,
    cutoffMark: test.cutoffMark, // Include cutoffMark
    scheduledDate: test.scheduledDate, // Include scheduledDate
    scheduledTime: test.scheduledTime, // Include scheduledTime
    questions: test.questions.map((q) => ({
      id: q._id, // Keep subdocument ID
      questionText: q.questionText,
      options: q.options,
    })),
  });
});

/**
 * @desc    Submit a test session
 * @route   POST /api/tests/:id/submit
 * @access  Private (Candidate only)
 */
const submitTest = asyncHandler(async (req, res) => {
  const testId = req.params.id;
  const { userAnswers, startTime, endTime } = req.body; // userAnswers: [{ questionId, chosenAnswerIndex, remark }]

  const test = await Test.findById(testId);
  if (!test) {
    res.status(404);
    throw new Error('Test not found.');
  }

  // Calculate score
  let score = 0;
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;
  const maxScore = test.numQuestions; // Each question is 1 mark

  const processedUserAnswers = userAnswers.map(userAns => {
    const originalQuestion = test.questions.id(userAns.questionId);
    if (!originalQuestion) {
      console.warn(`Question ${userAns.questionId} not found in test ${testId}`);
      return { ...userAns, isCorrect: false, scoreEarned: 0 }; // Handle missing question gracefully
    }

    let isCorrect = false;
    let scoreEarned = 0;

    if (userAns.chosenAnswerIndex === -1) {
      unattemptedCount++;
      // Score remains 0 for unattempted
    } else if (userAns.chosenAnswerIndex === originalQuestion.correctAnswerIndex) {
      isCorrect = true;
      scoreEarned = 1; // 1 mark for correct answer
      correctCount++;
    } else {
      isCorrect = false;
      scoreEarned = -test.negativeMarkingRatio; // Deduct negative marks
      wrongCount++;
    }

    score += scoreEarned;

    return {
      questionId: userAns.questionId,
      chosenAnswerIndex: userAns.chosenAnswerIndex,
      remark: userAns.remark,
      isCorrect,
      scoreEarned,
    };
  });

  const percentage = (score / maxScore) * 100;

  // Create new test session record
  const testSession = await TestSession.create({
    user: req.user._id,
    test: testId,
    startTime: new Date(startTime),
    endTime: new Date(endTime),
    submittedAt: new Date(),
    userAnswers: processedUserAnswers,
    score: parseFloat(score.toFixed(2)), // Round score to 2 decimal places
    maxScore,
    percentage: parseFloat(percentage.toFixed(2)),
    status: 'completed',
    reviewStatus: 'Pending Review', // Default review status for new submissions
  });

  res.status(201).json({
    message: "Test submitted successfully!",
    sessionId: testSession._id,
    score: testSession.score,
    percentage: testSession.percentage,
    correctAnswers: correctCount,
    wrongAnswers: wrongCount,
    unattempted: unattemptedCount,
    // Pass the cutoff mark with the result
    cutoffMark: test.cutoffMark,
  });
});

module.exports = {
  createTest,
  getAllTests, // Export the new function
  getTestById,
  submitTest,
};

