// services/providers/GeminiProvider.js
// -------------------------------------------------
// Gemini Provider
// -------------------------------------------------
// This provider integrates with Google Generative AI (Gemini)
// using the official @google/genai SDK.
// It reads GEMINI_API_KEY from environment variables and sends
// a structured prompt to the gemini-3.5-flash model.
// -------------------------------------------------

// Load environment variables from .env.txt file
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.txt') });

// Import the official Google Gen AI SDK
const { GoogleGenAI } = require('@google/genai');

/**
 * Generates a code-fix response using the Gemini 2.5 Flash model.
 *
 * @param {string} code - The source code submitted by the user.
 * @param {string} instruction - The user instruction (e.g., "Fix Code").
 * @returns {Promise<Object>} Standardized response object.
 * @throws {Error} If GEMINI_API_KEY is missing or the API call fails.
 */
async function generateResponse(code, instruction) {
  // -------------------------------------------------------
  // 1. Validate that the API key exists in environment.
  // -------------------------------------------------------
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      'GEMINI_API_KEY is not set. Add it to your .env.txt file.'
    );
  }

  // -------------------------------------------------------
  // 2. Initialise the Gemini client.
  // -------------------------------------------------------
  const ai = new GoogleGenAI({ apiKey: apiKey });

  // -------------------------------------------------------
  // 3. Build the prompt following the Solvix AI persona.
  // -------------------------------------------------------
  const prompt = `You are Solvix AI, an expert programming assistant.

Your tasks are:
- Fix syntax errors.
- Fix runtime errors.
- Improve readability.
- Preserve the original logic.
- Never remove required functionality.
- Return only the corrected code (no Markdown code fences).
- Also provide a short explanation of what was changed.
- List any errors that were found.

User Instruction:
${instruction}

User Code:
${code}`;

  // -------------------------------------------------------
  // 4. Call the Gemini API inside a try/catch for safety.
  // -------------------------------------------------------
  let resultText;
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt
    });
    // Extract the text from the SDK response object.
    resultText = response.text;
  } catch (err) {
    // Wrap any SDK / network error with a clear message.
    throw new Error(`Gemini API request failed: ${err.message}`);
  }

  // -------------------------------------------------------
  // 5. Return the standardized response object.
  //    The entire model output is placed in fixedCode.
  //    explanation and errorsFound are empty placeholders
  //    that can be parsed from the response in the future.
  // -------------------------------------------------------
  return {
    success: true,
    fixedCode: resultText || '',
    explanation: '',
    errorsFound: [],
    provider: 'Gemini',
    model: 'gemini-3.5-flash',
  };
}

module.exports = { generateResponse };
