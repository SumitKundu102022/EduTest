// src/components/ui/table.jsx
import * as React from "react";

import { cn } from "../../lib/utils";

/**
 * Table Component (Root)
 *
 * This component provides a responsive container for an HTML table.
 * It ensures that the table can scroll horizontally on smaller screens.
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying HTML div element.
 */
const Table = React.forwardRef(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
));
Table.displayName = "Table";

/**
 * TableHeader Component
 *
 * This component represents the header section of a table (`<thead>`).
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying HTML thead element.
 */
const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

/**
 * TableBody Component
 *
 * This component represents the body section of a table (`<tbody>`).
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying HTML tbody element.
 */
const TableBody = React.forwardRef(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

/**
 * TableFooter Component
 *
 * This component represents the footer section of a table (`<tfoot>`).
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying HTML tfoot element.
 */
const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
));
TableFooter.displayName = "TableFooter";

/**
 * TableRow Component
 *
 * This component represents a single row in a table (`<tr>`).
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying HTML tr element.
 */
const TableRow = React.forwardRef(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
));
TableRow.displayName = "TableRow";

/**
 * TableHead Component
 *
 * This component represents a header cell in a table (`<th>`).
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying HTML th element.
 */
const TableHead = React.forwardRef(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
));
TableHead.displayName = "TableHead";

/**
 * TableCell Component
 *
 * This component represents a data cell in a table (`<td>`).
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying HTML td element.
 */
const TableCell = React.forwardRef(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

/**
 * TableCaption Component
 *
 * This component represents the caption for a table (`<caption>`).
 *
 * @param {Object} props - The component props.
 * @param {string} [props.className] - Additional CSS classes to apply.
 * @param {React.Ref} ref - A ref to the underlying HTML caption element.
 */
const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
