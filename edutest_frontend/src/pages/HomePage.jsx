// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@components/ui/button"; // Shadcn/ui Button
import Navbar from "@components/common/Navbar";
import { useAuth } from "@contexts/AuthContext"; // Import useAuth

/**
 * HomePage Component
 *
 * This component serves as the landing page for the EduTest application.
 * It provides an engaging introduction to the app's purpose and guides users
 * to either log in or register.
 *
 * Features:
 * - Includes the CandidateNavbar.
 * - Catchy headline and description.
 * - **Conditionally displays Call-to-action buttons for Login and Register (only if not logged in).**
 * - Uses Framer Motion for appealing entrance animations.
 * - Responsive design using Tailwind CSS.
 */
const HomePage = () => {
  const { user, isLoading } = useAuth(); // Get user and isLoading from AuthContext

  // If AuthContext is still loading, we might want to show nothing or a minimal loader
  // to prevent flashing content before the user's login status is known.
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
        <p className="ml-4 text-xl text-gray-600 dark:text-gray-300">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-700 to-zinc-950 text-white relative overflow-hidden">
      <Navbar />
      {/* Background Shapes for Visual Appeal */}

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white rounded-full mix-blend-overlay opacity-10 blur-3xl"
      ></motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.15 }}
        transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
        className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-yellow-300 rounded-full mix-blend-overlay opacity-15 blur-3xl"
      ></motion.div>

      <div className="relative z-10 text-center max-w-4xl mx-auto pt-20">
        {" "}
        {/* Added pt-20 for navbar */}
        {/* Headline with Animation */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-xl"
        >
          Master Your Knowledge with{" "}
          <span className="text-red-500">EduTest</span>
        </motion.h1>
        {/* Subtitle/Description with Animation */}
        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-lg md:text-xl text-blue-100 mb-10 px-4"
        >
          Personalized test series, AI-powered question generation from your
          notes, and detailed performance analysis – all in one place.
        </motion.p>
        {/* Conditionally render Call-to-Action Buttons */}
        {!user && ( // Only show if user is NOT logged in
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link to="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg
                             bg-white text-zinc-700 hover:bg-gray-100 hover:text-zinc-950
                             transition-all duration-300 transform cursor-pointer"
                >
                  Login Now
                </Button>
              </motion.div>
            </Link>
            <Link to="/register">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  className="px-8 py-4 text-lg font-semibold rounded-full shadow-lg
                             bg-transparent border-2 border-white text-white hover:bg-white hover:text-zinc-950
                             transition-all duration-300 transform cursor-pointer"
                >
                  Sign Up for Free
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
