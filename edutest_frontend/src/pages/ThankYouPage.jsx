// src/pages/ThankYouPage.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react"; // Icon for success

/**
 * ThankYouPage Component
 *
 * This component displays a thank you message after a candidate completes a test.
 * It automatically redirects the user to their candidate dashboard after a short delay.
 *
 * Features:
 * - Displays a clear and friendly thank you message.
 * - Uses a success icon for visual confirmation.
 * - Implements an automatic redirect to the candidate dashboard using `setTimeout`.
 * - Uses Framer Motion for subtle entrance animations.
 * - Styled with Tailwind CSS for a clean, centered layout.
 */
const ThankYouPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Set a timeout to redirect to the candidate dashboard after 8 seconds
    const redirectTimer = setTimeout(() => {
      navigate("/candidate/dashboard", { replace: true }); // Use replace to prevent going back to this page
    }, 5000); // 5000 milliseconds = 5 seconds

    // Cleanup the timer if the component unmounts before the redirect
    return () => clearTimeout(redirectTimer);
  }, [navigate]); // Dependency array includes navigate to ensure effect runs if navigate changes (though it's stable)

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-zinc-600 to-zinc-900 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 p-8 md:p-12 rounded-lg shadow-2xl text-center max-w-md w-full border border-gray-200 dark:border-gray-700"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-6"
        >
          <CheckCircle className="w-20 h-20 mx-auto text-green-500 dark:text-green-400" />
        </motion.div>
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-4"
        >
          Test Completed!
        </motion.h1>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-lg text-gray-700 dark:text-gray-300 mb-6"
        >
          Thank you for completing the test. You can now close this window, or
          you will be redirected to your dashboard shortly.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
          className="text-sm text-gray-500 dark:text-gray-400"
        >
          Redirecting to dashboard...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ThankYouPage;
