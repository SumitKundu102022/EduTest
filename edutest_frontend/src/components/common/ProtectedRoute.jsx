// src/components/common/ProtectedRoute.jsx
import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Import your authentication context
import { motion } from 'framer-motion';
import { toast } from 'sonner';

/**
 * ProtectedRoute Component
 *
 * This component acts as a gatekeeper for routes that require user authentication
 * and potentially specific roles.
 *
 * It checks the authentication status and the user's role using the `useAuth` hook.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The child components (the content of the protected route).
 * @param {Array<string>} [props.allowedRoles] - An optional array of roles that are allowed to access this route (e.g., ['admin', 'candidate']).
 * If not provided, only authentication is checked.
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuth(); // Get user and loading state from AuthContext

  // Debugging logs
  useEffect(() => {
    // console.log('ProtectedRoute Check:');
    // console.log('  isLoading:', isLoading);
    // console.log('  user:', user);
    // console.log('  user.role:', user ? user.role : 'N/A');
    // console.log('  allowedRoles:', allowedRoles);

    if (!isLoading) {
      // console.log("USER: --------------------->",user);
      if (!user) {
        // toast.error("You need to log in to access this page.");
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        toast.error("Access Denied: You do not have the required permissions.");
      }
    }
  }, [isLoading, user, allowedRoles]); // Dependencies for useEffect

  // If authentication status is still being determined, show a loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
          className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
        ></motion.div>
        <p className="ml-4 text-xl text-red-500 dark:text-gray-300">Loading user session...</p>
      </div>
    );
  }

  // If not loading and no user is found, redirect to the login page
  if (!user) {
    // console.log('ProtectedRoute: User is null, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  // If user is found but their role is not allowed, redirect to a suitable page
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    //console.log(`ProtectedRoute: User role "${user.role}" not in allowed roles [${allowedRoles.join(', ')}]. Redirecting.`);
    // Redirect based on current user role if they are logged in but not authorized for this specific route
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'candidate') {
      return <Navigate to="/candidate/dashboard" replace />;
    }
    // Fallback if role is unknown or no specific dashboard for their role
    return <Navigate to="/login" replace />;
  }

  // If user is authenticated and authorized by role, render the children (the protected content)
  // console.log('ProtectedRoute: Access granted for user:', user.email, 'with role:', user.role);
  return children;
};

export default ProtectedRoute;




// // src/components/common/ProtectedRoute.jsx
// import React, { useEffect } from "react";
// import { Navigate } from "react-router-dom";
// import { useAuth } from "../../contexts/AuthContext"; // Import your authentication context
// import { motion } from "framer-motion";

// /**
//  * ProtectedRoute Component
//  *
//  * This component acts as a gatekeeper for routes that require user authentication.
//  * It checks the authentication status using the `useAuth` hook.
//  *
//  * If the user is not authenticated:
//  * - It redirects them to the login page.
//  *
//  * If the authentication status is still loading:
//  * - It displays a loading spinner or message.
//  *
//  * If the user is authenticated:
//  * - It renders the `children` components, allowing access to the protected route.
//  *
//  * @param {Object} props - The component props.
//  * @param {React.ReactNode} props.children - The child components (the content of the protected route).
//  */
// const ProtectedRoute = ({ children }) => {
//   const { user, isLoading } = useAuth(); // Get user and loading state from AuthContext

//   // Effect to log authentication status (for debugging/understanding flow)
//   useEffect(() => {
//     if (!isLoading) {
//       if (user) {
//         console.log("ProtectedRoute: User is authenticated.", user.email);
//       } else {
//         console.log(
//           "ProtectedRoute: User is NOT authenticated. Redirecting to login."
//         );
//       }
//     }
//   }, [isLoading, user]);

//   // If authentication status is still being determined, show a loading state
//   if (isLoading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{
//             duration: 0.5,
//             repeat: Infinity,
//             repeatType: "reverse",
//             ease: "easeInOut",
//           }}
//           className="text-2xl font-semibold text-blue-600 dark:text-blue-400"
//         >
//           Loading user session...
//         </motion.div>
//       </div>
//     );
//   }

//   // If not loading and no user is found, redirect to the login page
//   if (!user) {
//     // Navigate component from react-router-dom is used for declarative redirection
//     return <Navigate to="/login" replace />;
//   }

//   // If user is authenticated, render the children (the protected content)
//   return children;
// };

// export default ProtectedRoute;
