// src/pages/CreateTestPage.jsx
import { motion } from "framer-motion";
import CreateTestForm from "@components/test/CreateTestForm"; // Import the form component
import Navbar from "@components/common/Navbar";

/**
 * CreateTestPage Component
 *
 * This component serves as the page wrapper for the CreateTestForm.
 * It provides a consistent layout and applies page-level animations using Framer Motion.
 *
 * Features:
 * - Displays a title for the page.
 * - Renders the CreateTestForm component where users can input test details and upload notes.
 * - Uses Framer Motion for smooth entry animations for the page content.
 */
const CreateTestPage = () => {
  return (
    <>
    <Navbar /> {/* Include the Navbar component for navigation */}
    
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 mt-18">
      {/* Page Title with Animation */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-extrabold text-center text-zinc-600 dark:text-zinc-400 mb-8 drop-shadow-lg"
      >
        Design Your New Test
      </motion.h1>

      {/* Container for the CreateTestForm with Animation */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
        className="w-full max-w-3xl" /* Max width to keep the form centered and readable */
      >
        <CreateTestForm />
      </motion.div>
    </div>
    
    </>
    
  );
};

export default CreateTestPage;
