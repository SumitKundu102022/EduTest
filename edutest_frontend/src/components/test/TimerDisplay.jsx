// src/components/test/TimerDisplay.jsx
import React from "react";
import { motion } from "framer-motion";

const TimerDisplay = ({ timeLeft }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const timerColor =
    timeLeft <= 300 ? "text-red-500" : "text-zinc-700 dark:text-blue-400";

  return (
    <motion.div
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      className={`text-2xl font-bold ${timerColor} p-2 rounded-md bg-white dark:bg-gray-700 shadow-md`}
    >
      Time Left: {minutes.toString().padStart(2, "0")}:
      {seconds.toString().padStart(2, "0")}
    </motion.div>
  );
};

export default TimerDisplay;
