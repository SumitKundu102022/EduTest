// src/components/ui/date-picker.jsx
import React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react"; // Assuming lucide-react for icons

import { cn } from "../../lib/utils"; // Your utility for combining class names
import { Button } from "./button"; // Shadcn Button
import { Calendar } from "./calendar"; // Shadcn Calendar
import { Popover, PopoverContent, PopoverTrigger } from "./popover"; // Shadcn Popover

/**
 * A reusable DatePicker component using react-day-picker and Shadcn UI.
 *
 * @param {Object} props - Component props.
 * @param {Date | undefined} props.value - The selected date (Date object or undefined).
 * @param {(date: Date | undefined) => void} props.onChange - Callback function when date changes.
 * @param {string} [props.placeholder="Pick a date"] - Placeholder text for the button.
 * @param {string} [props.className] - Additional class names for the trigger button.
 * @param {Date} [props.fromDate] - Minimum selectable date.
 * @param {Date} [props.toDate] - Maximum selectable date.
 * @param {boolean} [props.disabled] - Whether the date picker is disabled.
 */
export function DatePicker({
  value,
  onChange,
  placeholder = "Pick a date",
  className,
  fromDate,
  toDate,
  disabled,
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          initialFocus
          fromDate={fromDate}
          toDate={toDate}
          disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
}
