// src/components/auth/AdminLoginForm.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { motion } from "framer-motion";
import googleIcon from "../../assets/google.svg"; // Import your Google icon here
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component

/**
 * AdminLoginForm Component
 *
 * This component provides the login form specifically for administrators.
 * It uses the `login` function from `AuthContext` but implicitly passes
 * the 'admin' role, or expects the backend to determine it.
 *
 * Features:
 * - Input fields for email and password.
 * - Integration with `AuthContext` for login logic.
 * - Loading state management.
 * - Uses Shadcn/ui components for styling.
 * - Framer Motion for animations.
 */
const AdminLoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading, handleGoogleAuthResponse } = useAuth();

  // Function to handle successful Google login response
  const onSuccess = (response) => {
    // console.log("Google Login Success Response:", response);
    // console.log("ID Token (response.credential):", response.credential);

    // Pass the ID token to the AuthContext handler
    handleGoogleAuthResponse(response.credential);
  };

  // Function to handle Google login failure
  const onError = (error) => {
    console.error("Google Login Failed:", error);
    toast.error("Google login was cancelled or failed.");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the login function, explicitly indicating it's an admin login attempt.
    // The AuthContext's login function will then handle role determination.
    login(email, password, "admin");
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 text-zinc-800"
    >
      <h2 className="text-2xl font-bold text-center text-zinc-900 dark:text-gray-100 mb-6">
        Admin Login
      </h2>
      <div>
        <Label htmlFor="admin-email">Email</Label>
        <Input
          id="admin-email"
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-purple-500"
        />
      </div>
      <div>
        <Label htmlFor="admin-password">Password</Label>
        <Input
          id="admin-password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-purple-500"
        />
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          className="w-full text-white font-bold py-3 rounded-md transition-colors duration-300 cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Login as Admin"}
        </Button>
      </motion.div>
      <div className="relative flex items-center justify-center my-4">
        <span className="absolute bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">
          OR
        </span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {/* <Button
          onClick={() => loginWithGoogle("admin")} // Pass 'admin' role for Google login
          className="w-full bg-white hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600 font-bold py-3 rounded-md flex items-center justify-center transition-colors duration-300 border border-gray-300 dark:border-gray-600 cursor-pointer"
          disabled={isLoading}
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
          Login with Google (Admin)
        </Button> */}
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          scope="openid email profile" // Ensure openid, email, and profile scopes are requested
        />
      </motion.div>
    </motion.form>
  );
};

export default AdminLoginForm;
