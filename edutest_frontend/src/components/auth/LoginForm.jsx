// src/components/auth/LoginForm.jsx
import React, { useState } from "react";
import { GoogleLogin } from '@react-oauth/google'; // Import GoogleLogin component
import { useAuth } from "../../contexts/AuthContext";
import { Input } from "../ui/input"; // Shadcn/ui input
import { Button } from "../ui/button"; // Shadcn/ui button
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // Import eye icons from lucide-react
import { Link } from "react-router-dom"; // Import Link for Forgot Password
import googleIcon from "../../assets/google.svg"; // Import your Google icon here

const LoginForm = () => {
  // // --- NEW TOP-LEVEL LOG ---
  // console.log("LoginForm component is rendering.");
  // // --- END NEW TOP-LEVEL LOG ---

  const { login, isLoading, handleGoogleAuthResponse } = useAuth(); // Get the new handler from AuthContext

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  // const { login, isLoading, loginWithGoogle } = useAuth();

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
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      onSubmit={handleSubmit}
      className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
    >
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
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        {/* <Button
          onClick={loginWithGoogle}
          className="w-full bg-white hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600 font-bold py-3 rounded-md flex items-center justify-center transition-colors duration-300 cursor-pointer border border-gray-300 dark:border-gray-600"
          disabled={isLoading}
        >
          <img src={googleIcon} alt="Google" className="w-5 h-5 mr-2" />{" "}
          Login with Google
        </Button> */}
        {/* {console.log(
          "LoginForm: Attempting to render GoogleLogin component..."
        )} */}
        <GoogleLogin
          width={"100%"}
          onSuccess={onSuccess}
          onError={onError}
          scope="openid email profile" // Ensure openid, email, and profile scopes are requested
          // You can customize the button appearance using the 'theme' or 'size' props
          // For a custom button, you would use the 'render' prop:
          // render={({ onClick, disabled }) => (
          //   <Button onClick={onClick} disabled={disabled} className="w-full ...">
          //     Login with Google
          //   </Button>
          // )}
          render={({ onClick, disabled }) => {
            // --- NEW DEBUG LOG ---
            // console.log("GoogleLogin render prop is being called!");
            // --- END NEW DEBUG LOG ---
            <Button
              onClick={onClick}
              disabled={disabled}
              className="w-full bg-white hover:bg-zinc-100 hover:text-zinc-900 text-zinc-600 font-bold py-3 rounded-md flex items-center justify-center transition-colors duration-300 cursor-pointer border border-gray-300 dark:border-gray-600"
            >
              {/* Google Icon SVG */}
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12.24 10.24v3.52h6.24c-.24 1.44-.96 2.88-2.16 3.84l3.12 2.4c2.16-2.16 3.36-5.04 3.36-8.64 0-.96-.12-1.8-.36-2.64H12.24V10.24z"
                  fill="#4285F4"
                />
                <path
                  d="M12.24 21.6c-3.12 0-5.76-1.68-7.2-4.32l3.12-2.4c.72 1.92 2.4 3.36 4.08 3.36 1.92 0 3.12-.96 3.84-1.68l3.12 2.4c-1.2 1.44-2.88 2.4-4.8 2.4z"
                  fill="#34A853"
                />
                <path
                  d="M5.04 14.88c-.24-.72-.36-1.44-.36-2.16s.12-1.44.36-2.16L1.92 8.16C.72 9.6 0 10.8 0 12c0 1.2.72 2.4 1.92 3.84L5.04 14.88z"
                  fill="#FBBC05"
                />
                <path
                  d="M12.24 4.32c1.44 0 2.64.48 3.6 1.2l2.88-2.88C16.8 1.92 14.4 0 12.24 0 9.12 0 6.48 1.68 5.04 4.32L8.16 6.72c.72-1.92 2.4-3.36 4.08-3.36z"
                  fill="#EA4335"
                />
              </svg>
              Login with Google
            </Button>;
          }}
          // render={({ onClick, disabled }) => {
          //   // --- NEW DEBUG LOG ---
          //   console.log("GoogleLogin render prop is being called!");
          //   // --- END NEW DEBUG LOG ---
          //   return (
          //     <Button
          //       onClick={onClick}
          //       disabled={disabled}
          //       className="w-full flex items-center justify-center gap-2 font-semibold py-2 px-4 rounded-md shadow-md transition-colors duration-300
          //                  !bg-red-700 !border-2 !border-lime-300 hover:!bg-red-800 !text-white" /* Even more distinct style */
          //     >
          //       {/* Google Icon SVG */}
          //       <svg
          //         className="w-5 h-5"
          //         viewBox="0 0 24 24"
          //         fill="currentColor"
          //       >
          //         <path
          //           d="M12.24 10.24v3.52h6.24c-.24 1.44-.96 2.88-2.16 3.84l3.12 2.4c2.16-2.16 3.36-5.04 3.36-8.64 0-.96-.12-1.8-.36-2.64H12.24V10.24z"
          //           fill="#4285F4"
          //         />
          //         <path
          //           d="M12.24 21.6c-3.12 0-5.76-1.68-7.2-4.32l3.12-2.4c.72 1.92 2.4 3.36 4.08 3.36 1.92 0 3.12-.96 3.84-1.68l3.12 2.4c-1.2 1.44-2.88 2.4-4.8 2.4z"
          //           fill="#34A853"
          //         />
          //         <path
          //           d="M5.04 14.88c-.24-.72-.36-1.44-.36-2.16s.12-1.44.36-2.16L1.92 8.16C.72 9.6 0 10.8 0 12c0 1.2.72 2.4 1.92 3.84L5.04 14.88z"
          //           fill="#FBBC05"
          //         />
          //         <path
          //           d="M12.24 4.32c1.44 0 2.64.48 3.6 1.2l2.88-2.88C16.8 1.92 14.4 0 12.24 0 9.12 0 6.48 1.68 5.04 4.32L8.16 6.72c.72-1.92 2.4-3.36 4.08-3.36z"
          //           fill="#EA4335"
          //         />
          //       </svg>
          //       Login with Google {/* Your desired text here */}
          //     </Button>
          //   );
          // }}
        />
      </motion.div>
    </motion.form>
  );
};

export default LoginForm;
