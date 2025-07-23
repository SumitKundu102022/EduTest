// backend/routes/testRoutes.js
const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const {
  createTest,
  getAllTests, // Import the new function
  getTestById,
  submitTest,
} = require('../controllers/testController');

const router = express.Router();

// Create Test (Admin only)
router.post('/', protect, authorizeRoles(['admin']), createTest);

// Get all Tests (Admin only)
router.get('/', protect, authorizeRoles(['admin']), getAllTests); // <--- ADDED THIS ROUTE

// Get Test by ID (Candidate only, to take the test)
router.get('/:id', protect, authorizeRoles(['candidate']), getTestById);

// Submit Test (Candidate only)
router.post('/:id/submit', protect, authorizeRoles(['candidate']), submitTest);

module.exports = router;



// // backend/routes/testRoutes.js
// const express = require("express");
// const { protect } = require("../middleware/authMiddleware");
// const { authorizeRoles } = require("../middleware/roleMiddleware");
// const {
//   createTest,
//   getTestById,
//   submitTest,
// } = require("../controllers/testController");

// const router = express.Router();

// // Create Test (Admin only)
// router.post("/", protect, authorizeRoles(["admin"]), createTest);

// // Get Test by ID (Candidate only, to take the test)
// router.get("/:id", protect, authorizeRoles(["candidate"]), getTestById);

// // Submit Test (Candidate only)
// router.post("/:id/submit", protect, authorizeRoles(["candidate"]), submitTest);

// module.exports = router;


