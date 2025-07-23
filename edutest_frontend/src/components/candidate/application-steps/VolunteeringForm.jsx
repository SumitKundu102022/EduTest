// src/components/candidate/application-steps/VolunteeringForm.jsx
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

const VolunteeringForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      volunteering: { ...prev.volunteering, [id]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Volunteering Experience (Most Recent)
      </h3>
      <div>
        <Label htmlFor="volunteeringOrganization">Organization</Label>
        <Input
          id="volunteeringOrganization"
          type="text"
          placeholder="Your volunteering organization"
          value={formData.volunteering.organization}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="volunteeringRole">Role</Label>
        <Input
          id="volunteeringRole"
          type="text"
          placeholder="Your role in the volunteering organization"
          value={formData.volunteering.role}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="volunteeringDuration">Duration</Label>
        <Input
          id="volunteeringDuration"
          type="text"
          placeholder="Time period of your volunteering"
          value={formData.volunteering.duration}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="volunteeringDescription">
          Description of Activities & Impact
        </Label>
        <Textarea
          id="volunteeringDescription"
          placeholder="Describe your volunteer duties and the impact you had"
          value={formData.volunteering.description}
          onChange={handleChange}
          rows={4}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

export default VolunteeringForm;
