// backend/utils/aiService.js
// This file will contain the logic for interacting with an AI model (e.g., Google Gemini).

const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Calls an AI model to generate MCQs from provided notes.
 * This interacts with the Google Gemini API.
 *
 * IMPORTANT NOTE ON QUESTION COUNT:
 * The AI model's ability to generate the exact 'numQuestions' requested
 * is highly dependent on the richness and length of the 'notesContent'.
 * If the notes are very brief or lack sufficient distinct information,
 * the model may generate fewer questions than requested, as it prioritizes
 * relevance and avoids hallucination or excessive repetition.
 * To get more questions, provide more comprehensive and detailed source text.
 *
 * @param {string} notesContent - The text content of the notes (from PDF/text upload).
 * @param {number} numQuestions - Desired number of questions.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of question objects.
 */
const generateQuestionsFromAI = async (notesContent, numQuestions) => {
  //console.log(`AI Service: Generating ${numQuestions} questions from notes...`);
  //console.log("Notes Snippet:", notesContent.substring(0, Math.min(notesContent.length, 200)) + "...");

  // Initialize the Generative AI model
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Or gemini-1.5-pro

  // Define the schema for the expected JSON output
  const responseSchema = {
    type: "ARRAY",
    items: {
      type: "OBJECT",
      properties: {
        questionText: { type: "STRING" },
        options: {
          type: "ARRAY",
          items: { type: "STRING" }
        },
        correctAnswerIndex: { type: "NUMBER" }
      },
      required: ["questionText", "options", "correctAnswerIndex"]
    }
  };

  const prompt = `Generate exactly ${numQuestions} multiple-choice questions (MCQs) from the following text.
Each question should have 4 options (A, B, C, D) and indicate the correct answer (0-indexed).
Ensure the questions are directly derivable from the provided text.
If the text explicitly contains an MCQ, extract it as is. Otherwise, create a new MCQ.
The output MUST be a JSON array of objects, strictly adhering to the following structure:
${JSON.stringify(responseSchema, null, 2)}

Text:
${notesContent}`;

  try {
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json", // Instruct the model to output JSON
        responseSchema: responseSchema, // Provide the schema for strict adherence
      },
    });

    const responseText = result.response.text();
    //console.log("AI Raw Response (JSON String):", responseText);

    const questions = JSON.parse(responseText);

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("AI did not return a valid array of questions or it was empty.");
    }
    questions.forEach((q, index) => {
      if (typeof q.questionText !== 'string' ||
          !Array.isArray(q.options) || q.options.length !== 4 ||
          typeof q.correctAnswerIndex !== 'number' || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
        console.warn(`AI Service: Question ${index} has unexpected format:`, q);
        throw new Error(`AI returned malformed question at index ${index}.`);
      }
    });

    // Ensure we return exactly numQuestions if the AI generated more,
    // or all questions if it generated fewer.
    const finalQuestions = questions.slice(0, numQuestions);
    //console.log(`AI Service: Successfully generated ${finalQuestions.length} questions (requested ${numQuestions}).`);
    return finalQuestions;

  } catch (error) {
    console.error("Error calling AI model:", error.message);
    console.error("AI Error Details:", error);

    // Fallback to a simple mock data if AI call fails
    // The `testController.js` will catch this and send a toast to the frontend.
    // const fallbackQuestions = [
    //   {
    //     questionText: "What is 2 + 2?",
    //     options: ["3", "4", "5", "6"],
    //     correctAnswerIndex: 1,
    //   },
    //   {
    //     questionText: "What is the capital of France?",
    //     options: ["Berlin", "Madrid", "Paris", "Rome"],
    //     correctAnswerIndex: 2,
    //   },
    //   {
    //     questionText: "Which planet is known as the Red Planet?",
    //     options: ["Earth", "Mars", "Jupiter", "Venus"],
    //     correctAnswerIndex: 1,
    //   },
    //   {
    //     questionText: "What is the largest ocean on Earth?",
    //     options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    //     correctAnswerIndex: 3,
    //   },
    //   {
    //     questionText: "Who wrote 'Romeo and Juliet'?",
    //     options: [
    //       "Charles Dickens",
    //       "William Shakespeare",
    //       "Jane Austen",
    //       "Mark Twain",
    //     ],
    //     correctAnswerIndex: 1,
    //   },
    //   {
    //     questionText: "What is the chemical symbol for water?",
    //     options: ["O2", "H2O", "CO2", "NaCl"],
    //     correctAnswerIndex: 1,
    //   },
    //   {
    //     questionText: "Which gas do plants absorb from the atmosphere?",
    //     options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    //     correctAnswerIndex: 2,
    //   },
    //   {
    //     questionText: "What is the highest mountain in the world?",
    //     options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
    //     correctAnswerIndex: 1,
    //   },
    //   {
    //     questionText: "Which continent is the Sahara Desert located in?",
    //     options: ["Asia", "Africa", "North America", "Australia"],
    //     correctAnswerIndex: 1,
    //   },
    //   {
    //     questionText: "What is the square root of 81?",
    //     options: ["7", "8", "9", "10"],
    //     correctAnswerIndex: 2,
    //   },
    // ];
    // // Return only the requested number of questions from fallback data
    // return fallbackQuestions.slice(0, numQuestions);

    // Instead of returning fallback questions, re-throw the error
    // so the calling function (e.g., in testController.js) can handle it
    // and display an appropriate error message to the user.
    throw new Error(`Failed to generate questions from AI: ${error.message}`);
  }
};

