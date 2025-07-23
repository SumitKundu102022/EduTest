// src/components/ui/radio-group.jsx
import * as React from "react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react"; // Assuming lucide-react is installed for icons

import { cn } from "../../lib/utils"; // Assuming you have a utils.js for cn helper

/**
 * RadioGroup Component
 *
 * This component provides a group container for radio buttons,
 * ensuring accessibility and proper group behavior (only one item can be selected).
 * It's built on top of Radix UI's RadioGroup.Root.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the radio group container.
 * @param {React.Ref} ref - A ref to the underlying Radix RadioGroup.Root element.
 */
const RadioGroup = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Root
      className={cn("grid gap-2", className)}
      {...props}
      ref={ref}
    />
  );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

/**
 * RadioGroupItem Component
 *
 * This component represents an individual radio button within a RadioGroup.
 * It displays a circle icon inside when selected.
 * It's built on top of Radix UI's RadioGroup.Item.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply to the radio item.
 * @param {React.Ref} ref - A ref to the underlying Radix RadioGroup.Item element.
 */
const RadioGroupItem = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <RadioGroupPrimitive.Item
      ref={ref}
      className={cn(
        "aspect-square h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
        <Circle className="h-2.5 w-2.5 fill-current text-current" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
