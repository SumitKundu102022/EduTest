// src/components/ui/badge.jsx
import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils"; // Assuming you have a utils.js for cn helper

/**
 * Defines the different visual variants of the Badge component using class-variance-authority (cva).
 * This allows for easy styling of different badge types (default, secondary, destructive, outline).
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/**
 * Badge Component
 *
 * This component renders a small, informative badge.
 * It uses `class-variance-authority` for flexible styling variants
 * and `cn` utility for conditional class merging.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.variant="default"] - The visual variant of the badge (e.g., "default", "secondary", "destructive", "outline").
 * @param {string} [props.className] - Additional CSS classes to apply to the badge.
 * @param {React.ReactNode} props.children - The content to be displayed inside the badge.
 */
function Badge({ className, variant, ...props }) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