module.exports = { generateQuestionsFromAI };



// // backend/utils/aiService.js
// // This file will contain the logic for interacting with an AI model (e.g., Google Gemini).
// // The actual API call is commented out as it requires an API key and specific implementation.

// /**
//  * Simulates or calls an AI model to generate MCQs from provided notes.
//  * In a real scenario, this would interact with Google Gemini API or similar.
//  *
//  * @param {string} notesContent - The text content of the notes (from PDF/text upload).
//  * @param {number} numQuestions - Desired number of questions.
//  * @returns {Promise<Array<Object>>} A promise that resolves to an array of question objects.
//  */
// const generateQuestionsFromAI = async (notesContent, numQuestions) => {
//   console.log(`AI Service: Generating ${numQuestions} questions from notes...`);
//   console.log("Notes Snippet:", notesContent.substring(0, 200) + "...");

//   // --- Placeholder for actual AI API call ---
//   // const { GoogleGenerativeAI } = require("@google/generative-ai");
//   // const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // You'd need to add GEMINI_API_KEY to your .env
//   // const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Or gemini-1.5-flash, gemini-1.5-pro

//   // const prompt = `Generate ${numQuestions} multiple-choice questions (MCQs) from the following text.
//   // Each question should have 4 options (A, B, C, D) and indicate the correct answer.
//   // If the text explicitly contains an MCQ, extract it as is. Otherwise, create a new MCQ.
//   // Format the output as a JSON array of objects, where each object has 'questionText', 'options' (array of strings), and 'correctAnswerIndex' (0-indexed).

//   // Text:
//   // ${notesContent}`;

//   // try {
//   //   const result = await model.generateContent(prompt);
//   //   const response = await result.response;
//   //   const text = response.text();
//   //   console.log("AI Raw Response:", text);
//   //   // Attempt to parse the JSON. Robust error handling for malformed JSON is crucial here.
//   //   const questions = JSON.parse(text);
//   //   return questions;
//   // } catch (error) {
//   //   console.error("Error calling AI model:", error);
//   //   // Fallback to a simple mock or throw
//   //   return [
//   //     {
//   //       questionText: "What is 2 + 2?",
//   //       options: ["3", "4", "5", "6"],
//   //       correctAnswerIndex: 1,
//   //     },
//   //     {
//   //       questionText: "What is the capital of France?",
//   //       options: ["Berlin", "Madrid", "Paris", "Rome"],
//   //       correctAnswerIndex: 2,
//   //     },
//   //   ];
//   // }
//   // --- End Placeholder ---

