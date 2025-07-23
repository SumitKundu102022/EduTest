// backend/controllers/authController.js
const dotenv = require("dotenv");
const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const Application = require("../models/Application");
const { OAuth2Client } = require("google-auth-library"); // Import Google Auth Library

// Initialize Google OAuth2Client with your Client ID
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // New users register as 'candidate' with application not completed
  const user = await User.create({
    name,
    email,
    password,
    role: "candidate",
    isApplicationCompleted: false,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApplicationCompleted: user.isApplicationCompleted,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

/**
 * @desc    Authenticate user & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    // If login is successful, send back user data including their actual role
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role, // This is crucial: the actual role from DB
      isApplicationCompleted: user.isApplicationCompleted,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

/**
 * @desc    Get user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isApplicationCompleted: user.isApplicationCompleted,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});


/**
 * @desc    Authenticate/Register user with Google ID Token
 * @route   POST /api/auth/google
 * @access  Public
 */
const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  if (!idToken) {
    res.status(400);
    throw new Error('Google ID token is required');
  }

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
    });

    const payload = ticket.getPayload();
    const googleId = payload['sub']; // Unique Google ID
    const email = payload['email'];
    const name = payload['name'];
    const picture = payload['picture']; // Google profile picture URL

    let user = await User.findOne({ googleId });

    if (user) {
      // User exists, log them in
      //console.log(`Google user ${email} found. Logging in.`);
    } else {
      // User does not exist with this googleId, check by email
      user = await User.findOne({ email });

      if (user) {
        // User exists with this email but not linked to GoogleId
        // Link the existing account to GoogleId
        if (!user.googleId) {
          user.googleId = googleId;
          await user.save();
          //console.log(`Existing user ${email} linked to Google ID.`);
        } else {
          // This scenario should ideally not happen if googleId is unique,
          // but if an existing user has a googleId but it's different, it's an issue.
          // For simplicity, we'll just log them in if email matches.
          console.log(`Existing user ${email} found, but Google ID mismatch. Logging in.`);
        }
      } else {
        // New user, register them
        //console.log(`New Google user ${email}. Registering.`);
        user = await User.create({
          name: name,
          email: email,
          googleId: googleId,
          // Password field will be optional due to the schema change
          role: 'candidate', // Default role for new Google users
        });
      }
    }

    if (user) {
      // Generate JWT and set as http-only cookie (if using cookies)
      // If you are sending token in response body, ensure generateToken returns the token string
      const token = generateToken(user._id);
      res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isApplicationCompleted: user.isApplicationCompleted,
        token: token, // Send token in response body
        picture: picture, // Optionally send picture URL
      });
    } else {
      res.status(500);
      throw new Error('Failed to authenticate or register Google user');
    }

  } catch (error) {
    console.error('Google ID Token verification failed:', error);
    res.status(401);
    throw new Error('Invalid Google ID token');
  }
});

module.exports = { registerUser, loginUser, getUserProfile, googleAuth };
