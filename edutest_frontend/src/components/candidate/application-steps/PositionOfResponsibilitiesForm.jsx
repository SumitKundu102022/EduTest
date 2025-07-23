// src/components/candidate/application-steps/PositionOfResponsibilitiesForm.jsx
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

const PositionOfResponsibilitiesForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      responsibility: { ...prev.responsibility, [id]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Position of Responsibility (Most Significant)
      </h3>
      <div>
        <Label htmlFor="role">Role/Position</Label>
        <Input
          id="role"
          type="text"
          placeholder="Your role in the organization or event"
          value={formData.responsibility.role}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="organization">Organization/Club/Event</Label>
        <Input
          id="organization"
          type="text"
          placeholder="Your organization, club, or event name"
          value={formData.responsibility.organization}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="description">
          Description of Responsibilities & Impact
        </Label>
        <Textarea
          id="description"
          placeholder="Describe your duties and the positive impact you made."
          value={formData.responsibility.description}
          onChange={handleChange}
          rows={4}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

export default PositionOfResponsibilitiesForm;
