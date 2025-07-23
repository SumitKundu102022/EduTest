// backend/server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); // Import cors
const path = require('path'); // Still needed for serving static files
const connectDB = require("./config/db");

// Import routes
const authRoutes = require("./routes/authRoutes");
const candidateRoutes = require("./routes/candidateRoutes");
const adminRoutes = require("./routes/adminRoutes");
const testRoutes = require("./routes/testRoutes");
// Import your new upload routes
const uploadRoutes = require('./routes/uploadRoutes');

dotenv.config(); // Load environment variables

connectDB(); // Connect to MongoDB

const app = express();

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173', // Your frontend development URL (Vite default)
  'http://localhost:3000', // Common for Create React App development
  'http://localhost:5000', // Your backend development URL (if frontend also runs here for some reason)
  process.env.FRONTEND_URL, // Your deployed frontend URL (e.g., https://your-frontend.onrender.com)
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    // or if the origin is in our allowed list
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies (important for JWT httpOnly cookies)
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

app.use(cors(corsOptions)); // Use CORS middleware
// --- END CORS Configuration ---

// Middleware
app.use(express.json()); // Body parser for JSON data
app.use(express.urlencoded({ extended: true }));
// app.use(cors()); // Enable CORS for all origins (for development)

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/tests", testRoutes);

// Serve Static Files for uploaded content
// This makes files in the 'uploads' directory accessible via '/uploads' URL path
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use the upload routes
// All routes defined in uploadRoutes.js will be prefixed with '/api/uploads'
app.use('/api/uploads', uploadRoutes);

// Basic route for testing
app.get("/", (req, res) => {
  res.send("EduTest Backend API is running...");
});

// Error handling middleware (optional, for more robust error responses)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(res.statusCode || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, "uploads")}`);
});
