// src/pages/CandidateDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from "react-router-dom";
import { Button } from '@components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { useGreetings } from '@hooks/useGreetings';
import { toast } from 'sonner';
// import CandidateNavbar from '../components/common/CandidateNavbar';
import ApplicationForm from '@components/candidate/ApplicationForm';
import api from '@lib/api'; // Import the centralized API client
import Navbar from '@components/common/Navbar';

/**
 * CandidateDashboardPage Component
 *
 * This component serves as the main dashboard for a candidate user.
 * It now conditionally renders an application form if the candidate is new,
 * otherwise, it displays their personalized dashboard with test information.
 *
 * Features:
 * - Displays a greeting message based on the time of day, personalized with the user's name.
 * - **Conditional Rendering**: Shows `ApplicationForm` for new candidates.
 * - Shows a placeholder for performance summary (e.g., total tests, average score).
 * - Lists recent tests with links to review results.
 * - Lists upcoming tests assigned by an admin.
 * - Provides a prominent button to create a new test (if allowed for candidates, or attend a general test).
 * - Includes a logout button (via Navbar).
 * - Uses Shadcn/ui for components (Button, Card) and Framer Motion for animations.
 * - Integrates with `AuthContext` to get user data and handle logout.
 */
const CandidateDashboardPage = () => {
  const {
    user,
    updateUser,
    isLoading: isAuthLoading,
    checkAuthStatus,
  } = useAuth(); // Get user and updateUser function
  let greeting = useGreetings();
  const navigate = useNavigate();
  const [recentTests, setRecentTests] = useState([]);
  const [upcomingTests, setUpcomingTests] = useState([]);
  const [performanceSummary, setPerformanceSummary] = useState({
    totalTests: 0,
    averageScore: 0,
    testsCompleted: 0,
  });
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isApplicationCompleted, setIsApplicationCompleted] = useState(
    user?.isApplicationCompleted || false
  );
  const [currentTime, setCurrentTime] = useState(new Date()); // State to track current time for button disabling
  const [dashboardData, setDashboardData] = useState(null);

  // Update current time every second for accurate button disabling
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, []);

  useEffect(() => {
    // If AuthContext is still loading, wait for it.
    if (isAuthLoading) {
      return;
    }

    // If user is not logged in AFTER AuthContext has loaded, redirect to login
    if (!user) {
      toast.error("You need to log in to access this page.");
      navigate("/login", { replace: true });
      return;
    }

    // If the user is a candidate but their application is not completed, show the form
    if (user.role === "candidate" && !user.isApplicationCompleted) {
      setIsApplicationCompleted(false);
      setIsLoadingData(false); // Stop loading dashboard data if application is pending
      return;
    }

    // If the application is completed, fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoadingData(true);
      try {
        const response = await api.get("/candidate/dashboard");
        const { recentTests, upcomingTests, performanceSummary } =
          response.data;

        setRecentTests(recentTests);
        setUpcomingTests(upcomingTests);
        setPerformanceSummary(performanceSummary);
        // toast.success("Candidate dashboard data loaded!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Failed to load dashboard data.";
        toast.error(errorMessage);
        console.error("Dashboard data fetch error:", error);

        // If a 401 occurs here, it means the token was invalid/expired.
        // Trigger the AuthContext's checkAuthStatus to handle logout and redirect.
        if (error.response?.status === 401) {
          checkAuthStatus(); // This will log out and redirect
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    // Only fetch data if user is a candidate AND application is completed AND AuthContext has finished loading
    if (
      user.role === "candidate" &&
      user.isApplicationCompleted &&
      !isAuthLoading
    ) {
      fetchDashboardData();
    }
  }, [
    user,
    isApplicationCompleted,
    isAuthLoading,
    navigate,
    checkAuthStatus,
    updateUser,
  ]); // Depend on user and isApplicationCompleted

  // Callback for when the application form is completed
  const handleApplicationComplete = () => {
    setIsApplicationCompleted(true);
    // Update the user object in AuthContext to reflect application completion
    updateUser({ ...user, isApplicationCompleted: true });
    // Re-fetch dashboard data immediately after application is complete
    // This will trigger the useEffect due to isApplicationCompleted change
  };

  const handleStartTest = async (testId) => {
    try {
      // const response = await api.get(`/tests/${testId}/session/start`);
      // toast.success("Test session started!");
      // navigate(`/test/${response.data.sessionId}`);
      navigate(`/take-test/${testId}`);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to start test session.";
      toast.error(errorMessage);
      console.error("Start test error:", error);
      if (error.response?.status === 403) {
        // Specific handling for forbidden (test not yet scheduled)
        // No redirect, just show the error message
      } else if (error.response?.status === 401) {
        checkAuthStatus();
      }
    }
  };

  // Helper function to check if the test is startable
  /**
   * Determines if a test is currently startable based on its scheduled date and time.
   * Compares current UTC time with the scheduled UTC time of the test.
   * @param {string | Date} scheduledDate - The scheduled date (ISO string or Date object).
   * @param {string} scheduledTime - The scheduled time in "HH:MM" format.
   * @returns {boolean} True if the current time is on or after the scheduled time, false otherwise.
   */
// const isTestStartable = (scheduledDate, scheduledTime) => {
//   if (!scheduledDate || !scheduledTime) {
//     console.log(
//       "isTestStartable: Missing scheduledDate or scheduledTime. Returning false."
//     );
//     return false; // Cannot start if no schedule is set
//   }
  

//   // Ensure scheduledDate is a proper Date object. It might be an ISO string from backend.
//   const dateObj = new Date(scheduledDate);

//   // Extract UTC year, month, day from the scheduled date
//   const year = dateObj.getUTCFullYear();
//   const month = dateObj.getUTCMonth(); // 0-indexed
//   const day = dateObj.getUTCDate();

//   // Parse scheduledTime (e.g., "10:30") into hours and minutes
//   const [hours, minutes] = scheduledTime.split(":").map(Number);

//   // Construct the scheduled time in UTC
//   // Date.UTC(year, month, day, hour, minute, second, millisecond)
//   const testScheduledTime = new Date(
//     Date.UTC(year, month, day, hours, minutes, 0, 0)
//   );

//   // Get the current time in UTC for comparison
//   const now = new Date();
//   const currentUTCTime = new Date(
//     Date.UTC(
//       now.getUTCFullYear(),
//       now.getUTCMonth(),
//       now.getUTCDate(),
//       now.getUTCHours(),
//       now.getUTCMinutes(),
//       now.getUTCSeconds(),
//       now.getUTCMilliseconds()
//     )
//   );

//   console.log(`--- Test Scheduling Check ---`);
//   console.log(`Raw scheduledDate: ${scheduledDate}`);
//   console.log(`Raw scheduledTime: ${scheduledTime}`);
//   console.log(`Parsed Date (UTC components): Y:${year}, M:${month}, D:${day}`);
//   console.log(`Parsed Time (HH:MM): ${hours}:${minutes}`);
//   console.log(
//     `Constructed Test Scheduled Time (UTC): ${testScheduledTime.toISOString()} (${testScheduledTime.toLocaleString()})`
//   );
//   console.log(
//     `Current UTC Time: ${currentUTCTime.toISOString()} (${currentUTCTime.toLocaleString()})`
//   );
//   console.log(
//     `Comparison (Current UTC >= Scheduled UTC): ${
//       currentUTCTime >= testScheduledTime
//     }`
//   );
//   console.log(`-----------------------------`);

//   return currentUTCTime >= testScheduledTime;
// };

  // const isTestStartable = (scheduledDate, scheduledTime) => {
  //   if (!scheduledDate || !scheduledTime) return false;
  // console.log(
  //   `Scheduled Date: ${scheduledDate}, Scheduled Time: ${scheduledTime}`
  // );

  //   const now = new Date();

  //   // Combine scheduled date and time into a single Date object
  //   const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
  //   console.log("isTested", now >= scheduledDateTime);

  //   return now >= scheduledDateTime;
  // };

  const isTestStartable = (scheduledDate, scheduledTime) => {
    if (!scheduledDate || !scheduledTime) return false;

    const [hours, minutes] = scheduledTime.split(":").map(Number);

    // Combine scheduledDate and scheduledTime as local time
    const scheduledDateTime = new Date(scheduledDate);
    scheduledDateTime.setHours(hours);
    scheduledDateTime.setMinutes(minutes);
    scheduledDateTime.setSeconds(0);
    scheduledDateTime.setMilliseconds(0);

    const now = new Date();

    // console.log(`Scheduled Local Time: ${scheduledDateTime.toLocaleString()}`);
    // console.log(`Current Local Time: ${now.toLocaleString()}`);
    // console.log(`Can start: ${now >= scheduledDateTime}`);

    return now >= scheduledDateTime;
  };


  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  // Show loading spinner if AuthContext is still loading
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
        ></motion.div>
        <p className="ml-4 text-xl text-zinc-600 dark:text-gray-300">
          Loading authentication...
        </p>
      </div>
    );
  }

  // If user is not logged in AFTER AuthContext has loaded, show nothing (useEffect handles redirect)
  if (!user) {
    return null;
  }

  greeting = "Welcome" || greeting; // Ensure greeting is always a string

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 my-15">
      <Navbar />
      <div className="pt-20 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {!isApplicationCompleted ? (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="flex flex-col items-center justify-center min-h-[calc(100vh-100px)]"
            >
              <ApplicationForm
                onApplicationComplete={handleApplicationComplete}
              />
              <p className="text-center text-zinc-600 dark:text-gray-400 mt-6">
                Complete your application to access personalized tests and
                tracking.
              </p>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700"
              >
                <div>
                  <h1 className="text-4xl font-extrabold text-zinc-700 dark:text-zinc-400">
                    {greeting},{" "}
                    <span className="text-red-500">
                      {user?.name || "Candidate"}!
                    </span>
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Your personalized test hub.
                  </p>
                </div>
              </motion.div>

              {isLoadingData ? (
                <div className="flex items-center justify-center h-64">
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="w-12 h-12 border-4 border-red-500 border-t-transparent rounded-full"
                  ></motion.div>
                  <p className="ml-4 text-xl text-red-500 dark:text-gray-300">
                    Loading your dashboard...
                  </p>
                </div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 lg:grid-cols-3 gap-8"
                >
                  {/* Performance Summary Card (Track your test) */}
                  <motion.div
                    variants={itemVariants}
                    className="lg:col-span-1"
                    id="performance"
                  >
                    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-zinc-700 dark:text-gray-100">
                          Track Your Performance
                        </CardTitle>
                        <CardDescription className="text-zinc-600 dark:text-gray-400">
                          Overview of your test history.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                          <span className="text-gray-700 dark:text-gray-300">
                            Total Tests Taken:
                          </span>
                          <span className="font-semibold text-blue-600 dark:text-blue-400">
                            {performanceSummary.totalTests}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                          <span className="text-gray-700 dark:text-gray-300">
                            Tests Completed:
                          </span>
                          <span className="font-semibold text-green-600 dark:text-green-400">
                            {performanceSummary.testsCompleted}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-100 dark:bg-gray-700 rounded-md">
                          <span className="text-gray-700 dark:text-gray-300">
                            Average Score:
                          </span>
                          <span className="font-semibold text-purple-600 dark:text-purple-400">
                            {performanceSummary.averageScore}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
                          Detailed analytics coming soon!
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Recent Tests Card (Review & check result) */}
                  <motion.div
                    variants={itemVariants}
                    className="lg:col-span-2"
                    id="results"
                  >
                    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-zinc-700 dark:text-gray-100">
                          Review & Check Results
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Access your completed test results.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {recentTests.length > 0 ? (
                          <ul className="space-y-4">
                            {recentTests.map((test) => (
                              // console.log("Test--------------->",test),
                              <motion.li
                                key={test.id}
                                variants={itemVariants}
                                className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 items-start sm:items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm border border-gray-200 dark:border-gray-600"
                              >
                                <div>
                                  <p className="font-semibold text-lg text-gray-800 dark:text-gray-200">
                                    {test.name}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Completed on: {test.date}
                                  </p>
                                </div>
                                <div className="flex items-center gap-15 md:gap-4 w-full sm:w-auto">
                                  <div className="flex flex-wrap items-center gap-2">
                                    <span
                                      className={`px-1.5 py-2 rounded-full text-xs font-medium ${
                                        test.reviewStatus === "Reviewed"
                                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                      }`}
                                    >
                                      {test.reviewStatus === "Reviewed"
                                        ? "Result Generated"
                                        : "Waiting for Review"}
                                      {/* {test.score && `(Score: ${test.score})`} */}
                                    </span>
                                  </div>

                                  {test.reviewStatus === "Reviewed" ? (
                                    <Link
                                      to={`/result/${test.lastTestResultId}`}
                                    >
                                      <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <div className="w-full sm:w-auto">
                                          <Button
                                            variant="outline"
                                            className="text-white hover:text-zinc-100 bg-gradient-to-r from-zinc-500 to-zinc-600 hover:from-zinc-600 hover:to-zinc-700 dark:text-zinc-400 dark:border-zinc-400 dark:hover:bg-zinc-700 cursor-pointer"
                                          >
                                            View Result
                                          </Button>
                                        </div>
                                      </motion.div>
                                    </Link>
                                  ) : (
                                    <motion.div
                                      whileHover={{ scale: 1.0 }}
                                      whileTap={{ scale: 1.0 }}
                                    >
                                      <div className="w-full sm:w-auto">
                                        <Button
                                          variant="outline"
                                          className="text-zinc-400 bg-zinc-300 cursor-not-allowed dark:bg-zinc-800 dark:text-zinc-500 cursor-pointer-not-allowed"
                                          disabled
                                        >
                                          View Result
                                        </Button>
                                      </div>
                                    </motion.div>
                                  )}
                                </div>
                              </motion.li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-center text-gray-600 dark:text-gray-400">
                            No completed tests to review yet.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Upcoming Tests Card (View upcoming test) */}
                  <motion.div
                    variants={itemVariants}
                    className="lg:col-span-3"
                    id="upcoming"
                  >
                    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-zinc-700 dark:text-gray-100">
                          View Upcoming Tests
                        </CardTitle>
                        <CardDescription className="text-zinc-600 dark:text-zinc-400">
                          Tests assigned to you by administrators.
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {upcomingTests.length > 0 ? (
                          <ul className="space-y-4">
                            {upcomingTests.map((test) => {
                              const isReadyToStart = isTestStartable(
                                test.scheduledDate,
                                test.scheduledTime
                                // console.log("Test Scheduled Date:", test.scheduledDate),
                                // console.log("Test Scheduled Time:", test.scheduledTime)
                              );
                              // console.log(
                              //   "Test Scheduled Time:",
                              //   test.scheduledTime
                              // );
                              // console.log(
                              //   "Test Scheduled Date:",
                              //   test.scheduledDate
                              // );
                              // console.log(`Test ${test.id} is ${isReadyToStart ? 'ready' : 'not ready'} to start.`);
                              //console.log(`Test ${test.id} scheduled for ${test.scheduledDate} at ${test.scheduledTime}`);
                              // console.log("Upcoming Test:", test);
                              // Format scheduledDate for display
                              let scheduledDateDisplay = "N/A";
                              let scheduledLocalTimeDisplay = "N/A"; // New variable for local time display

                              // if (test.scheduledDate) {
                              //   try {
                              //     scheduledDateDisplay = new Date(
                              //       test.scheduledDate
                              //     ).toLocaleDateString(undefined, {
                              //       year: "numeric",
                              //       month: "long",
                              //       day: "numeric",
                              //     });
                              //   } catch (e) {
                              //     console.error(
                              //       "Error formatting scheduledDate:",
                              //       e
                              //     );
                              //     scheduledDateDisplay = "Invalid Date";
                              //   }
                              // }

                              // const scheduledTimeDisplay = test.scheduledTime
                              //   ? new Date(
                              //       `1970-01-01T${test.scheduledTime}`
                              //     ).toLocaleTimeString([], {
                              //       hour: "2-digit",
                              //       minute: "2-digit",
                              //       hour12: true,
                              //     })
                              //   : "N/A";

                              if (test.scheduledDate) {
                                try {
                                  const dateObjForDisplay = new Date(
                                    test.scheduledDate
                                  );
                                  scheduledDateDisplay =
                                    dateObjForDisplay.toLocaleDateString(
                                      undefined,
                                      {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    );

                                  // Construct a Date object in local time for display purposes
                                  // This combines the date part of the UTC scheduledDate with the local scheduledTime string
                                  // to get a Date object that, when formatted, shows the correct local time.
                                  const [hours, minutes] = (
                                    test.scheduledTime || "00:00"
                                  )
                                    .split(":")
                                    .map(Number);
                                  const localScheduledDateTime = new Date(
                                    dateObjForDisplay.getFullYear(),
                                    dateObjForDisplay.getMonth(),
                                    dateObjForDisplay.getDate(),
                                    hours,
                                    minutes
                                  );

                                  scheduledLocalTimeDisplay =
                                    localScheduledDateTime.toLocaleTimeString(
                                      undefined,
                                      {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true, // or false for 24-hour format
                                      }
                                    );

                                  // Add a log for the local time object as well
                                  // console.log(
                                  //   `Local Scheduled DateTime Object: ${localScheduledDateTime.toLocaleString()}`
                                  // );
                                } catch (e) {
                                  console.error(
                                    "Error formatting scheduledDate/Time for display:",
                                    e
                                  );
                                  scheduledDateDisplay = "Invalid Date";
                                  scheduledLocalTimeDisplay = "Invalid Time";
                                }
                              }

                              // const scheduledTimeUTCDisplay =
                              //   test.scheduledTime || "N/A"; // Keep this for clarity if needed

                              return (
                                <motion.li
                                  key={test.id}
                                  variants={itemVariants}
                                  className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:gap-0 items-start sm:items-center p-4 bg-orange-50 dark:bg-blue-950 rounded-md shadow-sm border border-orange-200 dark:border-amber-800"
                                >
                                  <div>
                                    <p className="font-semibold text-lg text-orange-600 dark:text-blue-200">
                                      {test.name}
                                    </p>
                                    <p className="text-sm text-orange-500 dark:text-blue-400">
                                      {/* Scheduled: {test.date} at {test.time} */}
                                      Scheduled: {scheduledDateDisplay} at{" "}
                                      {scheduledLocalTimeDisplay}
                                    </p>
                                    {/* {!isReadyToStart && (
                                          <p className="text-xs text-orange-500 dark:text-red-400 mt-1 font-semibold">
                                            Test is not yet live.
                                          </p>
                                        )} */}
                                  </div>
                                  <div className="flex items-center gap-4">
                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-blue-800 dark:text-blue-100">
                                      {test.status}
                                    </span>
                                    {/* <Link to={`/take-test/${test.id}`}> */}
                                    <motion.div
                                      // whileHover={{ scale: 1.05 }}
                                      // whileTap={{ scale: 0.95 }}
                                      whileHover={{
                                        scale: isReadyToStart ? 1.05 : 1,
                                      }}
                                      whileTap={{
                                        scale: isReadyToStart ? 0.95 : 1,
                                      }}
                                    >
                                      <Button
                                        onClick={() => handleStartTest(test.id)}
                                        disabled={!isReadyToStart}
                                        className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                      >
                                        Start Test
                                      </Button>
                                    </motion.div>
                                    {/* </Link> */}
                                  </div>
                                </motion.li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-center text-gray-600 dark:text-gray-400">
                            No upcoming tests scheduled for you.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>

                  {/* Upcoming Tests Card */}
                  {/* <motion.div variants={itemVariants}>
                    <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg h-full flex flex-col">
                      <CardHeader>
                        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                          Upcoming Tests
                        </CardTitle>
                        <CardDescription className="text-gray-600 dark:text-gray-400">
                          Tests assigned to you, waiting to be taken.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow">
                        {upcomingTests.length > 0 ? (
                          <ul className="space-y-4">
                            {upcomingTests.map((test) => {
                              const isReadyToStart = isTestStartable(
                                test.scheduledDate,
                                test.scheduledTime
                              );

                              // Format scheduledDate for display
                              let scheduledDateDisplay = "N/A";
                              if (test.scheduledDate) {
                                try {
                                  scheduledDateDisplay = new Date(
                                    test.scheduledDate
                                  ).toLocaleDateString(undefined, {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  });
                                } catch (e) {
                                  console.error(
                                    "Error formatting scheduledDate:",
                                    e
                                  );
                                  scheduledDateDisplay = "Invalid Date";
                                }
                              }

                              const scheduledTimeDisplay =
                                test.scheduledTime || "N/A";

                              return (
                                <li
                                  key={test.id}
                                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2"
                                >
                                  <div>
                                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                                      {test.name}
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      Questions: {test.numQuestions} | Time
                                      Limit: {test.timeLimit} mins
                                    </p>
                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                      Scheduled: {scheduledDateDisplay} at{" "}
                                      {scheduledTimeDisplay}
                                    </p>
                                    {!isReadyToStart && (
                                      <p className="text-xs text-red-500 dark:text-red-400 mt-1">
                                        Test not yet available.
                                      </p>
                                    )}
                                  </div>
                                  <motion.div
                                    whileHover={{
                                      scale: isReadyToStart ? 1.05 : 1,
                                    }}
                                    whileTap={{
                                      scale: isReadyToStart ? 0.95 : 1,
                                    }}
                                  >
                                    <Button
                                      onClick={() => handleStartTest(test.id)}
                                      disabled={!isReadyToStart}
                                      className={`px-4 py-2 rounded-md transition ${
                                        isReadyToStart
                                          ? "bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                                          : "bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                                      }`}
                                    >
                                      Start Test
                                    </Button>
                                  </motion.div>
                                </li>
                              );
                            })}
                          </ul>
                        ) : (
                          <p className="text-center text-gray-600 dark:text-gray-400">
                            No upcoming tests assigned.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div> */}
                </motion.div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateDashboardPage;

