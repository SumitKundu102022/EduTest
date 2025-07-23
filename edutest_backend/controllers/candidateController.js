// backend/controllers/candidateController.js
const asyncHandler = require("express-async-handler");
const Application = require("../models/Application");
const User = require("../models/User"); // To update user's application status
const TestSession = require("../models/TestSession");
const Test = require("../models/Test");

/**
 * @desc    Submit candidate application form
 * @route   POST /api/candidate/application
 * @access  Private (Candidate only)
 */
const submitApplication = asyncHandler(async (req, res) => {
  const {
    fullName,
    phone,
    dob,
    gender,
    address,
    education,
    workExperience,
    technicalSkills,
    relevantSubjects,
    languages,
    responsibilitiesHeld,
    projects,
    accomplishments,
    volunteering,
    extraCurricularActivities,
    resumeFileUrl,
    coverLetterFileUrl,
    portfolioLink,
  } = req.body;

  // Check if application already exists for this user
  const existingApplication = await Application.findOne({ user: req.user._id });
  if (existingApplication) {
    res.status(400);
    throw new Error("Application already submitted for this user.");
  }

  if (!resumeFileUrl) {
    res.status(400);
    throw new Error("Resume file is required.");
  }

  // Create new application
  const application = await Application.create({
    user: req.user._id,
    fullName,
    phone,
    dob,
    gender,
    address,
    education,
    workExperience,
    technicalSkills,
    relevantSubjects,
    languages,
    responsibilitiesHeld,
    projects,
    accomplishments,
    volunteering,
    extraCurricularActivities,
    resumeFileUrl,
    coverLetterFileUrl,
    portfolioLink,
    applicationStatus: "Submitted", 
  });

  //console.log("Application created:", application);

  if (application) {
    // Update user's isApplicationCompleted status
    req.user.isApplicationCompleted = true;
    await req.user.save(); // Save the updated user object

    res.status(201).json({
      message: "Application submitted successfully!",
      application,
    });
  } else {
    res.status(400);
    throw new Error("Invalid application data");
  }
});

/**
 * @desc    Get candidate's application details
 * @route   GET /api/candidate/application
 * @access  Private (Candidate only)
 */
const getMyApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({ user: req.user._id });

  if (application) {
    res.json(application);
  } else {
    res.status(404);
    throw new Error("Application not found for this user.");
  }
});

/**
 * @desc    Get candidate's dashboard data (recent tests, upcoming tests, performance summary)
 * @route   GET /api/candidate/dashboard
 * @access  Private (Candidate only)
 */
const getCandidateDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Fetch recent completed test sessions
  const recentTests = await TestSession.find({
    user: userId,
    status: "completed",
  })
    .sort({ submittedAt: -1 }) // Sort by most recent
    .limit(5) // Limit to 5 recent tests
    .populate("test", "name cutoffMark scheduledDate scheduledTime"); // Populate test name and cutoffMark

  // Fetch upcoming assigned tests (tests assigned to user but no completed session yet)
  const upcomingTests = await Test.find({ assignedTo: userId })
    .select(
      "name description timeLimit numQuestions cutoffMark scheduledDate scheduledTime"
    ) // Explicitly select all needed fields
    .populate("createdBy", "name") // Optionally show who created it
    .lean(); // Convert to plain JS objects for easier manipulation

  // Debug log: Check the raw upcomingTests data directly from the DB query
  //console.log("Raw upcomingTests from DB:", upcomingTests);

  // Filter out tests for which a session already exists (meaning they've taken it)
  const takenTestIds = recentTests.map((session) =>
    session.test._id.toString()
  );
  const trulyUpcomingTests = upcomingTests.filter(
    (test) => !takenTestIds.includes(test._id.toString())
  );

  // Calculate performance summary
  const allCompletedSessions = await TestSession.find({
    user: userId,
    status: "completed",
  });
  const totalTestsCompleted = allCompletedSessions.length;
  let totalScoreSum = 0;
  let totalMaxScoreSum = 0;

  allCompletedSessions.forEach((session) => {
    totalScoreSum += session.score;
    totalMaxScoreSum += session.maxScore;
  });

  const averageScore =
    totalMaxScoreSum > 0 ? (totalScoreSum / totalMaxScoreSum) * 100 : 0;

  res.json({
    recentTests: recentTests.map((session) => ({
      id: session._id,
      testId: session.test._id,
      name: session.test.name,
      date: session.submittedAt.toISOString().split("T")[0], // Format date
      status: session.status === "completed" ? "Completed" : "Pending",
      score: `${session.score}/${session.maxScore}`,
      percentage: session.percentage,
      lastTestResultId: session._id,
      reviewStatus: session.reviewStatus,
      cutoffMark: session.test.cutoffMark, // Include cutoffMark
      scheduledDate: session.test.scheduledDate,
      scheduledTime: session.test.scheduledTime,
    })),
    upcomingTests: trulyUpcomingTests.map((test) => {
      // Debug log for each test within the map
      // console.log(
      //   `Mapping upcoming test: ${test.name} (ID: ${test._id}) - scheduledDate: ${test.scheduledDate}, scheduledTime: ${test.scheduledTime}`
      // );
      return {
        id: test._id,
        name: test.name,
        cutoffMark: test.cutoffMark,
        description: test.description,
        scheduledDate: test.scheduledDate,
        scheduledTime: test.scheduledTime,
        status: "Scheduled",
      };
    }),
    performanceSummary: {
      totalTests: await TestSession.countDocuments({ user: userId }), // Total attempts
      averageScore: parseFloat(averageScore.toFixed(2)),
      testsCompleted: totalTestsCompleted,
    },
  });
});

