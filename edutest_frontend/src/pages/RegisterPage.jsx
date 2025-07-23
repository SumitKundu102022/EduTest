// src/pages/RegisterPage.jsx
import RegisterForm from "@components/auth/RegisterForm"; // Import the RegisterForm component
import { useGreetings } from "@hooks/useGreetings"; // Re-use the greeting hook
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // For linking to the login page

/**
 * RegisterPage Component
 *
 * This component serves as the page for user registration.
 * It displays a greeting message based on the time of day and
 * renders the `RegisterForm` component, allowing users to create a new account.
 *
 * Features:
 * - Dynamic greeting message (Good Morning/Afternoon/Evening/Night).
 * - Renders the `RegisterForm` for user input.
 * - Provides a link for users who already have an account to navigate to the login page.
 * - Uses Framer Motion for smooth entry animations for the page content.
 * - Responsive design using Tailwind CSS.
 */
const RegisterPage = () => {
  const greeting = useGreetings(); // Get the dynamic greeting

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-purple-100 to-blue-100 dark:from-gray-900 dark:to-gray-800">
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
            className="text-4xl font-extrabold text-zinc-900 dark:text-gray-50 mb-2 drop-shadow-lg"
          >
            Join EduTest Today!
          </motion.h1>
          <motion.p
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-gray-700 dark:text-gray-300 font-medium"
          >
            {greeting} Create your account to get started.
          </motion.p>
        </div>
        {/* Register Form Component */}
        <RegisterForm />
        <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-zinc-700 hover:underline dark:text-zinc-900 font-semibold"
          >
            Login here
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
