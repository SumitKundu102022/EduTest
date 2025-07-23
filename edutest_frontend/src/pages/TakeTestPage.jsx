// src/pages/TakeTestPage.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@components/ui/button';
import QuestionDisplay from '@components/test/QuestionDisplay';
import TimerDisplay from '@components/test/TimerDisplay';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@components/ui/dialog';
import api from '@lib/api'; // Import the centralized API client

const TakeTestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: chosenOptionIndex }
  const [remarks, setRemarks] = useState({}); // { questionId: "user remark" }
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [testStarted, setTestStarted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const startTimeRef = useRef(null); // To store when the test officially started

  const timerRef = useRef(null);

  useEffect(() => {
    const loadTest = async () => {
      try {
        const response = await api.get(`/tests/${testId}`);
        const testData = response.data;
        setTest(testData);
        setTimeLeft(testData.timeLimit * 60); // Convert minutes to seconds
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Failed to load test.';
        toast.error(errorMessage);
        console.error('Test load error:', error);
        navigate('/candidate/dashboard'); // Redirect if test fails to load
      }
    };
    loadTest();
  }, [testId, navigate]);

  useEffect(() => {
    if (testStarted && timeLeft > 0 && !isSubmitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && testStarted) {
      clearInterval(timerRef.current);
      if (!isSubmitting) {
        handleSubmitTest(true); // Auto-submit
        toast.info('Time is up! Your test has been automatically submitted.');
      }
    }
    return () => clearInterval(timerRef.current);
  }, [testStarted, timeLeft, isSubmitting]);

  const handleStartTest = () => {
    setTestStarted(true);
    startTimeRef.current = new Date(); // Record start time
    toast.success('Test started! Good luck!');
  };

  const handleAnswerChange = useCallback((questionId, chosenOptionIndex) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: chosenOptionIndex,
    }));
  }, []);

  const handleRemarkChange = useCallback((questionId, remark) => {
    setRemarks((prevRemarks) => ({
      ...prevRemarks,
      [questionId]: remark,
    }));
  }, []);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < test.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      toast.info('You are at the last question.');
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    } else {
      toast.info('You are at the first question.');
    }
  };

  const handleSubmitTest = async (autoSubmitted = false) => {
    setShowConfirmSubmit(false); // Close dialog
    if (isSubmitting) return;

    setIsSubmitting(true);
    clearInterval(timerRef.current); // Stop timer

    try {
      const endTime = new Date();
      const payloadAnswers = test.questions.map(q => ({
        questionId: q.id,
        chosenAnswerIndex: answers[q.id] !== undefined ? answers[q.id] : -1, // -1 for unattempted
        remark: remarks[q.id] || '',
      }));

      const response = await api.post(`/tests/${testId}/submit`, {
        userAnswers: payloadAnswers,
        startTime: startTimeRef.current,
        endTime: endTime,
      });

      toast.success(autoSubmitted ? 'Test auto-submitted!' : 'Test submitted successfully!');
      // navigate(`/result/${response.data.sessionId}`); // Navigate to result page with session ID
      navigate(`/test-completed`);
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to submit test. Please try again.';
      toast.error(errorMessage);
      console.error('Test submission error:', error);
      setIsSubmitting(false); // Allow re-submission if failed
    }
  };

  if (!test) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-xl text-gray-700 dark:text-gray-300"
        >
          Loading test...
        </motion.div>
      </div>
    );
  }

  const currentQuestion = test.questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-zinc-300 dark:bg-orange-900 text-zinc-900 dark:text-gray-100 p-4 md:p-8 flex flex-col items-center">
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-4xl font-extrabold mb-8 text-zinc-700 dark:text-orange-400 drop-shadow-md"
      >
        {test.name}
      </motion.h1>

      {!testStarted ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-zinc-50 dark:bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-lg w-full border border-gray-200 dark:border-gray-700 mt-18"
        >
          <h2 className="text-2xl font-semibold mb-4 text-zinc-700 dark:text-zinc-200">
            Ready to Start?
          </h2>
          <p className="text-zinc-700 dark:text-zinc-400 mb-6 font-stretch-100%">
            This test has {test.numQuestions} questions and a time limit of{" "}
            {test.timeLimit} minutes.
          </p>
          <p className="text-red-600 dark:text-red-400 font-medium mb-6">
            ⚠️ Disclaimer: If you refresh the page or navigate away, your test
            will be automatically submitted.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleStartTest}
              className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white text-xl rounded-lg shadow-lg transition-all duration-300 cursor-pointer"
            >
              Start Test
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-4xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-10 border border-gray-200 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-6 border-b pb-4 border-zinc-200 dark:border-zinc-700">
            <h3 className="text-xl font-semibold text-zinc-900 dark:text-gray-300">
              Question {currentQuestionIndex + 1} of {test.questions.length}
            </h3>
            <TimerDisplay timeLeft={timeLeft} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.3 }}
            >
              <QuestionDisplay
                question={currentQuestion}
                selectedOption={answers[currentQuestion.id]}
                onOptionSelect={(optionIndex) =>
                  handleAnswerChange(currentQuestion.id, optionIndex)
                }
                remark={remarks[currentQuestion.id] || ""}
                onRemarkChange={(remark) =>
                  handleRemarkChange(currentQuestion.id, remark)
                }
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-4 border-t border-gray-200 dark:border-gray-700">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200 px-6 py-3 rounded-md transition-colors cursor-pointer"
              >
                Previous
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleNextQuestion}
                disabled={
                  currentQuestionIndex === test.questions.length - 1 ||
                  isSubmitting
                }
                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-md transition-colors cursor-pointer"
              >
                Save & Next
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowConfirmSubmit(true)}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-md transition-colors cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit Test"}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Confirmation Dialog for Submit */}
      <Dialog open={showConfirmSubmit} onOpenChange={setShowConfirmSubmit}>
        <DialogContent className="sm:max-w-[425px] dark:bg-gray-800 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Confirm Submission
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Are you sure you want to submit the test? You won't be able to
              change your answers after submission.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button
                type="button"
                variant="secondary"
                className="bg-zinc-200 hover:bg-zinc-300 hover:text-zinc-900 px-5 py-2 cursor-pointer"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              onClick={() => handleSubmitTest()}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 cursor-pointer"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Confirm Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TakeTestPage;

