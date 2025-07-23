// src/components/candidate/ApplicationForm.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import api from '../../lib/api'; // Import the centralized API client
import { useAuth } from '../../contexts/AuthContext'; // To get user ID and update user status

// Import individual step components
import BasicDetailsForm from './application-steps/BasicDetailsForm';
import EducationDetailsForm from './application-steps/EducationDetailsForm';
import InternshipWorkExForm from './application-steps/InternshipWorkExForm';
import SkillsSubjectsLanguagesForm from './application-steps/SkillsSubjectsLanguagesForm';
import PositionOfResponsibilitiesForm from './application-steps/PositionOfResponsibilitiesForm';
import ProjectsForm from './application-steps/ProjectsForm';
import AccomplishmentsForm from './application-steps/AccomplishmentsForm';
import VolunteeringForm from './application-steps/VolunteeringForm';
import ExtraCurricularActivitiesForm from './application-steps/ExtraCurricularActivitiesForm';
import ResumeDocsWriteupsForm from './application-steps/ResumeDocsWriteupsForm';


/**
 * ApplicationForm Component (Multi-Step)
 *
 * This component orchestrates a multi-step application form.
 * It manages the current step, collects data from each step component,
 * and handles the final submission.
 *
 * @param {Object} props - The component props.
 * @param {Function} props.onApplicationComplete - Callback function when the application is successfully submitted.
 * @param {Object} props.user - The authenticated user object (from AuthContext), used for pre-filling email.
 */
