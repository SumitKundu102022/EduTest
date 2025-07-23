// backend/controllers/adminController.js
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Application = require("../models/Application");
const Test = require("../models/Test");
const TestSession = require("../models/TestSession");

/**
 * @desc    Get all candidates with their application status
 * @route   GET /api/admin/candidates
 * @access  Private (Admin only)
 */
const getAllCandidates = asyncHandler(async (req, res) => {
  const candidates = await User.find({ role: "candidate" }).select("-password");
  const applications = await Application.find({}).populate(
    "user",
    "name email"
  ); // Populate user data in application

  // Merge candidate user data with application status
  const candidatesWithStatus = candidates.map((candidate) => {
    const app = applications.find(
      (app) => app.user && app.user._id.toString() === candidate._id.toString()
    );
    return {
      id: candidate._id,
      name: candidate.name,
      email: candidate.email,
      isApplicationCompleted: candidate.isApplicationCompleted,
      applicationStatus: app ? app.applicationStatus : "Not Applied",
      lastTestResultId: null, // Placeholder, will fetch below
      testStatus: "N/A", // Placeholder, will fetch below
      totalScore: 0, // Placeholder
      testsCompleted: 0, // Placeholder
    };
  });

  // Fetch last test session for each candidate to get score and status
  for (let i = 0; i < candidatesWithStatus.length; i++) {
    const lastSession = await TestSession.findOne({
      user: candidatesWithStatus[i].id,
    })
      .sort({ submittedAt: -1 })
      .limit(1);

    if (lastSession) {
      candidatesWithStatus[i].lastTestResultId = lastSession._id;
      candidatesWithStatus[i].testStatus = lastSession.reviewStatus;
      candidatesWithStatus[i].totalScore = lastSession.score; // Or sum of all scores if needed
    }

    const completedTestsCount = await TestSession.countDocuments({
      user: candidatesWithStatus[i].id,
      status: "completed",
    });
    candidatesWithStatus[i].testsCompleted = completedTestsCount;
  }

  res.json(candidatesWithStatus);
});

/**
 * @desc    Update candidate's application status
 * @route   PUT /api/admin/candidates/:id/status
 * @access  Private (Admin only)
 */
const updateCandidateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, adminRemarks } = req.body; // Status can be 'Pending', 'Reviewed', 'Shortlisted', 'Rejected'

  const application = await Application.findOne({ user: id });

  if (!application) {
    res.status(404);
    throw new Error("Application not found for this candidate");
  }

  application.applicationStatus = status || application.applicationStatus;
  application.adminRemarks = adminRemarks || application.adminRemarks;

  const updatedApplication = await application.save();

  res.json({
    message: "Candidate application status updated",
    updatedApplication,
  });
});

/**
 * @desc    Assign a test to a candidate
 * @route   POST /api/admin/tests/assign
 * @access  Private (Admin only)
 */
const assignTestToCandidate = asyncHandler(async (req, res) => {
  const { candidateId, testId } = req.body;

  const candidate = await User.findById(candidateId);
  const test = await Test.findById(testId);

  if (!candidate || candidate.role !== "candidate") {
    res.status(404);
    throw new Error("Candidate not found or is not a candidate user");
  }

  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  // Check if test is already assigned to this candidate
  if (test.assignedTo.includes(candidateId)) {
    res.status(400);
    throw new Error("Test already assigned to this candidate");
  }

  test.assignedTo.push(candidateId);
  await test.save();

  res.status(200).json({ message: "Test assigned successfully", test });
});

/**
 * @desc    Update review status of a specific test session
 * @route   PUT /api/admin/test-sessions/:sessionId/review-status
 * @access  Private (Admin only)
 */
const updateTestSessionReviewStatus = asyncHandler(async (req, res) => {
  const { sessionId } = req.params;
  const { reviewStatus } = req.body; // 'Pending Review' or 'Reviewed'

  const session = await TestSession.findById(sessionId);

  if (!session) {
    res.status(404);
    throw new Error("Test session not found");
  }

  session.reviewStatus = reviewStatus || session.reviewStatus;
  const updatedSession = await session.save();

  res.json({
    message: "Test session review status updated",
    updatedSession,
  });
});

/**
 * @desc    Set cutoff mark for a test
 * @route   PUT /api/admin/tests/:testId/cutoff
 * @access  Private (Admin only)
 */
const setTestCutoffMark = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { cutoffMark, scheduledDate, scheduledTime } = req.body;

  //console.log("Setting cutoff mark for test------------------->:", testId, "to", cutoffMark);
  // console.log(
  //   "Setting schedule for test:",
  //   testId,
  //   "to",
  //   scheduledDate,
  //   scheduledTime
  // );

  const test = await Test.findById(testId);

  if (!test) {
    res.status(404);
    throw new Error("Test not found");
  }

  if (typeof cutoffMark !== "number" || cutoffMark < 0 || cutoffMark > 100) {
    res.status(400);
    throw new Error("Cutoff mark must be a non-negative number");
  }

  // Validate scheduledDate and scheduledTime if provided
  if (scheduledDate !== undefined && scheduledTime !== undefined) {
    try {
      const dateObj = new Date(scheduledDate);
      if (isNaN(dateObj.getTime())) {
        // Check for invalid date
        res.status(400);
        throw new Error("Invalid scheduled date format.");
      }
      // Basic time format check (HH:MM) - more robust regex could be used
      if (!/^\d{2}:\d{2}$/.test(scheduledTime)) {
        res.status(400);
        throw new Error("Invalid scheduled time format. Use HH:MM.");
      }
      test.scheduledDate = dateObj;
      test.scheduledTime = scheduledTime;
    } catch (error) {
      res.status(400);
      throw new Error(`Error parsing date/time: ${error.message}`);
    }
  } else if (scheduledDate !== undefined || scheduledTime !== undefined) {
    // If one is provided, both must be
    res.status(400);
    throw new Error(
      "Both scheduledDate and scheduledTime must be provided if setting a schedule."
    );
  }

  // Only update if provided in the request body
  if (cutoffMark !== undefined) {
    test.cutoffMark = parseFloat(cutoffMark);
  }

  // test.cutoffMark = cutoffMark;
  const updatedTest = await test.save();

  res.json({
    message: "Test details updated successfully",
    updatedTest,
  });
});

module.exports = {
  getAllCandidates,
  updateCandidateApplicationStatus,
  assignTestToCandidate,
  updateTestSessionReviewStatus,
  setTestCutoffMark,
};
