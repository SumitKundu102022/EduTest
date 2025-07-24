// src/components/auth/AdminLoginForm.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
  const [isSmallScreen, setIsSmallScreen] = useState(false);

// Ref for the main login button to measure its width
  const loginButtonRef = useRef(null);
  // State to store the calculated width for the Google button
  const [googleButtonWidth, setGoogleButtonWidth] = useState(0);

  // useEffect(() => {
  //   const checkScreenSize = () => {
  //     // Define your breakpoint for small screen, e.g., 768px (Tailwind's 'md' breakpoint)
  //     setIsSmallScreen(window.innerWidth < 768);
  //   };

  //   // Initial check
  //   checkScreenSize();

  //   // Add event listener for window resize
  //   window.addEventListener("resize", checkScreenSize);

  //   // Cleanup listener on component unmount
  //   return () => window.removeEventListener("resize", checkScreenSize);
  // }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // Function to handle successful Google login response
  
  // Use useLayoutEffect for DOM measurements
    
  useLayoutEffect(() => {
      const updateGoogleButtonWidth = () => {
        if (loginButtonRef.current) {
          const width = loginButtonRef.current.clientWidth;
          setGoogleButtonWidth(width);
          // console.log(
          //   "LoginForm: Main Login Button Width (useLayoutEffect):",
          //   width
          // );
        } else {
          console.log(
            "LoginForm: loginButtonRef.current is null in useLayoutEffect."
          );
        }
      };
  
      // Initial width calculation
      updateGoogleButtonWidth();
  
      // Add a small timeout as a fallback, in case initial measurement is 0
      // This is less ideal but can help if the element isn't ready immediately
      const timeoutId = setTimeout(updateGoogleButtonWidth, 100); // Try again after 100ms
  
      // Add event listener for window resize to re-calculate width
      window.addEventListener("resize", updateGoogleButtonWidth);
  
      // Cleanup listener on component unmount
      return () => {
        window.removeEventListener("resize", updateGoogleButtonWidth);
        clearTimeout(timeoutId); // Clear the timeout
      };
    }, []); // Empty dependency array means this runs once on mount and cleans up on unmount
  
    // Log the state of googleButtonWidth whenever it changes
    useEffect(() => {
      // console.log(
      //   "LoginForm: googleButtonWidth state updated to:",
      //   googleButtonWidth
      // );
    }, [googleButtonWidth]);
  
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
          ref={loginButtonRef}
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
      {/* <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex justify-center"
      > */}
        {/* <Button
          onClick={() => loginWithGoogle("admin")} // Pass 'admin' role for Google login
          className="w-full bg-white hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600 font-bold py-3 rounded-md flex items-center justify-center transition-colors duration-300 border border-gray-300 dark:border-gray-600 cursor-pointer"
          disabled={isLoading}
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />
          Login with Google (Admin)
        </Button> */}
        {/* Conditionally render GoogleLogin based on screen size */}
        {/* {isSmallScreen ? (
          <GoogleLogin
            width="310" // Fixed width for small screens
            onSuccess={onSuccess}
            onError={onError}
            scope="openid email profile"
          />
        ) : (
          <GoogleLogin
            width="500" // Fixed width for large screens
            onSuccess={onSuccess}
            onError={onError}
            scope="openid email profile"
          />
        )} */}
      {/* </motion.div> */}
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex justify-center">
              {/* {console.log("LoginForm: Current googleButtonWidth for rendering:", googleButtonWidth)} */}
              {googleButtonWidth > 0 ? (
                <GoogleLogin
                  width={googleButtonWidth.toString()} // Pass the dynamically calculated width
                  onSuccess={onSuccess}
                  onError={onError}
                  scope="openid email profile"
                />
              ) : (
                <div className="w-full h-12 flex items-center justify-center text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 rounded-md">
                  Loading Google button...
                </div>
              )}
            </motion.div>
      
    </motion.form>
  );
};

export default AdminLoginForm;
