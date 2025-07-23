// // src/contexts/AuthContext.jsx
// import React, { createContext, useContext, useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast } from "sonner";

// const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   // user state now includes 'role' and 'isApplicationCompleted'
//   const [user, setUser] = useState(null); // { name, email, token, role: 'candidate' | 'admin', isApplicationCompleted: boolean }
//   const [isLoading, setIsLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const storedUser = localStorage.getItem("eduTestUser");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//     setIsLoading(false);
//   }, []);

//   const login = async (email, password, role = "candidate") => {
//     setIsLoading(true);
//     try {
//       let userData;
//       if (email === "admin@edutest.com" && password === "adminpass") {
//         userData = {
//           name: "Admin User",
//           email: email,
//           token: "fake-admin-token",
//           role: "admin",
//           isApplicationCompleted: true,
//         }; // Admins don't have an application form
//       } else if (
//         email === "sumitkundu10012001@gmail.com" &&
//         password === "pass"
//       ) {
//         userData = {
//           name: "Candidate User",
//           email: email,
//           token: "fake-candidate-token",
//           role: "candidate",
//           isApplicationCompleted: false,
//         }; // Simulate new candidate
//       } else if (
//         email === "completed@edutest.com" &&
//         password === "completedpass"
//       ) {
//         // New test user for completed app
//         userData = {
//           name: "Completed Candidate",
//           email: email,
//           token: "fake-completed-token",
//           role: "candidate",
//           isApplicationCompleted: true,
//         };
//       } else {
//         throw new Error("Invalid credentials");
//       }

//       setUser(userData);
//       localStorage.setItem("eduTestUser", JSON.stringify(userData));
//       toast.success("Login successful! Welcome back.");

//       if (userData.role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/candidate/dashboard");
//       }
//     } catch (error) {
//       toast.error(
//         error.message || "Login failed. Please check your credentials."
//       );
//       console.error("Login error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const register = async (name, email, password) => {
//     setIsLoading(true);
//     try {
//       // New registered users are initially considered to have an incomplete application
//       const userData = {
//         name: name,
//         email: email,
//         token: "fake-jwt-token-" + Date.now(),
//         role: "candidate",
//         isApplicationCompleted: false,
//       };
//       setUser(userData);
//       localStorage.setItem("eduTestUser", JSON.stringify(userData));
//       toast.success("Registration successful! Welcome.");
//       navigate("/candidate/dashboard");
//     } catch (error) {
//       toast.error("Registration failed. Please try again.");
//       console.error("Registration error:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const logout = () => {
//     setUser(null);
//     localStorage.removeItem("eduTestUser");
//     toast.info("You have been logged out.");
//     navigate("/login");
//   };

//   const loginWithGoogle = async (role = "candidate") => {
//     toast.info("Google login initiated (requires backend integration).");
//     try {
//       const userData = {
//         name: "Google User",
//         email: "google@example.com",
//         token: "fake-google-token",
//         role: role,
//         isApplicationCompleted: role === "admin" ? true : false, // Simulate new candidate for Google login too
//       };
//       setUser(userData);
//       localStorage.setItem("eduTestUser", JSON.stringify(userData));
//       toast.success("Google login successful!");
//       if (role === "admin") {
//         navigate("/admin/dashboard");
//       } else {
//         navigate("/candidate/dashboard");
//       }
//     } catch (error) {
//       toast.error("Google login failed.");
//       console.error("Google login error:", error);
//     }
//   };

