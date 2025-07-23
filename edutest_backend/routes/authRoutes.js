// backend/routes/authRoutes.js
const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  googleAuth,
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware"); // Import protect middleware

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile); // Protected route

// NEW ROUTE FOR GOOGLE AUTHENTICATION
router.post("/google", googleAuth); // This route will handle the ID token

module.exports = router;
