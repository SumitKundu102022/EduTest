// src/pages/ResultPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/ui/button';
import QuestionResultDisplay from '@components/results/QuestionResultDisplay';
import api from '@lib/api'; // Import the centralized API client
import { useAuth } from '@contexts/AuthContext';
import Navbar from '@components/common/Navbar';

const ResultPage = () => {
  const { testSessionId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadResult = async () => {
      try {
        const response = await api.get(`/candidate/results/${testSessionId}`);
        const resultData = response.data;
        setResult(resultData);
        // Log the received cutoffMark to confirm it's coming from backend
        //console.log("ResultPage received cutoffMark:####################################################################", resultData.cutoffMark); // Use cutoffMark
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to load test results.';
        toast.error(errorMessage);
        console.error('Result load error:', error);
        navigate('/candidate/dashboard'); // Redirect if results fail to load
      }
    };
    loadResult();
  }, [testSessionId, navigate]);

  const handleNextQuestion = () => {
    if (result && currentQuestionIndex < result.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleDownloadResult = () => {
    toast.info('Downloading result (PDF/CSV generation on backend required).');
    // Implement PDF/CSV generation logic, likely involving a backend endpoint
    // Example: window.open(`${api.defaults.baseURL}/results/${testSessionId}/download`, '_blank');
  };

  const handleShareResult = () => {
    toast.info('Sharing result (Social media/email integration).');
    // Implement sharing logic
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl text-gray-700 dark:text-gray-300"
        >
          Loading results...
        </motion.div>
      </div>
    );
  }

  const currentQuestion = result.questions[currentQuestionIndex];
  const percentage = result.percentage; // Use the percentage directly from backend
 // console.log("ResultPage percentage:----------------------------->", percentage);
  // Use the cutoffMark from the fetched result data
  const passThreshold = result.cutoffMark; // Dynamic pass mark from backend

  // Determine test status based on percentage
  const passThresholdPercentage = ((passThreshold / result.maxScore) * 100).toFixed(2);
  //console.log("ResultPage passThresholdPercentage:----------------------------->", passThresholdPercentage);
  const requiredToQualify = passThresholdPercentage - percentage;
  const testStatus =
    percentage >= passThresholdPercentage
      ? "Qualified"
      : "Not Qualified";
  const testStatusColorClass =
    percentage >= passThresholdPercentage
      ? "text-green-600 dark:text-green-400"
      : "text-red-600 dark:text-red-400";

  // console.log("ResultPage currentUser:---------------------------->", user);
  // console.log("ResultPage result:----------------------------->", result);
  // console.log("ResultPage cutoffMark:----------------------------->", result.cutoffMark);
  // console.log("ResultPage requiredToQualify:----------------------------->", requiredToQualify);

  return (
    <>
      <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 p-4 md:p-8 flex flex-col items-center mt-16">
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="text-center mb-10"
      >
        {user.role === "admin" ? (
          <>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-green-700 dark:text-green-400 mb-8 drop-shadow-lg break-words text-center">
              {/* Thank You for Completing the Test! */}
              Candidate Result
            </h1>
            <div className="w-full max-w-5xl mx-auto mb-6 grid gap-4 sm:gap-6 mt-8">
              {/* Candidate Name */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 gap-2 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 dark:text-blue-400">
                  Candidate Name:
                </h2>
                <span className="text-base sm:text-lg font-medium text-zinc-700 dark:text-gray-200">
                  {result.candidateName}
                </span>
              </div>

              {/* Candidate Email */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 gap-2 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 dark:text-blue-400">
                  Candidate Email:
                </h2>
                <span className="text-base sm:text-lg font-medium text-zinc-700 dark:text-gray-200 break-words">
                  {result.candidateEmail}
                </span>
              </div>

              {/* Test Name */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 gap-2 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 dark:text-blue-400">
                  Test Name:
                </h2>
                <span className="text-base sm:text-lg font-medium text-zinc-700 dark:text-gray-200">
                  {result.testName}
                </span>
              </div>
            </div>

            <p
              className={`text-lg sm:text-2xl font-semibold break-words text-center mt-2 ${testStatusColorClass}`}
            >
              {/* Your result for "{result.testName}" is here. */}
              Test status: {testStatus} {/* Display the calculated status */}
            </p>
            {/* Display cutoff mark for candidate's reference */}
            {/* {percentage < passThresholdPercentage && (
              <p className="text-md sm:text-lg text-zinc-600 dark:text-gray-400 mt-2">
                (Required to qualify: {passThresholdPercentage}%)
              </p>
            )} */}
          </>
        ) : (
          <>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-green-700 dark:text-green-400 mb-8 drop-shadow-lg break-words text-center">
              {/* Thank You for Completing the Test! */}
              Your Test Result
            </h1>

            <div className="w-full max-w-5xl mx-auto mb-6 grid gap-4 sm:gap-6 mt-8">
              {/* Candidate Name */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 gap-2 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 dark:text-blue-400">
                  Your Name:
                </h2>
                <span className="text-base sm:text-lg font-medium text-zinc-700 dark:text-gray-200">
                  {result.candidateName}
                </span>
              </div>

              {/* Candidate Email */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 gap-2 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 dark:text-blue-400">
                  Your Email:
                </h2>
                <span className="text-base sm:text-lg font-medium text-zinc-700 dark:text-gray-200 break-words">
                  {result.candidateEmail}
                </span>
              </div>

              {/* Test Name */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-4 gap-2 text-center sm:text-left">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-purple-600 dark:text-blue-400">
                  Test Name:
                </h2>
                <span className="text-base sm:text-lg font-medium text-zinc-700 dark:text-gray-200">
                  {result.testName}
                </span>
              </div>
            </div>
              {/* {testStatus=="Qualified" && ( */}
                <p
                  className={`text-lg sm:text-2xl font-semibold break-words text-center mt-2 ${testStatusColorClass}`}
                >
                  {/* Your result for "{result.testName}" is here. */}
                  Test status: {testStatus} {/* Display the calculated status */}
                </p>
              {/* )} */}
            {/* Display cutoff mark for candidate's reference */}
            {percentage < passThresholdPercentage && (
              <p className="text-md sm:text-lg text-zinc-600 dark:text-gray-400 mt-2">
                (Required to qualify: {passThresholdPercentage}%)
              </p>
            )}
          </>
        )}
      </motion.div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3, ease: "backOut" }}
        className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-2 md:p-12 border border-gray-200 dark:border-gray-700 mb-8 overflow-auto"
      >
        <h2 className="text-3xl font-bold text-center text-zinc-700 dark:text-zinc-400 mb-12">
          Test Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-md mb-6 text-center break-words">
          <p className="font-medium whitespace-normal break-words">
            Total Questions:{" "}
            <span className="font-semibold">{result.totalQuestions}</span>
          </p>
          <p className="font-medium whitespace-normal break-words">
            Correct Answers:{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {result.correctAnswers}
            </span>
          </p>
          <p className="font-medium whitespace-normal break-words">
            Wrong Answers:{" "}
            <span className="font-semibold text-red-600 dark:text-red-400">
              {result.wrongAnswers}
            </span>
          </p>
          <p className="font-medium whitespace-normal break-words">
            Unattempted:{" "}
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              {result.unattempted}
            </span>
          </p>
          <p className="font-medium whitespace-normal break-words">
            Your Score:{" "}
            <span className="font-semibold text-green-600 dark:text-green-400">
              {result.score} / {result.maxScore}
            </span>
          </p>
          <p className="font-medium whitespace-normal break-words">
            Percentage:{" "}
            <span
              className={`font-semibold ${
                percentage >= passThreshold
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {percentage}%
            </span>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-center text-zinc-700 dark:text-gray-200 mb-0 mt-3">
            Question Review :
          </h3>
          <div className="flex justify-between gap-1 sm:gap-1 items-center mb-6">
            <h4 className="text-xl font-medium text-gray-700 dark:text-gray-300 sm:text-left text-center">
              Question {currentQuestionIndex + 1} of {result.questions.length}
            </h4>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-6 mt-12">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Previous Button here */}
                <Button
                  onClick={handlePreviousQuestion}
                  className={`bg-zinc-200 hover:bg-zinc-300 text-zinc-800 dark:bg-zinc-700 dark:hover:bg-zinc-600 dark:text-zinc-200 px-5 py-2 rounded-md cursor-pointer ${
                    currentQuestionIndex === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  } 
                    ${
                      currentQuestionIndex === result.questions.length - 1
                        ? "bg-zinc-600 hover:bg-zinc-700 text-white"
                        : ""
                    }
                    `}
                  // disabled={currentQuestionIndex === 0}
                >
                  Previous
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {/* Next Button here */}
                <Button
                  onClick={handleNextQuestion}
                  // disabled={
                  //   currentQuestionIndex === result.questions.length - 1
                  // }
                  className={`bg-zinc-600 hover:bg-zinc-700 text-white px-9 py-2 rounded-md cursor-pointer ${
                    currentQuestionIndex === result.questions.length - 1
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Next
                </Button>
              </motion.div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
              className="overflow-x-auto break-words"
            >
              <QuestionResultDisplay question={currentQuestion} />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => (
                handleDownloadResult,
                alert("Download functionality is not implemented yet.")
              )}
              className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-md transition cursor-pointer"
            >
              Download Result
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => (
                handleShareResult,
                alert("Share functionality is not implemented yet.")
              )}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-md transition cursor-pointer"
            >
              Share Result
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
        className="mt-8"
      >
        <p className="text-center text-lg text-gray-600 dark:text-gray-400">
          Go Back to your{" "}
          <Link
            to="/candidate/dashboard"
            className="text-blue-600 hover:underline dark:text-blue-400"
          >
            Dashboard
          </Link>
        </p>
      </motion.div> */}
    </div>
    </>
    
  );
};

export default ResultPage;

