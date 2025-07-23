// backend/models/Application.js
const mongoose = require("mongoose");

const applicationSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Links to the User model
      unique: true, // Each user can have only one application
    },
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    dob: { type: Date },
    gender: {
      type: String,
      enum: ["male", "female", "non-binary", "prefer-not-to-say"],
    },
    address: { type: String, required: true },

    // Education Details
    education: {
      class10: {
        board: { type: String },
        school: { type: String },
        passingYear: { type: Number },
        percentage: { type: String }, // Can be "90%" or "9.5/10"
      },
      class12: {
        board: { type: String },
        school: { type: String },
        passingYear: { type: Number },
        percentage: { type: String },
      },
      bachelor: {
        degree: { type: String },
        university: { type: String },
        graduationYear: { type: Number },
        gpa: { type: String },
        currentlyPursuing: { type: Boolean, default: false },
      },
      postGraduation: {
        degree: { type: String },
        university: { type: String },
        graduationYear: { type: Number },
        gpa: { type: String },
        currentlyPursuing: { type: Boolean, default: false },
      },
    },

    // Internship & Work Experience (can be an array for multiple entries)
    workExperience: [
      {
        companyName: { type: String },
        position: { type: String },
        startDate: { type: Date },
        endDate: { type: Date },
        responsibilities: { type: String },
      },
    ],

    // Skills, Subjects & Languages
    technicalSkills: { type: String }, // Comma-separated or array of strings
    relevantSubjects: { type: String },
    languages: { type: String },

    // Position of Responsibilities (can be an array)
    responsibilitiesHeld: [
      {
        role: { type: String },
        organization: { type: String },
        description: { type: String },
      },
    ],

    // Projects (can be an array)
    projects: [
      {
        title: { type: String },
        technologies: { type: String },
        description: { type: String },
        link: { type: String },
      },
    ],

    // Accomplishments (can be an array of strings)
    accomplishments: { type: String },

    // Volunteering (can be an array)
    volunteering: [
      {
        organization: { type: String },
        role: { type: String },
        duration: { type: String },
        description: { type: String },
      },
    ],

    // Extra-curricular Activities (can be an array)
    extraCurricularActivities: [
      {
        activityName: { type: String },
        description: { type: String },
      },
    ],

    // Resume, Docs & Write-ups (store URLs after upload)
    resumeFileUrl: { type: String },
    coverLetterFileUrl: { type: String },
    portfolioLink: { type: String },

    // Admin-related fields
    applicationStatus: {
      type: String,
      // ADDED 'Submitted' to the enum
      enum: [
        "Pending",
        "Submitted",
        "Under Review",
        "Shortlisted",
        "Rejected",
        "Interview Scheduled",
        "Hired",
      ],
      default: "Pending",
    },
    adminRemarks: { type: String, required: false, trim: true },
  },
  {
    timestamps: true,
  }
);


const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;
