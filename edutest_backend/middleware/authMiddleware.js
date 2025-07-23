// backend/middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler"); // Simple wrapper for async functions to catch errors
const User = require("../models/User");

/**
 * Middleware to protect routes by verifying JWT token.
 * Attaches the authenticated user to `req.user`.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];
      // console.log("Token found:", token);

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user by ID and attach to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Not authorized, user not found");
      }

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
