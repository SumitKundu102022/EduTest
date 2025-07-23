// src/components/candidate/application-steps/BasicDetailsForm.jsx
import React, { useState } from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"; // For date picker
import { Calendar } from "../../ui/calendar"; // For date picker
import { format } from "date-fns";
import { CalendarIcon, ChevronDownIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";
import { toast } from "sonner";





const BasicDetailsForm = ({ formData, setFormData }) => {

const handleChange = (e) => {
  const { id, value } = e.target;
  setFormData((prev) => ({ ...prev, [id]: value }));
}

  // const handleDateChange = (date) => {
  //   setFormData((prev) => ({ ...prev, dob: date }));
  //   setOpen(false);
  // };

  const handleDobChange = (part, value) => {
    const currentDate = formData.dob ? new Date(formData.dob) : new Date();
    let newDate = new Date(currentDate);

    if (part === "day") newDate.setDate(value);
    if (part === "month") newDate.setMonth(value); // 0-based month
    if (part === "year") newDate.setFullYear(value);

    const isoString = newDate.toISOString(); // ✅ convert to ISO format
    setFormData((prev) => ({ ...prev, dob: isoString }));
  };
 


  const handleGenderChange = (value) => {
    setFormData((prev) => ({ ...prev, gender: value }));
  };

  
  // const [open, setOpen] = useState(false);
  const dobDate = formData.dob ? new Date(formData.dob) : null;
  // const dobDate = new Date(formData.dob).toISOString();

  

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-zinc-800 dark:text-gray-200">
        Personal Information
      </h3>
      <div>
        <Label htmlFor="fullName">Full Name</Label>
        <Input
          id="fullName"
          type="text"
          placeholder="Your Full Name"
          value={formData.fullName}
          onChange={handleChange}
          required
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          readOnly // Email is pre-filled and read-only
          className="dark:bg-gray-700 dark:text-gray-200 cursor-not-allowed opacity-70"
        />
      </div>
      <div>
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="tel"
          placeholder="Your Phone Number"
          value={formData.phone}
          onChange={handleChange}
          onBlur={(e) => {
            const phone = e.target.value;
            const isValid = /^[6-9]\d{9}$/.test(phone);
            if (!isValid) {
              setFormData((prev) => ({ ...prev, phone: "" }));
              toast.error(
                "Enter a valid 10-digit phone number"
              );
            }
          }}
          required
          className="dark:bg-zinc-700 dark:text-zinc-200"
          // pattern="^[6-9]\d{9}$"
          title="Enter a valid 10-digit phone number starting with 6-9"
        />
      </div>
      {/* <div>
        <Label htmlFor="dob">Date of Birth</Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="dob"
              name="dob"
              onClick={() => setOpen(true)}
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 cursor-pointer",
                !formData.dob && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.dob ? (
                format(formData.dob, "PPP")
              ) : (
                <span>Choose Your Date Of Birth</span>
              )}
              <ChevronDownIcon className="ml-auto h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0 dark:bg-gray-700 dark:text-gray-100">
            <Calendar
              mode="single"
              captionLayout={"dropdown"} // This is the key prop
              selected={formData.dob}
              onSelect={handleDateChange}
              className="rounded-lg border"
              fromYear={1990}
              toYear={new Date().getFullYear()}
              // toDate={new Date()}
              initialFocus
            />
          </PopoverContent>
        </Popover>
      </div> */}
      <Label htmlFor="dob">Date of Birth</Label>
      <div className="grid grid-cols-3 gap-4">
        {/* Day */}
        <div className="relative">
          <select
            id="dob"
            className="appearance-none w-full p-2 border rounded"
            onChange={(e) => handleDobChange("day", parseInt(e.target.value))}
            value={dobDate ? dobDate.getDate() : ""}
          >
            <option disabled value="">
              Day
            </option>
            {[...Array(31)].map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none text-gray-500" />
        </div>

        {/* Month */}
        <div className="relative">
          <select
            className="appearance-none w-full p-2 border rounded"
            onChange={(e) => handleDobChange("month", parseInt(e.target.value))}
            value={dobDate ? dobDate.getMonth() : ""}
          >
            <option disabled value="">
              Month
            </option>
            {[
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ].map((month, i) => (
              <option key={i} value={i}>
                {month}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none text-gray-500" />
        </div>

        {/* Year */}
        <div className="relative">
          <select
            className="appearance-none w-full p-2 border rounded"
            onChange={(e) => handleDobChange("year", parseInt(e.target.value))}
            value={dobDate ? dobDate.getFullYear() : ""}
          >
            <option disabled value="">
              Year
            </option>
            {Array.from({ length: 100 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <option key={i} value={year}>
                  {year}
                </option>
              );
            })}
          </select>
          <ChevronDownIcon className="absolute right-2 top-2.5 h-4 w-4 pointer-events-none text-gray-500" />
        </div>
      </div>

      <div>
        <Label htmlFor="gender">Gender</Label>
        <Select
          onValueChange={handleGenderChange}
          value={formData.gender}
          required
        >
          <SelectTrigger
            id="gender"
            className="w-full dark:bg-gray-700 dark:text-gray-200 cursor-pointer"
          >
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-700 dark:text-gray-100">
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="non-binary">Non-binary</SelectItem>
            <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="address">Address</Label>
        <Textarea
          id="address"
          placeholder="Your Address"
          value={formData.address}
          onChange={handleChange}
          rows={3}
          required
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

export default BasicDetailsForm;
