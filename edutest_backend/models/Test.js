// backend/models/Test.js
const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: {
    type: [String], // Array of strings for options
    required: true,
    validate: {
      validator: function (v) {
        return v && v.length >= 2; // Ensure at least 2 options
      },
      message: "A question must have at least two options.",
    },
  },
  correctAnswerIndex: {
    type: Number, // 0-indexed
    required: true,
    validate: {
      validator: function (v) {
        return v >= 0 && v < this.options.length; // Ensure index is within options bounds
      },
      message: "Correct answer index is out of bounds for options.",
    },
  },
});

const testSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Admin who created the test
    },
    notesContent: {
      // Original notes content (can be large, consider storing URL to file)
      type: String,
      required: true,
    },
    numQuestions: {
      type: Number,
      required: true,
      min: 1,
    },
    timeLimit: {
      // In minutes
      type: Number,
      required: true,
      min: 1,
    },
    negativeMarkingRatio: {
      // e.g., 0.25 for -1/4
      type: Number,
      default: 0,
      min: 0,
      max: 1,
    },
    cutoffMark: {
      // Admin can set a cutoff for the test
      type: Number,
      default: 0,
      min: 0,
    },
    scheduledDate: {
      // New field for scheduling date
      type: Date,
      default: Date.now, // Default to current date, can be updated
      // required: true,
    },
    scheduledTime: {
      // New field for scheduling time (e.g., "HH:MM")
      type: String,
      default: "00:00", // Default to midnight, can be updated
      // required: true,
    },
    questions: {
      type: [questionSchema], // Array of embedded question schemas
      required: true,
      validate: {
        validator: function (v) {
          return v && v.length === this.numQuestions; // Ensure number of questions matches
        },
        message:
          "Number of questions generated does not match requested count.",
      },
    },
    assignedTo: [
      {
        // Array of user IDs to whom the test is assigned
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Test = mongoose.model("Test", testSchema);

module.exports = Test;
