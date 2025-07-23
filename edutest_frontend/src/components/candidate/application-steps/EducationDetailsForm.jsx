// src/components/candidate/application-steps/EducationDetailsForm.jsx
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Checkbox } from "../../ui/checkbox"; // Assuming you have shadcn/ui Checkbox
import { cn } from "../../../lib/utils"; // For conditional classNames

const EducationDetailsForm = ({ formData, setFormData }) => {
  // Handler for nested form data (e.g., formData.education.bachelor.degree)
  const handleChange = (section, field) => (e) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [section]: {
          ...prev.education[section],
          [field]: value,
        },
      },
    }));
  };

  // Handler for "Currently Pursuing" checkbox
  const handleCurrentlyPursuingChange = (section) => (checked) => {
    setFormData((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [section]: {
          ...prev.education[section],
          currentlyPursuing: checked,
          // Clear graduation year if currently pursuing
          ...(checked && { graduationYear: "" }),
        },
      },
    }));
  };

  return (
    <div className="space-y-8">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Education Details
      </h3>

      {/* Class 10 Details */}
      <div className="space-y-4 p-4 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Class Xth Details
        </h4>
        <div>
          <Label htmlFor="class10Board">Board</Label>
          <Input
            id="class10Board"
            type="text"
            placeholder="Your Class X Board"
            value={formData.education.class10.board}
            onChange={handleChange("class10", "board")}
            className="dark:bg-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div>
          <Label htmlFor="class10School">School Name</Label>
          <Input
            id="class10School"
            type="text"
            placeholder="School Name"
            value={formData.education.class10.school}
            onChange={handleChange("class10", "school")}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="class10Year">Passing Year</Label>
            <Input
              id="class10Year"
              type="number"
              placeholder="Year of Passing"
              value={formData.education.class10.passingYear}
              onChange={handleChange("class10", "passingYear")}
              className="dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div>
            <Label htmlFor="class10Percentage">Percentage/GPA</Label>
            <Input
              id="class10Percentage"
              type="text"
              placeholder="CGPA or Percentage"
              value={formData.education.class10.percentage}
              onChange={handleChange("class10", "percentage")}
              className="dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
        </div>
      </div>

      {/* Class 12 Details */}
      <div className="space-y-4 p-4 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Class XIIth Details
        </h4>
        <div>
          <Label htmlFor="class12Board">Board</Label>
          <Input
            id="class12Board"
            type="text"
            placeholder="Your Class XII Board"
            value={formData.education.class12.board}
            onChange={handleChange("class12", "board")}
            className="dark:bg-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div>
          <Label htmlFor="class12School">School Name</Label>
          <Input
            id="class12School"
            type="text"
            placeholder="School Name"
            value={formData.education.class12.school}
            onChange={handleChange("class12", "school")}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="class12Year">Passing Year</Label>
            <Input
              id="class12Year"
              type="number"
              placeholder="Year of Passing"
              value={formData.education.class12.passingYear}
              onChange={handleChange("class12", "passingYear")}
              className="dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
          <div>
            <Label htmlFor="class12Percentage">Percentage/GPA</Label>
            <Input
              id="class12Percentage"
              type="text"
              placeholder="CGPA or Percentage"
              value={formData.education.class12.percentage}
              onChange={handleChange("class12", "percentage")}
              className="dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
        </div>
      </div>

      {/* Undergraduate/Bachelor's Details */}
      <div className="space-y-4 p-4 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Undergraduate/Bachelor's Details
        </h4>
        <div>
          <Label htmlFor="bachelorDegree">Degree/Qualification</Label>
          <Input
            id="bachelorDegree"
            type="text"
            placeholder="Your Bachelor's Degree"
            value={formData.education.bachelor.degree}
            onChange={handleChange("bachelor", "degree")}
            className="dark:bg-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div>
          <Label htmlFor="bachelorUniversity">University/Institution</Label>
          <Input
            id="bachelorUniversity"
            type="text"
            placeholder="Your University/College Name"
            value={formData.education.bachelor.university}
            onChange={handleChange("bachelor", "university")}
            className="dark:bg-gray-700 dark:text-gray-200"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="bachelorYear">Graduation Year</Label>
            <Input
              id="bachelorYear"
              type="number"
              placeholder="Year of graduation"
              value={formData.education.bachelor.graduationYear}
              onChange={handleChange("bachelor", "graduationYear")}
              disabled={formData.education.bachelor.currentlyPursuing}
              className={cn(
                "dark:bg-gray-700 dark:text-gray-200",
                formData.education.bachelor.currentlyPursuing &&
                  "opacity-50 cursor-not-allowed"
              )}
              required
            />
          </div>
          <div>
            <Label htmlFor="bachelorGpa">GPA/Percentage</Label>
            <Input
              id="bachelorGpa"
              type="text"
              placeholder="CGPA or Percentage"
              value={formData.education.bachelor.gpa}
              onChange={handleChange("bachelor", "gpa")}
              className="dark:bg-gray-700 dark:text-gray-200"
              required
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="bachelorCurrentlyPursuing"
            checked={formData.education.bachelor.currentlyPursuing}
            onCheckedChange={handleCurrentlyPursuingChange("bachelor")}
            className="dark:border-gray-500"
          />
          <Label
            htmlFor="bachelorCurrentlyPursuing"
            className="text-sm cursor-pointer select-none"
          >
            Currently Pursuing
          </Label>
        </div>
      </div>

      {/* Postgraduate Details */}
      <div className="space-y-4 p-4 border rounded-md dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Postgraduate Details (Optional)
        </h4>
        <div>
          <Label htmlFor="postGradDegree">Degree/Qualification</Label>
          <Input
            id="postGradDegree"
            type="text"
            placeholder="Your Postgraduate Degree"
            value={formData.education.postGraduation.degree}
            onChange={handleChange("postGraduation", "degree")}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div>
          <Label htmlFor="postGradUniversity">University/Institution</Label>
          <Input
            id="postGradUniversity"
            type="text"
            placeholder="Your University/College Name"
            value={formData.education.postGraduation.university}
            onChange={handleChange("postGraduation", "university")}
            className="dark:bg-gray-700 dark:text-gray-200"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="postGradYear">Graduation Year</Label>
            <Input
              id="postGradYear"
              type="number"
              placeholder="Year of graduation"
              value={formData.education.postGraduation.graduationYear}
              onChange={handleChange("postGraduation", "graduationYear")}
              disabled={formData.education.postGraduation.currentlyPursuing}
              className={cn(
                "dark:bg-gray-700 dark:text-gray-200",
                formData.education.postGraduation.currentlyPursuing &&
                  "opacity-50 cursor-not-allowed"
              )}
            />
          </div>
          <div>
            <Label htmlFor="postGradGpa">GPA/Percentage</Label>
            <Input
              id="postGradGpa"
              type="text"
              placeholder="CGPA or Percentage"
              value={formData.education.postGraduation.gpa}
              onChange={handleChange("postGraduation", "gpa")}
              className="dark:bg-gray-700 dark:text-gray-200"
            />
          </div>
        </div>
        <div className="flex items-center space-x-2 mt-2">
          <Checkbox
            id="postGradCurrentlyPursuing"
            checked={formData.education.postGraduation.currentlyPursuing}
            onCheckedChange={handleCurrentlyPursuingChange("postGraduation")}
            className="dark:border-gray-500"
          />
          <Label
            htmlFor="postGradCurrentlyPursuing"
            className="text-sm cursor-pointer select-none"
          >
            Currently Pursuing
          </Label>
        </div>
      </div>
    </div>
  );
};

export default EducationDetailsForm;
