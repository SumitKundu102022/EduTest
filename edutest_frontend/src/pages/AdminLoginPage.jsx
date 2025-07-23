// src/pages/AdminLoginPage.jsx
import AdminLoginForm from "@components/auth/AdminLoginForm"; // The admin-specific login form
import { useGreetings } from "@hooks/useGreetings";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

/**
 * AdminLoginPage Component
 *
 * This component serves as the dedicated login page for administrators.
 * It displays a greeting and renders the `AdminLoginForm` component.
 *
 * Features:
 * - Dynamic greeting message based on the time of day.
 * - Renders the `AdminLoginForm` for admin credentials.
 * - Uses Framer Motion for smooth entry animations.
 * - Distinct styling to differentiate from the candidate login page.
 */
const AdminLoginPage = () => {
  const greeting = useGreetings();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-zinc-700 to-zinc-900 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-4xl font-extrabold text-white mb-2 drop-shadow-lg"
          >
            Admin Access
          </motion.h1>
          <motion.p
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-purple-200 font-medium"
          >
            {greeting} Please log in to manage EduTest.
          </motion.p>
        </div>
        <AdminLoginForm />
        <p className="text-center text-purple-200 mt-4">
          <Link to="/login" className="text-purple-100 hover:underline">
            Back to Candidate Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;
