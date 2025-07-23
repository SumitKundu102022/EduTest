// backend/routes/adminRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  getAllCandidates,
  updateCandidateApplicationStatus,
  assignTestToCandidate,
  updateTestSessionReviewStatus,
  setTestCutoffMark,
} = require("../controllers/adminController");


const router = express.Router();

// All admin routes should be protected and only accessible by 'admin' role
router.use(protect, authorizeRoles(["admin"]));

// Candidate Management
router.get("/candidates", getAllCandidates);
router.put("/candidates/:id/status", updateCandidateApplicationStatus);

// Test Assignment
router.post("/tests/assign", assignTestToCandidate);

// Test Session Review Status
router.put(
  "/test-sessions/:sessionId/review-status",
  updateTestSessionReviewStatus
);

// Set Test Cutoff Mark
router.put("/tests/:testId/cutoff", setTestCutoffMark);



module.exports = router;
