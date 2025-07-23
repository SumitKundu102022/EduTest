// src/pages/LoginPage.jsx
import LoginForm from "@components/auth/LoginForm";
import { useGreetings } from "@hooks/useGreetings";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const LoginPage = () => {
  const greeting = useGreetings();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-gray-900 dark:to-gray-800">
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
            className="text-4xl font-extrabold text-gray-900 dark:text-gray-50 mb-2 drop-shadow-lg"
          >
            Welcome to EduTest!
          </motion.h1>
          <motion.p
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg text-gray-700 dark:text-gray-300 font-medium"
          >
            {greeting}
          </motion.p>
        </div>
        <LoginForm />
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-4">
          <div className="text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <p>
              <Link
                to="/register"
                className="text-zinc-700 hover:underline dark:text-zinc-900 font-semibold"
              >
                Sign Up
              </Link>
            </p>
          </div>

          <div className="text-center text-gray-600 dark:text-gray-400">
            Already an Admin?{" "}
            <p>
              <Link
                to="/admin/login"
                className="text-zinc-700 hover:underline dark:text-zinc-900 font-semibold"
              >
                Admin Login
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
