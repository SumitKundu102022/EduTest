// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        // Password is required only if googleId is not present
        return !this.googleId;
      },
    },
    googleId: {
      // New field for Google users
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have null for this field
    },
    role: {
      type: String,
      enum: ["candidate", "admin"], // Define possible roles
      default: "candidate", // Default role for new registrations
    },
    isApplicationCompleted: {
      // For candidate dashboard flow
      type: Boolean,
      default: false,
    },
    profilePic: {
      // Optional: for avatar
      type: String,
      default: "https://via.placeholder.com/150?text=User", // Default placeholder image
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Middleware to hash password before saving user
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     // Only hash if password field is modified
//     next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

// // Method to compare entered password with hashed password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  // Only try to compare if a password exists (for non-Google users)
  if (this.password) {
    return await bcrypt.compare(enteredPassword, this.password);
  }
  return false; // If no password, it cannot match
};

// Encrypt password using bcrypt before saving
userSchema.pre('save', async function (next) {
  // Only hash password if it's being modified and is not a Google-authenticated user
  if (!this.isModified('password') || this.googleId) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