const ApplicationForm = ({ onApplicationComplete }) => {
  const { user, updateUser } = useAuth(); // Get user and updateUser function
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Basic Details
    fullName: user?.name || '',
    email: user?.email || '', // Pre-fill email from authenticated user
    phone: '',
    dob: null, // Date object
    gender: '',
    address: '',

    // Education Details (Expanded Structure)
    education: {
      class10: {
        board: '',
        school: '',
        passingYear: '',
        percentage: '',
      },
      class12: {
        board: '',
        school: '',
        passingYear: '',
        percentage: '',
      },
      bachelor: {
        degree: '',
        university: '',
        graduationYear: '',
        gpa: '',
        currentlyPursuing: false,
      },
      postGraduation: {
        degree: '',
        university: '',
        graduationYear: '',
        gpa: '',
        currentlyPursuing: false,
      },
    },

    // Internship & Work Experience (simplified to one entry for now)
    workExperience: {
      companyName: '',
      position: '',
      startDate: null,
      endDate: null,
      responsibilities: '',
    },

    // Skills, Subjects & Languages
    technicalSkills: '',
    relevantSubjects: '',
    languages: '',

    // Position of Responsibilities (simplified to one entry)
    responsibility: {
      role: '',
      organization: '',
      description: '',
    },

    // Projects (simplified to one entry)
    project: {
      title: '',
      technologies: '',
      description: '',
      link: '',
    },

    // Accomplishments (simplified to one entry)
    accomplishment: '',

    // Volunteering (simplified to one entry)
    volunteering: {
      organization: '',
      role: '',
      duration: '',
      description: '',
    },

    // Extra-curricular Activities (simplified to one entry)
    extraCurricular: {
      activityName: '',
      description: '',
    },

    // Resume, Docs & Write-ups (simulated file paths/URLs)
    resumeFile: null, // Will be File object, need to handle upload separately or convert to URL
    coverLetterFile: null, // Will be File object
    portfolioLink: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { name: 'Basic Details', component: BasicDetailsForm },
    { name: 'Education Details', component: EducationDetailsForm },
    { name: 'Internship & Work Ex', component: InternshipWorkExForm },
    { name: 'Skills, Subjects & Languages', component: SkillsSubjectsLanguagesForm },
    { name: 'Positions of Responsibility', component: PositionOfResponsibilitiesForm },
    { name: 'Projects', component: ProjectsForm },
    { name: 'Accomplishments', component: AccomplishmentsForm },
    { name: 'Volunteering', component: VolunteeringForm },
    { name: 'Extra-curricular Activities', component: ExtraCurricularActivitiesForm },
    { name: 'Resume, Docs & Write-ups', component: ResumeDocsWriteupsForm },
  ];

  const totalSteps = steps.length;
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  const handleNext = () => {
    // Basic validation for the current step before moving next
    // In a real app, you'd add more robust validation for each step's required fields
    if (currentStep === 0 && (!formData.fullName || !formData.phone || !formData.address || !formData.dob || !formData.gender)) {
      toast.error('Please complete all required Basic Details.');
      return;
    }
    // Add similar validation for other steps as needed
    if (currentStep === 1 && (!formData.education.class10.board || !formData.education.class10.school || !formData.education.class10.passingYear || !formData.education.class10.percentage) && (!formData.education.class10.board || !formData.education.class10.school || !formData.education.class10.passingYear || !formData.education.class10.percentage)) {
      toast.error('Please complete all required Class 10 Education Details.');
      return;
    }

    if (
      currentStep === 1 &&
      (!formData.education.class12.board ||
        !formData.education.class12.school ||
        !formData.education.class12.passingYear ||
        !formData.education.class12.percentage) &&
      (!formData.education.class12.board ||
        !formData.education.class12.school ||
        !formData.education.class12.passingYear ||
        !formData.education.class12.percentage)
    ) {
      toast.error("Please complete all required Class 12 Education Details.");
      return;
    }

    if (currentStep === 1 &&
      (!formData.education.bachelor.degree ||
        !formData.education.bachelor.university ||
        !formData.education.bachelor.graduationYear ||
        !formData.education.bachelor.gpa)) {
      toast.error("Please complete all required Bachelor's Degree Education Details.");
      return;
    }

    if (currentStep === 3 && (!formData.technicalSkills || !formData.relevantSubjects || !formData.languages)) {
      toast.error("Please complete all required Skills, Subjects & Languages Details.");
      return;
    }

    if (currentStep === 4 && (!formData.responsibility.role || !formData.responsibility.organization || !formData.responsibility.description)) {
      toast.error("Please complete all required Position of Responsibilities Details.");
      return;
    }

    if (currentStep === 5 && (!formData.project.title || !formData.project.technologies || !formData.project.description)) {
      toast.error("Please complete all required Project Details.");
      return;
    }
    
    if (currentStep === totalSteps - 1 && !formData.resumeFile) {
      toast.error("Please upload Resume.");
      return;
    }

    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  // const handleFinalSubmit = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
    

  //   // In a real application, you'd upload files (resume, cover letter) first
  //   // and get their URLs before submitting the main application form data.
  //   // For this example, we'll just send the text data.
  //   // File upload logic would be more complex, likely involving FormData and separate API endpoints.
  //   let resumeUrl = null;
  //   let coverLetterUrl = null;

  //   // Example of how you might handle file uploads (conceptual)
  //   // if (formData.resumeFile) {
  //   //   const resumeFormData = new FormData();
  //   //   resumeFormData.append('file', formData.resumeFile);
  //   //   try {
  //   //     const uploadRes = await api.post('/uploads/resume', resumeFormData, {
  //   //       headers: { 'Content-Type': 'multipart/form-data' },
  //   //     });
  //   //     resumeUrl = uploadRes.data.url;
  //   //   } catch (uploadError) {
  //   //     toast.error('Failed to upload resume.');
  //   //     setIsLoading(false);
  //   //     console.error('Resume upload error:', uploadError);
  //   //     return;
  //   //   }
  //   // }

  //   try {
  //     const payload = {
  //       ...formData,
  //       dob: formData.dob ? formData.dob.toISOString() : null, // Convert Date object to ISO string
  //       workExperience: [{ // Simplified for now, expand if multiple entries are allowed
  //           ...formData.workExperience,
  //           startDate: formData.workExperience.startDate ? formData.workExperience.startDate.toISOString() : null,
  //           endDate: formData.workExperience.endDate ? formData.workExperience.endDate.toISOString() : null,
  //       }],
  //       responsibilitiesHeld: [formData.responsibility], // Wrap single responsibility in array
  //       projects: [formData.project], // Wrap single project in array
  //       accomplishments: formData.accomplishment, // Keep as string
  //       volunteering: [formData.volunteering], // Wrap single volunteering in array
  //       extraCurricularActivities: [formData.extraCurricular], // Wrap single extra-curricular in array
  //       resumeFileUrl: resumeUrl, // Use actual uploaded URL
  //       coverLetterFileUrl: coverLetterUrl, // Use actual uploaded URL
  //     };

  //     // Remove the original File objects as the backend expects URLs
  //     delete payload.resumeFile;
  //     delete payload.coverLetterFile;
  //     delete payload.responsibility; // Remove old single object
  //     delete payload.project;
  //     delete payload.volunteering;
  //     delete payload.extraCurricular;


  //     const response = await api.post('/candidate/application', payload);

  //     toast.success(response.data.message);
  //     updateUser({ ...user, isApplicationCompleted: true }); // Update AuthContext state
  //     onApplicationComplete(); // Notify parent component
  //   } catch (error) {
  //     const errorMessage = error.response?.data?.message || 'Failed to submit application. Please try again.';
  //     toast.error(errorMessage);
  //     console.error('Application submission error:', error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    let resumeUrl = null;
    let coverLetterUrl = null;

    // --- DEBUGGING LOGS START ---
    // console.log("--- Final Submit Debug ---");
    // console.log("formData.resumeFile:", formData.resumeFile);
    // console.log("formData.resumeFile?.file:", formData.resumeFile?.file);
    // console.log("formData.coverLetterFile:", formData.coverLetterFile);
    // console.log(
    //   "formData.coverLetterFile?.file:",
    //   formData.coverLetterFile?.file
    // );
    // console.log("portfolioLink:---------------------------------------->", formData.portfolioLink);
    // --- DEBUGGING LOGS END ---

    try {
      // Upload Resume File
      if (formData.resumeFile?.file) {
        // Ensure the actual File object exists
        const resumeFormData = new FormData();
        resumeFormData.append("file", formData.resumeFile.file);

        const uploadRes = await api.post("/uploads/resume", resumeFormData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        resumeUrl = uploadRes.data.fileUrl; // Use fileUrl as per backend response
        // console.log("Resume uploaded successfully. URL:", resumeUrl);
      } else {
        // console.log(
        //   "No resume file to upload or formData.resumeFile.file is null/undefined."
        // );
      }

      // Upload Cover Letter File
      if (formData.coverLetterFile?.file) {
        // Ensure the actual File object exists
        const coverLetterFormData = new FormData();
        coverLetterFormData.append("file", formData.coverLetterFile.file);

        const uploadRes = await api.post(
          "/uploads/cover-letter",
          coverLetterFormData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        coverLetterUrl = uploadRes.data.fileUrl; // Use fileUrl as per backend response
        //console.log("Cover Letter uploaded successfully. URL:", coverLetterUrl);
      } else {
        // console.log(
        //   "No cover letter file to upload or formData.coverLetterFile.file is null/undefined."
        // );
      }

      // Construct full payload
      const payload = {
        ...formData,
        dob: formData.dob ? new Date(formData.dob).toISOString() : null,
        workExperience: [
          {
            ...formData.workExperience,
            startDate: formData.workExperience.startDate
              ? formData.workExperience.startDate.toISOString()
              : null,
            endDate: formData.workExperience.endDate
              ? formData.workExperience.endDate.toISOString()
              : null,
          },
        ],
        responsibilitiesHeld: [formData.responsibility],
        projects: [formData.project],
        accomplishments: formData.accomplishment,
        volunteering: [formData.volunteering],
        extraCurricularActivities: [formData.extraCurricular],
        resumeFileUrl: resumeUrl, // Use actual uploaded URL
        coverLetterFileUrl: coverLetterUrl, // Use actual uploaded URL
      };

      // Remove unnecessary raw File objects and flatten single-entry fields
      delete payload.resumeFile;
      delete payload.coverLetterFile;
      delete payload.responsibility;
      delete payload.project;
      delete payload.volunteering;
      delete payload.extraCurricular;

      // console.log("Final Application Payload:", payload); // Log the payload before sending

      // Final form submission
      const response = await api.post("/candidate/application", payload);

      toast.success(response.data.message || "Application submitted!");
      updateUser({ ...user, isApplicationCompleted: true });
      onApplicationComplete();
    } catch (error) {
      console.error("Application submission error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to submit application. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };


  const CurrentStepComponent = steps[currentStep].component;

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8 border border-gray-200 dark:border-gray-700 mx-auto my-8"
    >
      <h2 className="text-3xl font-bold text-center text-zinc-700 dark:text-blue-400 mb-4">
        Job Application Form
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
        Step {currentStep + 1} of {totalSteps}: {steps[currentStep].name}
      </p>

      {/* Progress Bar */}
      <Progress value={progressValue} className="w-full h-2 mb-8" />

      {/* Current Step Form */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep} // Key changes on step change to trigger exit/enter animations
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Pass user prop to BasicDetailsForm for pre-filling email */}
          <CurrentStepComponent
            formData={formData}
            setFormData={setFormData}
            user={user}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-100 dark:border-gray-700">
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            type="button"
            onClick={handlePrevious}
            disabled={currentStep === 0 || isLoading}
            variant="outline"
            className="dark:text-gray-200 dark:border-gray-600 cursor-pointer"
          >
            Previous
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          {currentStep < totalSteps - 1 ? (
            <Button
              type="button"
              onClick={handleNext}
              disabled={isLoading}
              className="bg-zinc-600 hover:bg-zinc-700 text-white cursor-pointer px-8 py-2"
            >
              Next
            </Button>
          ) : (
            <Button
              type="button"
              onClick={handleFinalSubmit}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
            >
              {isLoading ? "Submitting..." : "Submit Application"}
            </Button>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ApplicationForm;
