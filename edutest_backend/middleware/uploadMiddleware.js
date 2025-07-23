// backend/middleware/uploadMiddleware.js
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Define the uploads directory
const uploadsDir = path.join(__dirname, "../uploads"); // Go up one level from middleware to backend, then into uploads

// Ensure the uploads directory exists
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true }); // recursive: true creates parent directories if they don't exist
}

// Multer Configuration for Disk Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Store uploaded files in the 'uploads' directory
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate a unique filename to prevent overwrites
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const fileExtension = path.extname(file.originalname);
    // Use the original fieldname (e.g., 'resumeFile', 'coverLetterFile')
    cb(null, file.fieldname + "-" + uniqueSuffix + fileExtension);
  },
});

// Multer upload middleware instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10, // CHANGED: Limit file size to 10MB (was 5MB)
  },
  fileFilter: (req, file, cb) => {
    // Optional: Filter file types
    // Allowed types: images (jpeg, jpg, png), PDF, Word documents
    const allowedMimeTypes = /jpeg|jpg|png|pdf|doc|docx/;
    const extname = allowedMimeTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedMimeTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true); // Accept the file
    } else {
      // Reject the file with a specific error message
      cb(
        new Error(
          "Error: Only images (jpeg, jpg, png), PDF, and Word documents are allowed!"
        ),
        false
      );
    }
  },
});

module.exports = upload;
