// src/components/candidate/application-steps/ExtraCurricularActivitiesForm.jsx
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

const ExtraCurricularActivitiesForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      extraCurricular: { ...prev.extraCurricular, [id]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Extra-curricular Activities (Most Significant)
      </h3>
      <div>
        <Label htmlFor="activityName">Activity Name</Label>
        <Input
          id="activityName"
          type="text"
          placeholder="Your activity name"
          value={formData.extraCurricular.activityName}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="extraCurricularDescription">
          Description of Involvement & Learning
        </Label>
        <Textarea
          id="extraCurricularDescription"
          placeholder="Describe your involvement, role, and what you learned"
          value={formData.extraCurricular.description}
          onChange={handleChange}
          rows={4}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

export default ExtraCurricularActivitiesForm;
