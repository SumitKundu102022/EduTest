// backend/routes/candidateRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");
const {
  submitApplication,
  getMyApplication,
  getCandidateDashboard,
  getTestResult,
} = require("../controllers/candidateController");

const router = express.Router();

// Application Form
router
  .route("/application")
  .post(protect, authorizeRoles(["candidate"]), submitApplication)
  .get(protect, authorizeRoles(["candidate"]), getMyApplication);

// Dashboard data for candidates
router.get(
  "/dashboard",
  protect,
  authorizeRoles(["candidate"]),
  getCandidateDashboard
);

// Get a specific test session result
router.get(
  "/results/:sessionId",
  protect,
  authorizeRoles(["candidate", "admin"]),
  getTestResult
); // Admin can also view candidate results

module.exports = router;
