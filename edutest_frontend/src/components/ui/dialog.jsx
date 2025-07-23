// src/components/ui/dialog.jsx
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react"; // Assuming lucide-react is installed for icons

import { cn } from "../../lib/utils"; // Assuming you have a utils.js for cn helper

/**
 * Dialog component (Root)
 * This is the main container for the dialog.
 * It's a direct re-export from Radix UI's Dialog.
 */
const Dialog = DialogPrimitive.Root;

/**
 * DialogTrigger component
 * This component triggers the opening of the dialog.
 * It's a direct re-export from Radix UI's DialogTrigger.
 */
const DialogTrigger = DialogPrimitive.Trigger;

/**
 * DialogPortal component
 * This component renders its children outside the DOM hierarchy of the parent component,
 * typically at the end of the <body>, which is good for accessibility and z-indexing.
 * It's a direct re-export from Radix UI's DialogPortal.
 */
const DialogPortal = DialogPrimitive.Portal;

/**
 * DialogClose component
 * This component closes the dialog when clicked.
 * It's a direct re-export from Radix UI's DialogClose.
 */
const DialogClose = DialogPrimitive.Close;

/**
 * DialogOverlay component
 * This renders a semi-transparent overlay behind the dialog content.
 * It fades in/out for a smooth transition.
 */
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

/**
 * DialogContent component
 * This is the main content area of the dialog, including the close button.
 * It handles animations for entering and exiting the screen.
 */
const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

/**
 * DialogHeader component
 * This component is for the header section of the dialog, typically containing the title and description.
 */
const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

/**
 * DialogFooter component
 * This component is for the footer section of the dialog, typically containing action buttons.
 */
const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

/**
 * DialogTitle component
 * This component renders the title of the dialog.
 * It's a direct re-export from Radix UI's DialogTitle.
 */
const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

/**
 * DialogDescription component
 * This component renders the description or explanatory text of the dialog.
 * It's a direct re-export from Radix UI's DialogDescription.
 */
const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
};
