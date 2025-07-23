// src/components/candidate/application-steps/ResumeDocsWriteupsForm.jsx
import React from "react";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { toast } from "sonner"; // Assuming you have sonner for toasts

/**
 * ResumeDocsWriteupsForm Component
 *
 * This component is a step within the multi-step application form.
 * It allows candidates to upload their resume and other relevant documents,
 * and provide links to their online portfolios or write-ups.
 *
 * Features:
 * - File input for Resume (PDF).
 * - File input for Cover Letter (Optional, PDF/DOCX).
 * - Text input for Portfolio/Personal Website Link.
 * - Uses Shadcn/ui `Input` and `Label` components.
 * - Includes a placeholder for file upload simulation and toast notifications.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.formData - The current state of the entire application form data.
 * @param {Function} props.setFormData - Function to update the entire application form data.
 */
const ResumeDocsWriteupsForm = ({ formData, setFormData }) => {
  /**
   * Handles changes for file input fields.
   * In a real application, this would trigger an actual file upload to a backend
   * storage service (e.g., AWS S3, Google Cloud Storage), and the URL of the
   * uploaded file would then be saved in the formData.
   * For this simulation, it just stores the File object.
   * @param {Event} e - The change event from the file input.
   */
  // const handleFileChange = (e) => {
  //   const { id, files } = e.target;
  //   if (files && files[0]) {
  //     // Simulate file selection and potential upload
  //     toast.info(
  //       `File selected for ${id}: ${files[0].name}. (Upload would happen on final submit)`
  //     );
  //     setFormData((prev) => ({ ...prev, [id]: files[0] })); // Store the File object
  //   } else {
  //     setFormData((prev) => ({ ...prev, [id]: null })); // Clear if no file selected
  //   }
  // };

  // Define the maximum allowed file size in MB
  const MAX_FILE_SIZE_MB = 10;
  const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024; // Convert MB to bytes

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    // console.log("File input changed:", id, files);
    if (files.length > 0) {
      const file = files[0];
      // Client-side file size validation
      if (file.size > MAX_FILE_SIZE_BYTES) {
        toast.error(
          `File is too large. Max size allowed is ${MAX_FILE_SIZE_MB} MB.`
        );
        // Clear the file input and the formData entry
        e.target.value = null; // Clear the input visually
        setFormData((prev) => ({
          ...prev,
          [id]: null, // Set the formData entry to null
        }));
        return; // Stop further processing
      }

      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        [id]: { name: file.name, file: file, url: previewUrl },
      }));
      toast.info(
        `File "${file.name}" selected (${(file.size / (1024 * 1024)).toFixed(
          2
        )} MB).`
      );
    } else {
      // If no file is selected (e.g., user opens dialog and cancels)
      setFormData((prev) => ({
        ...prev,
        [id]: null,
      }));
    }
  };

  /**
   * Handles changes for text/URL input fields.
   * @param {Event} e - The change event from the input.
   */
  const handleLinkChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
        Resume, Documents & Write-ups
      </h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        Please upload your relevant documents and provide links to your online
        presence.
      </p>

      {/* Resume File Upload */}
      <div>
        <Label htmlFor="resumeFile">Upload Resume (PDF)</Label>
        <Input
          id="resumeFile"
          type="file"
          accept=".pdf" // Only allow PDF files
          onChange={handleFileChange}
          className="py-0.5 dark:bg-gray-700 dark:text-gray-200 file:mr-5 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 file:cursor-pointer"
          required // Uncomment if resume is mandatory
        />
        {/* {formData.resumeFile && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Selected:{" "}
            <span className="font-medium">{formData.resumeFile.name}</span>
          </p>
        )} */}
        {formData.resumeFile && (
          <div className="mt-2">
            <p className="text-sm text-amber-400 dark:text-gray-300">
              {/* Selected: {formData.resumeFile.name}{" "} */}
              Selected: {formData.resumeFile.name}{" "}
              <a
                href={formData.resumeFile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 underline text-sm ml-2"
              >
                View
              </a>
            </p>
          </div>
        )}
      </div>

      {/* Cover Letter File Upload */}
      <div>
        <Label htmlFor="coverLetterFile">
          Upload Cover Letter (Optional, PDF/DOCX)
        </Label>
        <Input
          id="coverLetterFile"
          type="file"
          accept=".pdf,.doc,.docx" // Allow PDF, DOC, DOCX
          onChange={handleFileChange}
          className="py-0.5 dark:bg-gray-700 dark:text-gray-200 file:mr-5 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-100 file:text-zinc-700 hover:file:bg-zinc-200 file:cursor-pointer"
        />
        {formData.coverLetterFile && (
          <p className="text-sm text-amber-400 mt-2">
            Selected:{" "}
            <span className="font-medium">{formData.coverLetterFile.name}</span>
            {/* ({(formData.coverLetterFile.size / (1024 * 1024)).toFixed(2)} MB){" "} */}
          </p>
        )}
      </div>

      {/* Portfolio/Personal Website Link */}
      <div>
        <Label htmlFor="portfolioLink">
          Portfolio/Personal Website Link (Optional)
        </Label>
        <Input
          id="portfolioLink"
          type="url"
          placeholder="Your portfolio or personal website link"
          value={formData.portfolioLink}
          onChange={handleLinkChange}
          className="dark:bg-gray-700 dark:text-gray-200"
        />
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Link to your online portfolio, GitHub, LinkedIn, or personal website.
        </p>
      </div>
    </div>
  );
};

export default ResumeDocsWriteupsForm;
