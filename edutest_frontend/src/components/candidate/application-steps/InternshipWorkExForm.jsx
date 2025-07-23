// src/components/candidate/application-steps/InternshipWorkExForm.jsx
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Calendar } from "../../ui/calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "../../../lib/utils";
import { Button } from "../../ui/button";

const InternshipWorkExForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      workExperience: { ...prev.workExperience, [id]: value },
    }));
  };

  const handleDateChange = (field, date) => {
    setFormData((prev) => ({
      ...prev,
      workExperience: { ...prev.workExperience, [field]: date },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Internship & Work Experience (Most Recent)
      </h3>
      <div>
        <Label htmlFor="companyName">Company Name</Label>
        <Input
          id="companyName"
          type="text"
          placeholder="Your Company Name"
          value={formData.workExperience.companyName}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="position">Position/Role</Label>
        <Input
          id="position"
          type="text"
          placeholder="Your Position/Role"
          value={formData.workExperience.position}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600",
                  !formData.workExperience.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.workExperience.startDate ? (
                  format(formData.workExperience.startDate, "PPP")
                ) : (
                  <span>Pick a start date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 dark:bg-gray-700 dark:text-gray-100">
              <Calendar
                mode="single"
                selected={formData.workExperience.startDate}
                onSelect={(date) => handleDateChange("startDate", date)}
                className="rounded-lg border"
                captionLayout="dropdown"
                fromYear={1990}
                toYear={new Date().getFullYear()}
                toDate={new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div>
          <Label htmlFor="endDate">End Date (or Present)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600",
                  !formData.workExperience.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {formData.workExperience.endDate ? (
                  format(formData.workExperience.endDate, "PPP")
                ) : (
                  <span>Pick an end date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 dark:bg-gray-700 dark:text-gray-100">
              <Calendar
                mode="single"
                selected={formData.workExperience.endDate}
                onSelect={(date) => handleDateChange("endDate", date)}
                className="rounded-lg border"
                captionLayout="dropdown"
                fromYear={1990}
                toYear={new Date().getFullYear()}
                toDate={new Date()}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <div>
        <Label htmlFor="responsibilities">
          Key Responsibilities/Achievements
        </Label>
        <Textarea
          id="responsibilities"
          placeholder="Describe your role and what you achieved."
          value={formData.workExperience.responsibilities}
          onChange={handleChange}
          rows={4}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

export default InternshipWorkExForm;