//   // Function to update user data in context and local storage
//   const updateUser = (newUserData) => {
//     setUser(newUserData);
//     localStorage.setItem("eduTestUser", JSON.stringify(newUserData));
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         login,
//         register,
//         logout,
//         loginWithGoogle,
//         updateUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
//import { useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // True initially to indicate loading from localStorage
  const navigate = useNavigate();

  // Function to load user from localStorage
  const loadUserFromLocalStorage = useCallback(() => {
    try {
      const storedUser = localStorage.getItem("eduTestUser");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } else {
        setUser(null);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage:", e);
      localStorage.removeItem("eduTestUser"); // Clear corrupted data
      setUser(null);
    } finally {
      setIsLoading(false); // Finished loading from localStorage
    }
  }, []);

  useEffect(() => {
    loadUserFromLocalStorage();
  }, [loadUserFromLocalStorage]); // Run once on mount

  // This function can be called by components to re-verify auth status
  // especially after an API call returns a 401.
  const checkAuthStatus = useCallback(async () => {
    setIsLoading(true);
    try {
      // Attempt to fetch user profile using the current token
      const response = await api.get("/auth/profile"); // This endpoint requires a valid token
      const userData = response.data;
      setUser(userData);
      localStorage.setItem("eduTestUser", JSON.stringify(userData)); // Refresh local storage with latest data
    } catch (error) {
      console.error(
        "Auth status check failed:",
        error.response?.data?.message || error.message
      );
      // If 401 or any other error, it means the token is invalid or expired
      setUser(null);
      localStorage.removeItem("eduTestUser");
      toast.error(
        "Your session has expired or is invalid. Please log in again."
      );
      navigate("/login", { replace: true }); // Redirect to login
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", { email, password });
      const userData = response.data;

      if (!userData.token || !userData.role) {
        throw new Error("Backend did not provide a valid token or role.");
      }

      setUser(userData);
      localStorage.setItem("eduTestUser", JSON.stringify(userData));
      toast.success("Login successful! Welcome back.");

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }
    } catch (error) {
      // const errorMessage =
      //   "Login failed. Please check your credentials";
      // if(error.message.includes("Network Error")) {
      //   toast.error("Network error. Please check your internet connection.");
      // } else {
      //   toast.error(error.response?.data?.message || errorMessage);
      // }
      if (
        error.message === "Network Error" ||
        (error.response && error.response.status === 0)
      ) {
        toast.error(
          "Server is unreachable. Please check your internet connection."
        );
      } else {
        const errorMessage =
          error.response?.data?.message ||
          "Login failed. Please check your credentials.";
        toast.error(errorMessage);
      }
      console.error("Login error:", error.response?.data || error.message);

      //console.error('Login error:', error.response?.data || error.message);
      //console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });
      const userData = response.data;

      if (!userData.token || !userData.role) {
        throw new Error(
          "Backend did not provide a valid token or role after registration."
        );
      }

      setUser(userData);
      localStorage.setItem("eduTestUser", JSON.stringify(userData));
      toast.success("Registration successful! Welcome.");
      navigate("/candidate/dashboard");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error(
        "Registration error:",
        error.response?.data || error.message
      );
    } finally {
      setIsLoading(false);
    }
  };

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem("eduTestUser");
    toast.info("You have been logged out.");
    navigate("/login", { replace: true });
  }, [navigate]);

  // const loginWithGoogle = async (role = "candidate") => {
  //   toast.info(
  //     "Google login initiated (requires full backend OAuth integration)."
  //   );
  //   try {
  //     const userData = {
  //       name: "Google User",
  //       email: "google@example.com",
  //       token: "fake-google-token-from-backend",
  //       role: role,
  //       isApplicationCompleted: role === "admin" ? true : false,
  //     };
  //     setUser(userData);
  //     localStorage.setItem("eduTestUser", JSON.stringify(userData));
  //     toast.success("Google login successful!");
  //     if (role === "admin") {
  //       navigate("/admin/dashboard");
  //     } else {
  //       navigate("/candidate/dashboard");
  //     }
  //   } catch (error) {
  //     const errorMessage =
  //       error.response?.data?.message || "Google login failed.";
  //     toast.error(errorMessage);
  //     console.error(
  //       "Google login error:",
  //       error.response?.data || error.message
  //     );
  //   }
  // };

  // Function to handle successful Google login response

  // const handleGoogleSuccess = async (response) => {
  //   setIsLoading(true);

  //   // --- NEW DEBUG LOG ---
  //   console.log("Google Login Success Response:", response);
  //   console.log("ID Token (response.credential):", response.credential);
  //   // --- END NEW DEBUG LOG ---

  //   try {
  //     // Send the ID token to your backend for verification
  //     const res = await api.post("/auth/google", {
  //       idToken: response.credential, // The ID token is in response.credential
  //     });

  //     // If backend verification is successful, it returns your app's JWT and user data
  //     const userData = res.data;
  //     setUser(userData); // Update AuthContext with the new user data
  //     toast.success("Logged in with Google successfully!");

  //     // Redirect based on user role
  //     if (userData.role === "admin") {
  //       navigate("/admin/dashboard");
  //     } else {
  //       navigate("/candidate/dashboard");
  //     }
  //   } catch (error) {
  //     console.error("Backend Google Auth Error:", error);
  //     toast.error(
  //       error.response?.data?.message ||
  //         "Google login failed. Please try again."
  //     );
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  // // Function to handle Google login failure
  // const handleGoogleFailure = (error) => {
  //   console.error("Google Login Failed:", error);
  //   toast.error("Google login was cancelled or failed.");
  // };

  // // useGoogleLogin hook from @react-oauth/google
  // const loginWithGoogle = useGoogleLogin({
  //   onSuccess: handleGoogleSuccess,
  //   onError: handleGoogleFailure,
  //   // The 'flow' parameter is important for getting the ID token
  //   // 'implicit' flow is used for client-side applications to get ID token directly
  //   // 'auth-code' flow is for server-side applications to get an authorization code first
  //   flow: "implicit", // Request ID token directly
  //   // --- CRITICAL CHANGE HERE ---
  //   scope: 'openid email profile', // Request openid, email, and profile scopes
  //   // --- END CRITICAL CHANGE ---
  // });

  // NEW: Function to handle Google authentication response (takes the ID token)
  const handleGoogleAuthResponse = async (idToken) => {
    setIsLoading(true);
    try {
      if (!idToken) {
        toast.error("Google ID token not received. Please try again.");
        setIsLoading(false);
        return;
      }

      const res = await api.post("/auth/google", { idToken });
      const userData = res.data;

      setUser(userData);
      localStorage.setItem("eduTestUser", JSON.stringify(userData));
      //toast.success("Logged in with Google successfully!");
      toast.success("Login successful! Welcome back.");

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/candidate/dashboard");
      }
    } catch (error) {
      console.error("Google Auth Error:", error);
      toast.error(
        error.response?.data?.message ||
          "Google login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("eduTestUser", JSON.stringify(newUserData));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        handleGoogleAuthResponse,
        updateUser,
        checkAuthStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
