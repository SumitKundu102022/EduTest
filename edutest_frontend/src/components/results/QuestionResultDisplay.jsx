import { motion } from "framer-motion";
import { Badge } from "../ui/badge";

const QuestionResultDisplay = ({ question }) => {
  const isCorrect = question.isCorrect;
  const userAnswer = question.userAnswer;
  const correctAnswer = question.correctAnswer;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`mb-6 p-4 sm:p-6 rounded-lg shadow-sm overflow-auto break-words ${
        isCorrect
          ? "border border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950"
          : "border border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950"
      }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-2 sm:gap-4 mb-4">
        <p className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 whitespace-normal break-words">
          {question.questionText}
        </p>
        <Badge
          className={`text-white px-3 py-1 rounded-full text-sm font-semibold ${
            isCorrect
              ? "bg-green-500 hover:bg-green-600"
              : "bg-red-500 hover:bg-red-600"
          }`}
        >
          {isCorrect ? "Correct" : "Incorrect"}
        </Badge>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelectedWrong = index === userAnswer && !isCorrect;
          const isCorrectOption = index === correctAnswer;

          return (
            <motion.div
              key={index}
              className={`p-3 rounded-md border text-sm sm:text-base whitespace-normal break-words transition-all ${
                isCorrectOption
                  ? "bg-green-200 dark:bg-green-700 border-green-400 font-bold ring-2 ring-offset-2 ring-green-500 dark:ring-green-400"
                  : isSelectedWrong
                  ? "bg-red-200 dark:bg-red-700 border-red-400 font-bold ring-2 ring-offset-2 ring-red-500 dark:ring-red-400"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600"
              }`}
            >
              {`${String.fromCharCode(65 + index)}. ${option}`}
              {index === userAnswer && (
                <span className="ml-2 text-sm font-medium"> (Your choice)</span>
              )}
              {index === correctAnswer && (
                <span className="ml-2 text-sm font-medium"> (Correct)</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {question.remark && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-md border border-gray-200 dark:border-gray-600">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Your Remark:
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-sm italic break-words whitespace-normal">
            {question.remark}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default QuestionResultDisplay;
