// src/components/test/QuestionDisplay.jsx
import React from "react";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"; // Shadcn/ui radio group
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { motion } from "framer-motion";

const QuestionDisplay = ({
  question,
  selectedOption,
  onOptionSelect,
  remark,
  onRemarkChange,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700"
    >
      <p className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        {question.questionText}
      </p>

      <RadioGroup
        value={selectedOption !== undefined ? String(selectedOption) : ""}
        onValueChange={(value) => onOptionSelect(parseInt(value))}
      >
        {question.options.map((option, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.02 }}
            className={`flex items-center space-x-2 p-3 my-2 rounded-md cursor-pointer transition-colors duration-200
              ${
                selectedOption === index
                  ? "bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-700 border"
                  : "bg-white hover:bg-zinc-100 dark:hover:bg-gray-700 border border-zinc-200 dark:border-zinc-600"
              }
            `}
          >
            <RadioGroupItem
              value={String(index)}
              id={`option-${question.id}-${index}`}
              className={`cursor-pointer  ${
                selectedOption === index
                  ? "border-blue-400 text-blue-700"
                  : "border-gray-300"
              }`}
            />
            <Label
              htmlFor={`option-${question.id}-${index}`}
              className="text-gray-800 dark:text-gray-200 cursor-pointer flex-grow"
            >
              {option}
            </Label>
          </motion.div>
        ))}
      </RadioGroup>

      <div className="mt-6">
        <Label
          htmlFor={`remark-${question.id}`}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Remarks (Optional)
        </Label>
        <Textarea
          id={`remark-${question.id}`}
          placeholder="Add any remarks or notes for this question..."
          value={remark}
          onChange={(e) => onRemarkChange(e.target.value)}
          rows={3}
          className="w-full p-3 rounded-md border dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500"
        />
      </div>
    </motion.div>
  );
};

export default QuestionDisplay;
