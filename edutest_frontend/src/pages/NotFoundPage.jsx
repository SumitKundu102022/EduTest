// src/pages/NotFoundPage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@components/ui/button"; // Shadcn/ui Button

/**
 * NotFoundPage Component (404 Error Page)
 *
 * This component is displayed when a user navigates to a URL that does not match
 * any defined routes in the application. It provides a user-friendly message
 * and a clear call to action to return to a valid part of the application.
 *
 * Features:
 * - Prominent "404" error code.
 * - Clear "Page Not Found" message.
 * - A brief explanation or apology.
 * - A button to navigate back to the dashboard (or home page).
 * - Uses Framer Motion for engaging entrance animations.
 * - Responsive and aesthetically pleasing design with Tailwind CSS.
 */
const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-gray-200 to-gray-400 dark:from-gray-950 dark:to-gray-800 text-gray-900 dark:text-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center bg-white dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-w-md w-full"
      >
        {/* 404 Error Code with Animation */}
        <motion.h1
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            delay: 0.2,
            duration: 0.6,
            type: "spring",
            stiffness: 120,
          }}
          className="text-7xl md:text-9xl font-extrabold text-red-500 dark:text-red-400 mb-4 drop-shadow-lg"
        >
          404
        </motion.h1>

        {/* Page Not Found Message with Animation */}
        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-zinc-600 dark:text-gray-200 mb-4"
        >
          Page Not Found
        </motion.h2>

        {/* Description with Animation */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-lg text-gray-600 dark:text-gray-400 mb-8"
        >
          Oops! The page you're looking for doesn't exist. It might have been
          moved or deleted.
        </motion.p>

        {/* Call to Action Button with Animation */}
        <Link to="/dashboard">
          {" "}
          {/* Assuming /dashboard is the main authenticated landing page */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              className="px-8 py-4 text-lg font-semibold rounded-md shadow-lg
                         bg-zinc-600 text-white hover:bg-zinc-700
                         transition-all duration-300 transform cursor-pointer
                         focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2"
            >
              Go to Dashboard
            </Button>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