//   // Mock data for demonstration without actual AI call
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const mockQuestions = [
//         {
//           questionText:
//             "According to the notes, what is the primary function of mitochondria?",
//           options: [
//             "Protein synthesis",
//             "Energy production",
//             "Waste removal",
//             "Cell division",
//           ],
//           correctAnswerIndex: 1,
//         },
//         {
//           questionText:
//             "Which of the following is a key characteristic of a recursive function mentioned in the notes?",
//           options: [
//             "It must always return a boolean",
//             "It calls itself",
//             "It uses a loop for iteration",
//             "It operates only on arrays",
//           ],
//           correctAnswerIndex: 1,
//         },
//         {
//           questionText:
//             "What historical event is described as leading to the Renaissance?",
//           options: [
//             "The fall of the Roman Empire",
//             "The Black Death",
//             "The invention of the printing press",
//             "The discovery of America",
//           ],
//           correctAnswerIndex: 1,
//         },
//         {
//           questionText: "Which programming paradigm emphasizes immutability?",
//           options: [
//             "Object-Oriented",
//             "Procedural",
//             "Functional",
//             "Imperative",
//           ],
//           correctAnswerIndex: 2,
//         },
//         {
//           questionText: "What is the capital of India?",
//           options: ["Mumbai", "Delhi", "Kolkata", "Chennai"],
//           correctAnswerIndex: 1,
//         },
//       ].slice(0, numQuestions); // Return only requested number of questions

//       resolve(mockQuestions);
//     }, 2000); // Simulate AI processing time
//   });
// };

// module.exports = { generateQuestionsFromAI };


// backend/utils/aiService.js-------------------------------------------------------------------------------------------------------------------------------------------------------
// This file will contain the logic for interacting with an AI model (e.g., Google Gemini).

// const { GoogleGenerativeAI } = require("@google/generative-ai");

// /**
//  * Calls an AI model to generate MCQs from provided notes.
//  * This interacts with the Google Gemini API.
//  *
//  * @param {string} notesContent - The text content of the notes (from PDF/text upload).
//  * @param {number} numQuestions - Desired number of questions.
//  * @returns {Promise<Array<Object>>} A promise that resolves to an array of question objects.
//  */
// const generateQuestionsFromAI = async (notesContent, numQuestions) => {
//   console.log(`AI Service: Generating ${numQuestions} questions from notes...`);
//   console.log("Notes Snippet:", notesContent.substring(0, Math.min(notesContent.length, 200)) + "...");

//   // Initialize the Generative AI model
//   // Ensure process.env.GEMINI_API_KEY is loaded via dotenv in server.js
//   const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
//   const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

//   // Define the schema for the expected JSON output
//   const responseSchema = {
//     type: "ARRAY",
//     items: {
//       type: "OBJECT",
//       properties: {
//         questionText: { type: "STRING" },
//         options: {
//           type: "ARRAY",
//           items: { type: "STRING" }
//         },
//         correctAnswerIndex: { type: "NUMBER" }
//       },
//       required: ["questionText", "options", "correctAnswerIndex"]
//     }
//   };

//   const prompt = `Generate ${numQuestions} multiple-choice questions (MCQs) from the following text.
// Each question should have 4 options (A, B, C, D) and indicate the correct answer (0-indexed).
// Ensure the questions are directly derivable from the provided text.
// If the text explicitly contains an MCQ, extract it as is. Otherwise, create a new MCQ.
// The output MUST be a JSON array of objects, strictly adhering to the following structure:
// ${JSON.stringify(responseSchema, null, 2)}

// Text:
// ${notesContent}`;

//   try {
//     const result = await model.generateContent({
//       contents: [{ role: "user", parts: [{ text: prompt }] }],
//       generationConfig: {
//         responseMimeType: "application/json", // Instruct the model to output JSON
//         responseSchema: responseSchema, // Provide the schema for strict adherence
//       },
//     });

//     const responseText = result.response.text();
//     console.log("AI Raw Response (JSON String):", responseText);

//     const questions = JSON.parse(responseText);

//     if (!Array.isArray(questions) || questions.length === 0) {
//       throw new Error("AI did not return a valid array of questions or it was empty.");
//     }
//     questions.forEach((q, index) => {
//       if (typeof q.questionText !== 'string' ||
//           !Array.isArray(q.options) || q.options.length !== 4 ||
//           typeof q.correctAnswerIndex !== 'number' || q.correctAnswerIndex < 0 || q.correctAnswerIndex > 3) {
//         console.warn(`AI Service: Question ${index} has unexpected format:`, q);
//         throw new Error(`AI returned malformed question at index ${index}.`);
//       }
//     });

//     console.log(`AI Service: Successfully generated ${questions.length} questions.`);
//     return questions;

//   } catch (error) {
//     console.error("Error calling AI model:", error.message);
//     console.error("AI Error Details:", error);

//     // Instead of toast.error, re-throw the error or throw a custom error
//     // The calling controller will catch this and send an appropriate response to the frontend.
//     throw new Error(`Failed to generate questions from AI: ${error.message}`);
//   }
// };

// module.exports = { generateQuestionsFromAI };

