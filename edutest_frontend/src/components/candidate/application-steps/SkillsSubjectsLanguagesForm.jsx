// src/components/candidate/application-steps/SkillsSubjectsLanguagesForm.jsx
import React from "react";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";

const SkillsSubjectsLanguagesForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Skills, Subjects & Languages
      </h3>
      <div>
        <Label htmlFor="technicalSkills">Technical Skills</Label>
        <Textarea
          id="technicalSkills"
          placeholder="Your technical skills"
          value={formData.technicalSkills}
          onChange={handleChange}
          rows={4}
          required
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="relevantSubjects">Relevant Subjects/Coursework</Label>
        <Textarea
          id="relevantSubjects"
          placeholder="Mention subjects relevant to the position and your expertise"
          value={formData.relevantSubjects}
          onChange={handleChange}
          rows={3}
          required
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
      <div>
        <Label htmlFor="languages">Languages Known</Label>
        <Textarea
          id="languages"
          placeholder="List languages you are proficient in"
          value={formData.languages}
          onChange={handleChange}
          rows={3}
          required
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

export default SkillsSubjectsLanguagesForm;
