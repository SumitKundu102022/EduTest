// src/pages/AdminDashboardPage.jsx
import React, { useEffect, useState } from 'react';
import { useAuth } from '@contexts/AuthContext';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@components/ui/button';
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card';
import { useGreetings } from '@hooks/useGreetings';
import { toast } from 'sonner';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import api from '@lib/api'; 
import Navbar from '@components/common/Navbar';
import { DatePicker } from '@components/ui/date-picker'; // Import the new DatePicker

/**
 * AdminDashboardPage Component
 *
 * This component serves as the main dashboard for an administrator.
 * It provides tools for test management, candidate analysis, test assignment,
 * and result status modification.
 *
 * Features:
 * - Personalized greeting for the admin.
 * - Links to create new tests.
 * - Section to analyze candidate performance (with sorting).
 * - Functionality to assign tests to candidates (registered and shortlisted).
 * - Ability to change the review status of candidate test results.
 * - Option to set cut-off marks for exams.
 * - Uses Shadcn/ui components (Button, Card, Table, Select, Input, Label) and Framer Motion for animations.
 * - Integrates with `AuthContext` for user role verification and logout.
 * - Improved responsiveness for table actions and status indicators.
 */
const AdminDashboardPage = () => {
  const { user, logout, isLoading: isAuthLoading, checkAuthStatus } = useAuth();
  let greeting = useGreetings();
  const navigate = useNavigate();

  const [candidates, setCandidates] = useState([]);
  const [tests, setTests] = useState([]);
  const [selectedCandidateId, setSelectedCandidateId] = useState("");
  const [selectedTestId, setSelectedTestId] = useState("");
  const [cutoffMarks, setCutoffMarks] = useState({}); // { testId: cutoffValue }
  const [testDetailsToUpdate, setTestDetailsToUpdate] = useState({}); // { testId: { cutoffMark, scheduledDate, scheduledTime } }
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    // If AuthContext is still loading, wait for it.
    if (isAuthLoading) {
      return;
    }

    // Redirect if not admin AFTER AuthContext has loaded
    if (!user || user.role !== "admin") {
      toast.error(
        "Access Denied: You must be an administrator to view this page."
      );
      navigate("/login", { replace: true });
      return;
    }

    const fetchAdminData = async () => {
      setIsLoadingData(true);
      try {
        // Fetch candidates
        const candidatesRes = await api.get("/admin/candidates");
        setCandidates(candidatesRes.data);

        // Fetch tests
        const testsRes = await api.get("/tests");
        setTests(testsRes.data);

        // Fetch existing cutoff marks (if any)
        // const initialCutoffs = {};
        // testsRes.data.forEach((test) => {
        //   if (test.cutoffMark !== undefined) {
        //     initialCutoffs[test._id] = test.cutoffMark;
        //   }
        // });
        // setCutoffMarks(initialCutoffs);
        const initialTestDetails = {};
        testsRes.data.forEach((test) => {
          // Parse existing scheduledDate string into a Date object for DatePicker
          const parsedDate = test.scheduledDate
            ? new Date(test.scheduledDate)
            : undefined;
          initialTestDetails[test._id] = {
            cutoffMark: test.cutoffMark !== undefined ? test.cutoffMark : 50,
            scheduledDate: parsedDate, // Store as Date object
            scheduledTime: test.scheduledTime || "00:00",
          };
        });
        setTestDetailsToUpdate(initialTestDetails);

        // toast.success("Admin dashboard data loaded!");
      } catch (error) {
        const errorMessage =
          error.response?.data?.message ||
          "Failed to load admin dashboard data.";
        toast.error(errorMessage);
        console.error("Admin data fetch error:", error);

        // If a 401 occurs here, it means the token was invalid/expired.
        // Trigger the AuthContext's checkAuthStatus to handle logout and redirect.
        if (error.response?.status === 401) {
          checkAuthStatus(); // This will log out and redirect
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    // Only fetch data if user is an admin AND AuthContext has finished loading
    if (user && user.role === "admin" && !isAuthLoading) {
      fetchAdminData();
    }
  }, [user, navigate, isAuthLoading, checkAuthStatus]); // Added isAuthLoading and checkAuthStatus to dependencies

  const handleSortCandidates = (key) => {
    const sorted = [...candidates].sort((a, b) => {
      if (typeof a[key] === "string") {
        return a[key].localeCompare(b[key]);
      }
      return a[key] - b[key];
    });
    setCandidates(sorted);
    toast.info(`Candidates sorted by ${key}.`);
  };

  const handleAssignTest = async () => {
    if (!selectedCandidateId || !selectedTestId) {
      toast.warning("Please select both a candidate and a test to assign.");
      return;
    }
    try {
      await api.post("/admin/tests/assign", {
        candidateId: selectedCandidateId,
        testId: selectedTestId,
      });
      toast.success(`Test assigned successfully!`);
      setSelectedCandidateId("");
      setSelectedTestId("");
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to assign test.";
      toast.error(errorMessage);
      console.error("Assign test error:", error);
      if (error.response?.status === 401) checkAuthStatus();
    }
  };

  const handleChangeTestStatus = async (
    candidateId,
    sessionId,
    currentStatus
  ) => {
    const newStatus =
      currentStatus === "Pending Review" ? "Reviewed" : "Pending Review";
    try {
      await api.put(`/admin/test-sessions/${sessionId}/review-status`, {
        reviewStatus: newStatus,
      });
      setCandidates((prev) =>
        prev.map((c) =>
          c.id === candidateId ? { ...c, testStatus: newStatus } : c
        )
      );
      toast.success(
        `Test review status updated to "${newStatus}" for candidate.`
      );
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update test status.";
      toast.error(errorMessage);
      console.error("Update test status error:", error);
      if (error.response?.status === 401) checkAuthStatus();
    }
  };

  const handleTestDetailsChange = (testId, field, value) => {
    setTestDetailsToUpdate((prev) => ({
      ...prev,
      [testId]: {
        ...prev[testId],
        [field]: value,
      },
    }));
  };

  const handleUpdateTestDetails = async (testId) => {
    const details = testDetailsToUpdate[testId];
    if (!details) {
      toast.error("No details available for this test.");
      return;
    }

    const { cutoffMark, scheduledDate, scheduledTime } = details;

    // Basic validation for cutoff
    if (
      cutoffMark === undefined ||
      cutoffMark === "" ||
      isNaN(cutoffMark) ||
      parseFloat(cutoffMark) < 0 ||
      parseFloat(cutoffMark) > 100
    ) {
      toast.error(
        "Please enter a valid number for the cutoff mark between 0 and 100."
      );
      return;
    }

    // Validate scheduledDate and scheduledTime
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please provide both scheduled date and time.");
      return;
    }

    // --- CRITICAL CHANGE HERE ---
    // Convert scheduledDate (Date object from DatePicker) to an ISO string
    // that represents the start of the selected day in UTC.
    let scheduledDateISO = "";
    const selectedDate = scheduledDate; // scheduledDate is already a Date object from DatePicker
    const utcMidnightDate = new Date(
      Date.UTC(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate()
      )
    );
    scheduledDateISO = utcMidnightDate.toISOString();
    // --- END CRITICAL CHANGE ---

    try {
      // Convert Date object to ISO string for backend
      // const scheduledDateISO = scheduledDate.toISOString();

      await api.put(`/admin/tests/${testId}/cutoff`, {
        cutoffMark: parseFloat(cutoffMark),
        scheduledDate: scheduledDateISO, // Send ISO string
        scheduledTime,
      });
      toast.success(
        `Test details for ${
          tests.find((t) => t._id === testId)?.name
        } updated successfully!`
      );
      // Optionally re-fetch tests to ensure UI is fully synced
      const testsRes = await api.get("/tests");
      setTests(testsRes.data);
      const updatedTestDetails = {};
      testsRes.data.forEach((test) => {
        // Parse incoming scheduledDate string back to Date object for state
        const parsedDate = test.scheduledDate
          ? new Date(test.scheduledDate)
          : undefined;
        updatedTestDetails[test._id] = {
          cutoffMark: test.cutoffMark !== undefined ? test.cutoffMark : 50,
          scheduledDate: parsedDate, // Store as Date object
          scheduledTime: test.scheduledTime || "00:00",
        };
      });
      setTestDetailsToUpdate(updatedTestDetails);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Failed to update test details.";
      toast.error(errorMessage);
      console.error("Update test details error:", error);
      if (error.response?.status === 401) checkAuthStatus();
    }
  };


  // const handleSetCutoff = async (testId) => {
  //   const cutoffValue = cutoffMarks[testId];
  //   if (
  //     cutoffValue === undefined ||
  //     cutoffValue === "" ||
  //     isNaN(cutoffValue) ||
  //     parseFloat(cutoffValue) < 0 ||
  //     parseFloat(cutoffValue) > 100
  //   ) {
  //     toast.error("Please enter a valid number for the cutoff mark.");
  //     return;
  //   }
  //   try {
  //     await api.put(`/admin/tests/${testId}/cutoff`, {
  //       cutoffMark: parseFloat(cutoffValue),
  //     });
  //     toast.success(`Cutoff mark set for test.`);
  //     setTests((prevTests) =>
  //       prevTests.map(
  //         (test) =>
  //           test._id === testId
  //             ? { ...test, cutoffMark: parseFloat(cutoffValue) }
  //             : test // Use cutoffMark
  //       )
  //     );
  //   } catch (error) {
  //     const errorMessage =
  //       error.response?.data?.message || "Failed to set cutoff mark.";
  //     toast.error(errorMessage);
  //     console.error("Set cutoff error:", error);
  //     if (error.response?.status === 401) checkAuthStatus();
  //   }
  // };

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
          className="w-16 h-16 border-4 border-zinc-500 border-t-transparent rounded-full"
        ></motion.div>
        <p className="ml-4 text-xl text-zinc-700 dark:text-gray-300">
          Loading authentication...
        </p>
      </div>
    );
  }

  // Redirect if not admin AFTER AuthContext has loaded
  if (!user || user.role !== "admin") {
    // This case should ideally be caught by the useEffect above,
    // but as a fallback for direct URL access or other edge cases.
    return null; // The useEffect will handle the toast and navigate
  }

  greeting = "Welcome Admin" || greeting; // Ensure greeting is always a string

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-8">
      <Navbar />
      <div className="max-w-7xl mx-auto mt-15">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-gray-200 dark:border-gray-700 text-center sm:text-left"
        >
          <div>
            <h1 className="text-4xl font-extrabold text-zinc-700 dark:text-zinc-400">
              {greeting},{" "}
              <span className="text-red-500 hover:text-red-600">
                {user?.name || ""}!
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Manage tests and candidates efficiently.
            </p>
          </div>
        </motion.div>

        {isLoadingData ? (
          <div className="flex items-center justify-center h-96">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-red-500 border-t-transparent rounded-full"
            ></motion.div>
            <p className="ml-4 text-xl text-red-600 dark:text-gray-300">
              Loading admin panel...
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {/* Create Test Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-zinc-700 dark:text-gray-100">
                    Test Management
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Create new tests for candidates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-center justify-center">
                  <Link to="/create-test">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        className="px-8 py-4 text-lg font-bold rounded-lg shadow-md
                                   bg-gradient-to-r from-zinc-500 to-zinc-600 hover:from-zinc-600 hover:to-zinc-700 text-white transition-colors cursor-pointer"
                      >
                        Create New Test
                        <Sparkles />
                      </Button>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>

            {/* Assign Test Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-zinc-700 dark:text-gray-100">
                    Assign Tests
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Assign tests to registered or shortlisted candidates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label
                      htmlFor="select-candidate"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Select Candidate
                    </Label>
                    <Select
                      onValueChange={setSelectedCandidateId}
                      value={selectedCandidateId}
                    >
                      <SelectTrigger id="select-candidate" className="w-full">
                        <SelectValue placeholder="Choose a candidate" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:text-gray-100">
                        {candidates.map((cand) => (
                          <SelectItem key={cand.id} value={cand.id}>
                            {cand.name} ({cand.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label
                      htmlFor="select-test"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                      Select Test
                    </Label>
                    <Select
                      onValueChange={setSelectedTestId}
                      value={selectedTestId}
                    >
                      <SelectTrigger id="select-test" className="w-full">
                        <SelectValue placeholder="Choose a test" />
                      </SelectTrigger>
                      <SelectContent className="dark:bg-gray-700 dark:text-gray-100">
                        {tests.map((test) => (
                          <SelectItem key={test._id} value={test._id}>
                            {test.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleAssignTest}
                      className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white cursor-pointer shadow-xl"
                    >
                      Assign Test
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Set Cut-off Marks Card */}
            {/* <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-zinc-800 shadow-lg border border-zinc-200 dark:border-gray-700 rounded-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-zinc-700 dark:text-gray-100">
                    Set Cut-off Marks
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Define passing scores for exams.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tests.length > 0 ? (
                    tests.map((test) => (
                      <div
                        key={test._id}
                        className="flex flex-col sm:flex-row items-start sm:items-center gap-2"
                      >
                        {" "}
                        {/* Responsive flex */}
            {/* <Label
                          htmlFor={`cutoff-${test._id}`}
                          className="flex-shrink-0 w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          {test.name}:
                        </Label>
                        <Input
                          id={`cutoff-${test._id}`}
                          type="number"
                          placeholder="Cutoff"
                          value={cutoffMarks[test._id] || ""}
                          onChange={(e) =>
                            setCutoffMarks((prev) => ({
                              ...prev,
                              [test._id]: parseInt(e.target.value) || "",
                            }))
                          }
                          className="w-full dark:bg-gray-700 dark:text-gray-200"
                        />
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full sm:w-auto" // Make button full width on small screens
                        >
                          <Button
                            onClick={() => handleSetCutoff(test._id)}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white cursor-pointer shadow-xl"
                          >
                            Set
                          </Button>
                        </motion.div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      No tests available to set cutoffs.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div> */}

            {/* Set Cut-off Marks & Schedule Card */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    Set Cut-off & Schedule
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Define passing scores and set test schedules.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Individual Test Details Section */}
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Set Individual Test Details
                  </h3>
                  {tests.length > 0 ? (
                    tests.map((test) => (
                      <div
                        key={test._id}
                        className="flex flex-col gap-2 p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700"
                      >
                        <p className="font-bold text-gray-900 dark:text-gray-100 mb-2">
                          {test.name}
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Label
                            htmlFor={`cutoff-${test._id}`}
                            className="flex-shrink-0 w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Cutoff (%):
                          </Label>
                          <Input
                            id={`cutoff-${test._id}`}
                            type="number"
                            placeholder="Cutoff"
                            value={
                              testDetailsToUpdate[test._id]?.cutoffMark || ""
                            }
                            onChange={(e) =>
                              handleTestDetailsChange(
                                test._id,
                                "cutoffMark",
                                parseInt(e.target.value) || ""
                              )
                            }
                            className="w-full dark:bg-gray-600 dark:text-gray-200"
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Label
                            htmlFor={`scheduledDate-${test._id}`}
                            className="flex-shrink-0 w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Scheduled Date:
                          </Label>
                          <DatePicker
                            value={testDetailsToUpdate[test._id]?.scheduledDate}
                            onChange={(date) =>
                              handleTestDetailsChange(
                                test._id,
                                "scheduledDate",
                                date
                              )
                            }
                            placeholder="Select date"
                            className="mt-1 w-1/2 dark:bg-zinc-600 dark:text-zinc-200 cursor-pointer"
                            fromDate={new Date()} // Prevent selecting past dates
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                          <Label
                            htmlFor={`scheduledTime-${test._id}`}
                            className="flex-shrink-0 w-full sm:w-1/2 text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Scheduled Time:
                          </Label>
                          <Input
                            id={`scheduledTime-${test._id}`}
                            type="time"
                            value={
                              testDetailsToUpdate[test._id]?.scheduledTime ||
                              "00:00"
                            }
                            onChange={(e) =>
                              handleTestDetailsChange(
                                test._id,
                                "scheduledTime",
                                e.target.value
                              )
                            }
                            className="w-full hover:bg-zinc-100 dark:bg-zinc-600 dark:text-zinc-200 cursor-pointer"
                          />
                        </div>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="w-full sm:w-auto mt-2"
                        >
                          <Button
                            onClick={() => handleUpdateTestDetails(test._id)}
                            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white cursor-pointer shadow-xl"
                          >
                            Update
                          </Button>
                        </motion.div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      No tests available to set individual details.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Candidate Analysis & Status Card (Spans 2 columns on larger screens) */}
            <motion.div
              variants={itemVariants}
              className="lg:col-span-2 xl:col-span-3"
            >
              <Card className="bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 rounded-lg">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold text-zinc-700 dark:text-gray-100">
                    Candidate Analysis & Status
                  </CardTitle>
                  <CardDescription className="text-zinc-600 dark:text-gray-400">
                    Review candidate performance and manage test result status.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="mb-4 flex flex-col sm:flex-row gap-2">
                    {" "}
                    {/* Responsive sort buttons */}
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        onClick={() => handleSortCandidates("name")}
                        variant="outline"
                        className="w-full dark:text-gray-200 dark:border-gray-600 cursor-pointer"
                      >
                        Sort by Name
                      </Button>
                    </motion.div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full sm:w-auto"
                    >
                      <Button
                        onClick={() => handleSortCandidates("totalScore")}
                        variant="outline"
                        className="w-full dark:text-gray-200 dark:border-gray-600 cursor-pointer"
                      >
                        Sort by Score
                      </Button>
                    </motion.div>
                    {/* Add more sort options as needed */}
                  </div>
                  {candidates.length > 0 ? (
                    <div className="overflow-x-auto">
                      {" "}
                      {/* Ensures table scrolls horizontally if content overflows */}
                      <Table>
                        <TableCaption>
                          A list of registered candidates and their test
                          overview.
                        </TableCaption>
                        <TableHeader>
                          <TableRow className="dark:bg-gray-700">
                            <TableHead className="w-[150px] text-gray-700 dark:text-gray-300">
                              Name
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">
                              Email
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300 hidden md:table-cell">
                              {" "}
                              {/* Hide on small screens */}
                              Total Score
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300 hidden md:table-cell">
                              {" "}
                              {/* Hide on small screens */}
                              Tests Completed
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-300">
                              Status
                            </TableHead>
                            <TableHead className="text-right text-gray-700 dark:text-gray-300">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {candidates.map((candidate) => (
                            // console.log("Candidate:------------------->",candidate),
                            <TableRow
                              key={candidate.id}
                              className="dark:hover:bg-gray-700"
                            >
                              <TableCell className="font-medium text-gray-800 dark:text-gray-200">
                                {candidate.name}
                              </TableCell>
                              <TableCell className="text-gray-700 dark:text-gray-300">
                                {candidate.email}
                              </TableCell>
                              <TableCell className="text-gray-700 dark:text-gray-300 hidden md:table-cell">
                                {" "}
                                {/* Hide on small screens */}
                                {candidate.totalScore}
                              </TableCell>
                              <TableCell className="text-gray-700 dark:text-gray-300 hidden md:table-cell">
                                {" "}
                                {/* Hide on small screens */}
                                {candidate.testsCompleted}
                              </TableCell>
                              <TableCell>
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                                    // Added whitespace-nowrap
                                    candidate.testStatus === "Reviewed"
                                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                  }`}
                                >
                                  {candidate.testStatus}
                                </span>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2">
                                  {" "}
                                  {/* Responsive flex for buttons */}
                                  {candidate.lastTestResultId && (
                                    <motion.div
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className="w-full sm:w-auto"
                                    >
                                      <Link
                                        to={`/result/${candidate.lastTestResultId}`}
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="w-full bg-zinc-100 text-zinc-700 hover:bg-zinc-200 hover:text-zinc-800 dark:text-blue-400 dark:border-blue-400 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                          View Result
                                        </Button>
                                      </Link>
                                    </motion.div>
                                  )}
                                  <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-full sm:w-auto"
                                  >
                                    <Button
                                      onClick={() =>
                                        handleChangeTestStatus(
                                          candidate.id,
                                          candidate.lastTestResultId,
                                          candidate.testStatus
                                        )
                                      }
                                      variant="secondary"
                                      size="sm"
                                      disabled={!candidate.lastTestResultId}
                                      className="w-full bg-gradient-to-r from-zinc-500 to-zinc-600 hover:from-zinc-600 hover:to-zinc-700 text-white dark:bg-zinc-700 dark:hover:bg-blue-600 cursor-pointer"
                                    >
                                      {candidate.testStatus === "Pending Review"
                                        ? "Mark as Reviewed"
                                        : "Mark as Pending"}
                                    </Button>
                                  </motion.div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p className="text-center text-gray-600 dark:text-gray-400">
                      No candidates found.
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
