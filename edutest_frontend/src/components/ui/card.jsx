// src/components/ui/card.jsx
import * as React from "react";

import { cn } from "../../lib/utils"; // Assuming you have a utils.js for cn helper

/**
 * Card Component (Root)
 *
 * This is the main container for a card. It provides a basic styled box
 * with rounded corners and a shadow, commonly used to group related content.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the card.
 * @param {React.Ref} ref - A ref to the underlying HTML div element.
 */
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/**
 * CardHeader Component
 *
 * This component is used for the header section of a card, typically containing
 * the CardTitle and CardDescription.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the card header.
 * @param {React.Ref} ref - A ref to the underlying HTML div element.
 */
const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

/**
 * CardTitle Component
 *
 * This component renders the main title within a CardHeader.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the card title.
 * @param {React.Ref} ref - A ref to the underlying HTML h3 element.
 */
const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

/**
 * CardDescription Component
 *
 * This component renders a descriptive or explanatory text within a CardHeader.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the card description.
 * @param {React.Ref} ref - A ref to the underlying HTML p element.
 */
const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

/**
 * CardContent Component
 *
 * This component is used for the main content area of a card.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the card content.
 * @param {React.Ref} ref - A ref to the underlying HTML div element.
 */
const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

/**
 * CardFooter Component
 *
 * This component is used for the footer section of a card, typically containing action buttons.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the card footer.
 * @param {React.Ref} ref - A ref to the underlying HTML div element.
 */
const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
