// src/components/candidate/application-steps/AccomplishmentsForm.jsx
import React from "react";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";

const AccomplishmentsForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Accomplishments & Awards
      </h3>
      <div>
        <Label htmlFor="accomplishment">
          List your significant accomplishments, awards, or certifications.
        </Label>
        <Textarea
          id="accomplishment"
          placeholder="Your accomplishments, awards, or certifications"
          value={formData.accomplishment}
          onChange={handleChange}
          rows={6}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

export default AccomplishmentsForm;
