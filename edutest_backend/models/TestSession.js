// backend/models/TestSession.js
const mongoose = require("mongoose");

const userAnswerSchema = mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the specific question in the Test
    required: true,
  },
  chosenAnswerIndex: {
    // -1 if unattempted
    type: Number,
    default: -1,
  },
  remark: {
    // User's remark for the question
    type: String,
    default: "",
  },
  isCorrect: {
    // Calculated on submission
    type: Boolean,
  },
  scoreEarned: {
    // Score for this specific question
    type: Number,
    default: 0,
  },
});

const testSessionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    test: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Test",
    },
    startTime: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endTime: {
      type: Date,
    },
    submittedAt: {
      // When the user explicitly submitted or time ran out
      type: Date,
    },
    userAnswers: {
      type: [userAnswerSchema],
      default: [],
    },
    score: {
      // Total score for the session
      type: Number,
      default: 0,
    },
    maxScore: {
      // Max possible score for this test
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["in-progress", "abandoned", "completed", "auto-submitted"],
      default: "in-progress",
    },
    // Admin review status for this specific session
    reviewStatus: {
      type: String,
      enum: ["Pending Review", "Reviewed"],
      default: "Pending Review",
    },
    currentQuestionIndex: {
      // <--- NEW FIELD: To resume test
      type: Number,
      default: 0,
    },
    remainingTime: {
      // <--- NEW FIELD: To resume test
      type: Number, // Time in seconds
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const TestSession = mongoose.model("TestSession", testSessionSchema);

module.exports = TestSession;
