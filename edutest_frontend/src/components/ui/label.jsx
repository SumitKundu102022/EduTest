// src/components/ui/label.jsx
import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils"; // Assuming you have a utils.js for cn helper

/**
 * Defines the base styles for the Label component using class-variance-authority (cva).
 * This ensures consistent styling for labels across the application.
 */
const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

/**
 * Label Component
 *
 * This component renders a styled label, typically associated with form elements.
 * It uses `@radix-ui/react-label` for accessibility and functionality,
 * and `class-variance-authority` and `cn` for styling.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the label.
 * @param {React.Ref} ref - A ref to the underlying Radix Label element.
 */
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
