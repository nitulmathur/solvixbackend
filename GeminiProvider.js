// GeminiProvider.js
// -------------------------------------------------
// SOLVIX Gemini AI Provider
// -------------------------------------------------

const { GoogleGenAI } = require('@google/genai');

/**
 * Generate a response using Google's Gemini API.
 *
 * Required environment variable:
 * GEMINI_API_KEY
 */
async function generateResponse(code, instruction) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    const error = new Error('GEMINI_API_KEY environment variable is not configured');
    error.status = 503;
    error.code = 'GEMINI_API_KEY_MISSING';
    throw error;
  }

  const ai = new GoogleGenAI({
    apiKey
  });

  const prompt = `
You are SOLVIX, an AI coding assistant.

The user has provided the following source code:

--- CODE START ---
${code}
--- CODE END ---

User instruction:
${instruction}

Analyze the code carefully and provide the corrected result.

Return your response as valid JSON with this structure:

{
  "fixedCode": "the complete corrected source code",
  "explanation": "a concise explanation of what was fixed",
  "changes": [
    "change 1",
    "change 2"
  ]
}

Important:
- fixedCode must contain the COMPLETE corrected code.
- Do not omit unchanged sections.
- Do not wrap the JSON in Markdown code fences.
- Ensure the response is valid JSON.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text;

    if (!text) {
      throw new Error('Gemini returned an empty response');
    }

    // Remove accidental Markdown code fences if Gemini adds them.
    const cleanedText = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    try {
      return JSON.parse(cleanedText);
    } catch (parseError) {
      // If Gemini didn't return valid JSON, preserve the response
      // instead of crashing the backend.
      return {
        fixedCode: code,
        explanation: cleanedText,
        changes: []
      };
    }
  } catch (error) {
    console.error('Gemini API error:', {
      message: error.message,
      status: error.status || error.statusCode,
      code: error.code
    });

    const providerError = new Error(
      `Gemini request failed: ${error.message || 'Unknown error'}`
    );
    providerError.status = Number(error.status || error.statusCode) || 502;
    providerError.code = error.code || 'GEMINI_REQUEST_FAILED';
    throw providerError;
  }
}

module.exports = {
  generateResponse
};
