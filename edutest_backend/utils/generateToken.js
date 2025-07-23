// backend/utils/generateToken.js
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

/**
 * Generates a JSON Web Token (JWT) for a given user ID.
 * The token is signed with a secret from environment variables and expires in 1 hour.
 * @param {string} id - The user's MongoDB ObjectId.
 * @returns {string} The generated JWT.
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d", // Token expires in 7 days
  });
};

module.exports = generateToken;
