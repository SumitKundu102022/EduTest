// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "@pages/HomePage";
import LoginPage from "@pages/LoginPage";
import RegisterPage from "@pages/RegisterPage";
import CandidateDashboardPage from "@pages/CandidateDashboardPage"; // Renamed
import AdminDashboardPage from "@pages/AdminDashboardPage"; // New
import AdminLoginPage from "@pages/AdminLoginPage"; // New
import CreateTestPage from "@pages/CreateTestPage";
import TakeTestPage from "@pages/TakeTestPage";
import ResultPage from "@pages/ResultPage";
import NotFoundPage from "@pages/NotFoundPage";
import ProtectedRoute from "@components/common/ProtectedRoute"; // A wrapper for protected routes
import { useAuth } from "@contexts/AuthContext"; // Import useAuth to check user role
import ThankYouPage from "@pages/ThankYouPage";
import { Toaster } from 'sonner'; // Import Toaster from sonner


function App() {
  const { user, isLoading } = useAuth(); // Get user and loading state from AuthContext

  // A simple component to redirect based on role after successful login
  const RoleBasedDashboardRedirect = () => {
    if (isLoading) return null; // Or a loading spinner
    if (user?.role === "admin") {
      return <AdminDashboardPage />;
    } else if (user?.role === "candidate") {
      return <CandidateDashboardPage />;
    }
    return <LoginPage />; // Fallback if no user or unknown role
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/login"
          element={
            // <ProtectedRoute allowedRoles={["candidate"]}>
            <LoginPage />
            // </ProtectedRoute>
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />{" "}
        {/* Dedicated admin login */}
        {/* Candidate Protected Routes */}
        <Route
          path="/candidate/dashboard"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/take-test/:testId"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <TakeTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/result/:testSessionId"
          element={
            <ProtectedRoute allowedRoles={["candidate", "admin"]}>
              <ResultPage />
            </ProtectedRoute>
          }
        />
        {/* New Thank You Page Route */}
        <Route
          path="/test-completed"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <ThankYouPage />
            </ProtectedRoute>
          }
        />
        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-test"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <CreateTestPage />
            </ProtectedRoute>
          }
        />{" "}
        {/* Only admin can create tests */}
        {/* Fallback for authenticated users to their respective dashboards */}
        {/* If user is logged in and tries to go to '/', redirect to their dashboard */}
        <Route path="/dashboard" element={<RoleBasedDashboardRedirect />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster richColors position="top-right" />{" "}
      {/* Add the Toaster component here */}
    </div>
  );
}

export default App;