/**
 * @desc    Get a specific test session result for a candidate
 * @route   GET /api/candidate/results/:sessionId
 * @access  Private (Candidate only)
 */
const getTestResult = asyncHandler(async (req, res) => {
  const sessionId = req.params.sessionId;
  const user = req.user; // User from protect middleware
  //console.log("User in getTestResult:", user.role);
  

  const testSession = await TestSession.findById(sessionId)
    .populate("user", "name email")
    .populate(
      "test",
      "name numQuestions negativeMarkingRatio questions cutoffMark scheduledDate scheduledTime"
    ); // Populate test details including questions

  if (!testSession) {
    res.status(404);
    throw new Error("Test session not found");
  }

  // Ensure the logged-in user owns this test session
  // if (testSession.user._id.toString() !== req.user._id.toString()) {
  //   res.status(403);
  //   throw new Error("Not authorized to view this test result");
  // }

  // Authorization check:
  // Candidate can only view their own results.
  // Admin can view any result.
  if (
    user.role === "candidate" &&
    testSession.user._id.toString() !== user._id.toString()
  ) {
    res.status(403);
    throw new Error("Not authorized to view this test result.");
  }

  // console.log("Test-session-username:", testSession.user.name);
  // console.log("test-session-review-status:", testSession.reviewStatus);

  // Map user answers to full question details
  const questionsWithResults = testSession.userAnswers
    .map((userAns) => {
      const originalQuestion = testSession.test.questions.id(
        userAns.questionId
      ); // Find the question by its subdocument _id
      if (!originalQuestion) {
        console.warn(
          `Question with ID ${userAns.questionId} not found in test ${testSession.test.name}`
        );
        return null;
      }
      return {
        id: originalQuestion._id,
        questionText: originalQuestion.questionText,
        options: originalQuestion.options,
        userAnswer: userAns.chosenAnswerIndex,
        correctAnswer: originalQuestion.correctAnswerIndex,
        isCorrect: userAns.isCorrect,
        remark: userAns.remark,
        scoreEarned: userAns.scoreEarned,
      };
    })
    .filter(Boolean); // Remove any nulls if a question wasn't found

  res.json({
    id: testSession._id,
    testName: testSession.test.name,
    candidateName: testSession.user.name,
    candidateEmail: testSession.user.email,
    score: testSession.score,
    maxScore: testSession.maxScore,
    percentage: testSession.percentage,
    totalQuestions: testSession.test.numQuestions,
    correctAnswers: questionsWithResults.filter((q) => q.isCorrect).length,
    wrongAnswers: questionsWithResults.filter(
      (q) => !q.isCorrect && q.userAnswer !== -1
    ).length,
    unattempted: questionsWithResults.filter((q) => q.userAnswer === -1).length,
    negativeMarksRatio: testSession.test.negativeMarkingRatio,
    questions: questionsWithResults,
    submittedAt: testSession.submittedAt,
    reviewStatus: testSession.reviewStatus,
    cutoffMark: testSession.test.cutoffMark, // Include cutoffMark from the populated test
    scheduledDate: testSession.test.scheduledDate,
    scheduledTime: testSession.test.scheduledTime,
  });
});

module.exports = {
  submitApplication,
  getMyApplication,
  getCandidateDashboard,
  getTestResult,
};
