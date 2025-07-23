// backend/routes/uploadRoutes.js
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware"); // Import the configured multer instance
const { protect } = require("../middleware/authMiddleware"); // Import your authentication middleware

// Route for uploading a single resume file
// IMPORTANT: The 'file' string here MUST match the 'name' attribute of the
// <input type="file" element in your frontend's FormData.
// For example, if your frontend does formData.append('myResume', file),
// then this should be upload.single('myResume').
// Based on your initial snippet, 'file' is assumed.
router.post("/resume", protect, upload.single("file"), (req, res) => {
  // console.log("--- Backend Resume Upload Debug ---");
  // console.log("req.file:", req.file); // Check if Multer populated req.file

  // If we reach here, the file was successfully uploaded and authentication passed.
  if (!req.file) {
    //console.log("No file uploaded or Multer failed to process.");
    // This case should ideally be caught by Multer's error handler if no file is sent,
    // but it's a good fallback.
    return res.status(400).json({ message: "No file uploaded." });
  }

  // Construct the file URL
  const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${
    req.file.filename
  }`;
  //console.log("Constructed fileUrl:", fileUrl); // Check the generated URL

  res.status(200).json({
    message: "File uploaded successfully!",
    fileName: req.file.filename,
    fileUrl: fileUrl, // This should now contain the correct URL
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
  });
  //console.log("--- End Backend Resume Upload Debug ---");
});


// NEW ROUTE: Route for uploading a single cover letter file
router.post('/cover-letter', protect, upload.single('file'), (req, res) => {
  //console.log('--- Backend Cover Letter Upload Debug ---');
  //console.log('req.file:', req.file); // Check if Multer populated req.file

  if (!req.file) {
    //console.log('No cover letter file uploaded or Multer failed to process.');
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  // Construct the file URL
  const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  //console.log('Constructed fileUrl:', fileUrl); // Check the generated URL

  res.status(200).json({
    message: 'Cover letter uploaded successfully!',
    fileName: req.file.filename,
    fileUrl: fileUrl,
    originalName: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size
  });
  //console.log('--- End Backend Cover Letter Upload Debug ---');
});


// router.use((err, req, res, next) => {
//   if (err instanceof multer.MulterError) {
//     // Handle Multer-specific errors
//     return res.status(400).json({ message: err.message });
//   } else if (err) {
//     // General error
//     return res.status(400).json({ message: err.message });
//   }
//   next();
// });


// You can add more upload routes here for different file types/purposes:
// router.post('/coverletter', protect, upload.single('coverLetterFile'), (req, res) => { ... });
// router.post('/profile-picture', protect, upload.single('profilePic'), (req, res) => { ... });

module.exports = router;
