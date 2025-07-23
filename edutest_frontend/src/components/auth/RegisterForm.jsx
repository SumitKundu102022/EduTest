// src/components/auth/RegisterForm.jsx
import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext"; // Import your authentication context
import { Input } from "../ui/input"; // Shadcn/ui input
import { Button } from "../ui/button"; // Shadcn/ui button
import { Label } from "../ui/label"; // Shadcn/ui label
import { motion } from "framer-motion";
import { Link } from "react-router-dom"; // For linking to the login page
import googleIcon from "../../assets/google.svg"; // Import your Google icon here
import { Eye, EyeOff } from "lucide-react"; // Import eye icons from lucide-react
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component


/**
 * RegisterForm Component
 *
 * This component provides the user interface for new user registration.
 * It allows users to input their name, email, and password,
 * and also offers an option to register via Google account.
 *
 * Features:
 * - Input fields for name, email, and password.
 * - Integration with `AuthContext` to handle the registration logic.
 * - Loading state management to disable buttons during submission.
 * - "Register with Google" button (conceptual, requires backend integration).
 * - Uses Shadcn/ui `Input`, `Button`, and `Label` components for consistent styling.
 * - Applies Framer Motion for subtle animations on form elements and buttons.
 */
const RegisterForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const { register, isLoading, handleGoogleAuthResponse } = useAuth(); // Get register function and loading state from AuthContext

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

  /**
   * Handles the form submission for email/password registration.
   * Prevents default form submission, then calls the `register` function
   * from the authentication context with the provided credentials.
   * @param {Event} e - The form submission event.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    register(name, email, password);
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-5 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
        Create Your Account
      </h2>

      {/* Name Input */}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Your Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-blue-500"
        />
      </div>

      {/* Email Input */}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Your Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-blue-500"
        />
      </div>

      {/* Password Input */}
      {/* <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-blue-500 "
        />
      </div> */}
      <Label htmlFor="password">Password</Label>
      <div className="relative">
        {/* {" "} */}
        {/* Added relative positioning for the icon */}
        <Input
          type={showPassword ? "text" : "password"} // Toggle type based on state
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-blue-500 pr-10" // Added pr-10 for icon space
        />
        <motion.button
          type="button" // Important: type="button" to prevent form submission
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-gray-400 cursor-pointer"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <Eye className="h-5 w-5" />
          ) : (
            <EyeOff className="h-5 w-5" />
          )}
        </motion.button>
      </div>

      {/* Register Button with Framer Motion */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          className="w-full text-white font-bold py-3 rounded-md transition-colors duration-300 text-sm cursor-pointer"
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? "Registering..." : "Register"}
        </Button>
      </motion.div>

      {/* OR Separator */}
      <div className="relative flex items-center justify-center my-4">
        <span className="absolute bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">
          OR
        </span>
        <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
      </div>

      {/* Google Register Button with Framer Motion */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {/* <Button
          onClick={loginWithGoogle} // Call Google login from AuthContext
          className="w-full bg-white hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600 font-bold py-3 rounded-md flex items-center justify-center transition-colors duration-300 text-sm cursor-pointer border border-gray-300 dark:border-gray-600"
          disabled={isLoading} // Disable button while loading
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />{" "}
          
          Register with Google
        </Button> */}
        <GoogleLogin
                  onSuccess={onSuccess}
                  onError={onError}
          scope="openid email profile" // Ensure openid, email, and profile scopes are requested
        />
      </motion.div>

      <div className="text-center font-light flex justify-center font-stretch-50%">
        <p className="flex flex-wrap justify-center">
          By signing up to create an account I accept Company's{" "}
          <a
            href="http://"
            className="text-blue-600 hover:underline dark:text-blue-400 font-normal ml-1"
          >
            Terms of Use and Privacy Policy
          </a>
        </p>
      </div>
    </motion.form>
  );
};

export default RegisterForm;
