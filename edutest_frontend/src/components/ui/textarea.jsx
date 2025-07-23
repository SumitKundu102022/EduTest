// src/components/ui/textarea.jsx
import * as React from "react";

import { cn } from "../../lib/utils"; // Assuming you have a utils.js for cn helper

/**
 * Textarea Component
 *
 * This component renders a styled HTML textarea element.
 * It uses `React.forwardRef` to allow parent components to get a ref to the underlying DOM element.
 * It integrates with Tailwind CSS for styling and `cn` utility for conditional class merging.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the textarea.
 * @param {React.Ref} ref - A ref to the underlying HTML textarea element.
 */
const Textarea = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
