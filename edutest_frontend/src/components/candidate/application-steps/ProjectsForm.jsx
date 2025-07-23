// src/components/candidate/application-steps/ProjectsForm.jsx
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";

const ProjectsForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      project: { ...prev.project, [id]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Projects (Most Relevant)
      </h3>
      <div>
        <Label htmlFor="title">Project Title</Label>
        <Input
          id="title"
          type="text"
          placeholder="Your project title"
          value={formData.project.title}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
          required
        />
      </div>
      <div>
        <Label htmlFor="technologies">Technologies Used</Label>
        <Input
          id="technologies"
          type="text"
          placeholder="Technologies or Tech stack used"
          value={formData.project.technologies}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Project Description</Label>
        <Textarea
          id="description"
          placeholder="Describe the project's purpose, your role, and key features."
          value={formData.project.description}
          onChange={handleChange}
          rows={4}
          className="dark:bg-gray-700 dark:text-gray-200"
          required
        />
      </div>
      <div>
        <Label htmlFor="link">Project Link (Optional)</Label>
        <Input
          id="link"
          type="url"
          placeholder="GitHub, Live Demo, or Documentation link"
          value={formData.project.link}
          onChange={handleChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
      </div>
    </div>
  );
};

export default ProjectsForm;
