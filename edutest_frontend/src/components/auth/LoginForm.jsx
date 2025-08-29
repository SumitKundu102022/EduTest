// src/components/auth/LoginForm.jsx
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../ui/input"; // Shadcn/ui input
import { Button } from "../ui/button"; // Shadcn/ui button
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons from lucide-react
import { Link } from "react-router-dom"; // Import Link for Forgot Password
import Spinner from "../common/Spinner";
//import googleIcon from "../../assets/google.svg"; // Import your Google icon here

const LoginForm = () => {
  const { login, isLoading, handleGoogleAuthResponse } = useAuth(); // Get the new handler from AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  //const [isSmallScreen, setIsSmallScreen] = useState(false);

  // Ref for the main login button to measure its width
  const loginButtonRef = useRef(null);
  // State to store the calculated width for the Google button
  const [googleButtonWidth, setGoogleButtonWidth] = useState(0);

  // Use useLayoutEffect for DOM measurements
  // useLayoutEffect(() => {
  //   const updateGoogleButtonWidth = () => {
  //     if (loginButtonRef.current) {
  //       const width = loginButtonRef.current.clientWidth;
  //       setGoogleButtonWidth(width);
  //       console.log(
  //         "LoginForm: Main Login Button Width (useLayoutEffect):",
  //         width
  //       );
  //     } else {
  //       console.log(
  //         "LoginForm: loginButtonRef.current is null in useLayoutEffect."
  //       );
  //     }
  //   };

  //   // Initial width calculation
  //   updateGoogleButtonWidth();

  //   // Add a small timeout as a fallback, in case initial measurement is 0
  //   // This is less ideal but can help if the element isn't ready immediately
  //   const timeoutId = setTimeout(updateGoogleButtonWidth, 100); // Try again after 100ms

  //   // Add event listener for window resize to re-calculate width
  //   window.addEventListener("resize", updateGoogleButtonWidth);

  //   // Cleanup listener on component unmount
  //   return () => {
  //     window.removeEventListener("resize", updateGoogleButtonWidth);
  //     clearTimeout(timeoutId); // Clear the timeout
  //   };
  // }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

  // // Log the state of googleButtonWidth whenever it changes
  // useEffect(() => {
  //   console.log(
  //     "LoginForm: googleButtonWidth state updated to:",
  //     googleButtonWidth
  //   );
  // }, [googleButtonWidth]);

  // useEffect(() => {
  //   const checkScreenSize = () => {
  //     // Define your breakpoint for small screen, e.g., 768px (Tailwind's 'md' breakpoint)
  //     //if(window.innerWidth < 478) // Adjusted breakpoint for smaller screens
  //     setIsSmallScreen(window.innerWidth < 478);
  //   };

  //   // Initial check
  //   checkScreenSize();

  //   // Add event listener for window resize
  //   window.addEventListener("resize", checkScreenSize);

  //   // Cleanup listener on component unmount
  //   return () => window.removeEventListener("resize", checkScreenSize);
  // }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

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

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

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

  const handleForgotPassword = () => {
    // In a real application, this would navigate to a "Forgot Password" page
    // or open a dialog/modal for password reset.
    alert("Forgot Password functionality is not yet implemented."); // Using alert for demonstration, replace with a proper UI message
    console.log("Forgot Password clicked!");
  };

  return (
    <>
      {
        isLoading ? <Spinner /> : 
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
          >
            {" "}
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6">
              Login to eduTest
            </h2>
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border rounded-md dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-blue-500 "
              />
            </div>
            <div className="relative">
              {" "}
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
            <div className="flex justify-end text-sm">
              <Link
                to="#" // You can replace this with a specific route like "/forgot-password"
                onClick={handleForgotPassword}
                className="text-zinc-700 hover:underline dark:text-zinc-500"
              >
                Forgot Password?
              </Link>
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="w-full text-white font-bold py-3 rounded-md transition-colors duration-300 cursor-pointer" // Added bg-blue-600 and hover style
                disabled={isLoading}
                ref={loginButtonRef} // Attach the ref to the main login button
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </motion.div>
            <div className="relative flex items-center justify-center my-4">
              <span className="absolute bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400">
                OR
              </span>
              <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            {/* --- NEW LOG BEFORE THE GOOGLE LOGIN MOTION.DIV --- */}
            {/* {console.log("LoginForm: Reached Google Login section in JSX.")} */}
            {/* --- END NEW LOG --- */}
            {/* <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex justify-center"
        > */}
            {/* <Button
            onClick={handleGoogleAuthResponse} // Pass 'user' role
            className="w-full bg-white hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600 font-bold py-3 rounded-md flex items-center justify-center transition-colors duration-300 cursor-pointer border border-gray-300 dark:border-gray-600"
            disabled={isLoading}
          >
            <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" /> Login
            with Google
          </Button> */}
            {/* Conditionally render GoogleLogin based on screen size */}
            {/* {isSmallScreen ? (
            <GoogleLogin
              width="340" // Fixed width for small screens
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
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex justify-center"
            >
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
      }
    </>
  );
};

export default LoginForm;
