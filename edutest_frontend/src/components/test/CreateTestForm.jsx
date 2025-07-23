// src/components/test/CreateTestForm.jsx
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import api from '../../lib/api'; // Import the centralized API client
import { useNavigate } from 'react-router-dom';

const CreateTestForm = () => {
  const [testName, setTestName] = useState('');
  const [notesFile, setNotesFile] = useState(null); // For PDF/text file upload
  const [notesText, setNotesText] = useState('');   // For direct text input
  const [numQuestions, setNumQuestions] = useState(10);
  const [timeLimit, setTimeLimit] = useState(10); // in minutes
  const [negativeMarkingRatio, setNegativeMarkingRatio] = useState(0.25); // e.g., 0.25 for -1/4
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setNotesFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!notesFile && !notesText) {
      toast.error("Please upload notes or enter text to create a test.");
      setIsLoading(false);
      return;
    }

    // In a real app, if notesFile is present, you'd upload it first
    // and get a URL, then send that URL in the main payload.
    // For now, we'll prioritize notesText or simulate file content.
    let contentToSend = notesText;
    if (notesFile) {
        // For actual file content, you'd read it here (e.g., using FileReader)
        // or send the file via FormData to a separate upload endpoint.
        // For simplicity, we'll just use a placeholder for file content if text is empty.
        if (!notesText) {
            toast.info("Using file name as notes content for simulation. In real app, file content would be parsed.");
            contentToSend = `Content from file: ${notesFile.name}`;
        }
    }


    try {
      const payload = {
        name: testName,
        notesContent: contentToSend, // Send text content or simulated file content
        numQuestions: parseInt(numQuestions),
        timeLimit: parseInt(timeLimit),
        negativeMarkingRatio: parseFloat(negativeMarkingRatio),
      };

      const response = await api.post('/tests', payload); // API call to create test

      toast.success(response.data.message);
      // Optionally redirect to the newly created test or admin dashboard
      navigate('/admin/dashboard'); // Assuming only admins create tests
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create test. Please try again.';
      toast.error(errorMessage);
      console.error('Test creation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      onSubmit={handleSubmit}
      className="space-y-6 p-8 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto my-8"
    >
      <h2 className="text-3xl font-bold text-center text-red-600 dark:text-gray-100 mb-6">
        Create New Test
      </h2>

      <div>
        <Label
          htmlFor="testName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Test Name
        </Label>
        <Input
          id="testName"
          type="text"
          placeholder="Your Test Name"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          required
          className="w-full p-3 rounded-md dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      <div>
        <Label
          htmlFor="notesUpload"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Upload Notes (PDF/Text)
        </Label>
        <Input
          id="notesUpload"
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleFileChange}
          className="py-0.5 w-full rounded-md dark:bg-zinc-700 dark:text-zinc-200 file:mr-5 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 file:cursor-pointer"
        />
        {/* <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Or, paste your notes directly below.
        </p> */}
      </div>

      <div>
        <Label
          htmlFor="notesText"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Enter Notes Text
        </Label>
        <Textarea
          id="notesText"
          placeholder="Paste your notes here. AI will use this to generate questions."
          value={notesText}
          onChange={(e) => setNotesText(e.target.value)}
          rows={6}
          className="w-full p-3 rounded-md dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <Label
            htmlFor="numQuestions"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Number of Questions
          </Label>
          <Input
            id="numQuestions"
            type="number"
            value={numQuestions}
            onChange={(e) =>
              setNumQuestions(Math.max(1, parseInt(e.target.value) || 0))
            }
            min="1"
            className="w-full p-3 rounded-md dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <Label
            htmlFor="timeLimit"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Time Limit (minutes)
          </Label>
          <Input
            id="timeLimit"
            type="number"
            value={timeLimit}
            onChange={(e) =>
              setTimeLimit(Math.max(1, parseInt(e.target.value) || 0))
            }
            min="1"
            className="w-full p-3 rounded-md dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <Label
            htmlFor="negativeMarking"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Negative Marking Ratio
          </Label>
          <Input
            id="negativeMarking"
            type="number"
            step="0.05"
            value={negativeMarkingRatio}
            onChange={(e) =>
              setNegativeMarkingRatio(parseFloat(e.target.value) || 0)
            }
            min="0"
            max="1"
            className="w-full p-3 rounded-md dark:bg-gray-700 dark:text-gray-200"
          />
          {/* <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">e.g., 0.25 means -1/4 mark for wrong answer</p> */}
        </div>
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-md transition-colors duration-300 text-lg cursor-pointer"
          disabled={isLoading}
        >
          {isLoading
            ? "Creating Test & Generating Questions..."
            : "Create Test"}
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default CreateTestForm;

