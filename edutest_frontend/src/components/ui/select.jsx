// src/components/ui/select.jsx
import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "../../lib/utils";

/**
 * Select Component (Root)
 *
 * This is the main container for the select component.
 * It's a direct re-export from Radix UI's Select.
 */
const Select = SelectPrimitive.Root;

/**
 * SelectGroup Component
 *
 * This component groups related select items.
 * It's a direct re-export from Radix UI's SelectGroup.
 */
const SelectGroup = SelectPrimitive.Group;

/**
 * SelectValue Component
 *
 * This component displays the currently selected value of the select.
 * It's a direct re-export from Radix UI's SelectValue.
 */
const SelectValue = SelectPrimitive.Value;

/**
 * SelectTrigger Component
 *
 * This component is the visible part of the select that users interact with
 * to open the dropdown. It includes a chevron icon.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying HTML button element.
 */
const SelectTrigger = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1",
        className
      )}
      {...props}
    >
      {children}
      <SelectPrimitive.Icon asChild>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
);
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;

/**
 * SelectContent Component
 *
 * This component contains the dropdown list of select items.
 * It handles positioning and animations.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {string} [props.position="popper"] - Positioning strategy ("popper" or "item-aligned").
 * @param {React.Ref} ref - A ref to the underlying Radix SelectContent element.
 */
const SelectContent = React.forwardRef(
  ({ className, children, position = "popper", ...props }, ref) => (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        ref={ref}
        className={cn(
          "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          position === "popper" &&
            "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
          className
        )}
        position={position}
        {...props}
      >
        <SelectPrimitive.Viewport
          className={cn(
            "p-1",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]"
          )}
        >
          {children}
        </SelectPrimitive.Viewport>
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  )
);
SelectContent.displayName = SelectPrimitive.Content.displayName;

/**
 * SelectLabel Component
 *
 * This component provides a label for a group of select items.
 * It's a direct re-export from Radix UI's SelectLabel.
 */
const SelectLabel = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Label
    ref={ref}
    className={cn("py-1.5 pl-8 pr-2 text-sm font-semibold", className)}
    {...props}
  />
));
SelectLabel.displayName = SelectPrimitive.Label.displayName;

/**
 * SelectItem Component
 *
 * This component represents an individual selectable item in the dropdown.
 * It includes a checkmark icon when selected.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying Radix SelectItem element.
 */
const SelectItem = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <SelectPrimitive.ItemIndicator>
          <Check className="h-4 w-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
);
SelectItem.displayName = SelectPrimitive.Item.displayName;

/**
 * SelectSeparator Component
 *
 * This component provides a visual separator between select items or groups.
 * It's a direct re-export from Radix UI's SelectSeparator.
 */
const SelectSeparator = React.forwardRef(({ className, ...props }, ref) => (
  <SelectPrimitive.Separator
    ref={ref}
    className={cn("-mx-1 my-1 h-px bg-muted", className)}
    {...props}
  />
));
SelectSeparator.displayName = SelectPrimitive.Separator.displayName;

export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
};
