// src/components/ui/input.jsx
import * as React from "react";

import { cn } from "../../lib/utils"; // Assuming you have a utils.js for cn helper

/**
 * Input Component
 *
 * This component renders a styled HTML input element.
 * It uses `React.forwardRef` to allow parent components to get a ref to the underlying DOM element.
 * It integrates with Tailwind CSS for styling and `cn` utility for conditional class merging.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.type="text"] - The type of the input (e.g., "text", "email", "password", "number", "file").
 * @param {string} [props.className] - Additional CSS classes to apply to the input.
 * @param {React.Ref} ref - A ref to the underlying HTML input element.
 */
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
