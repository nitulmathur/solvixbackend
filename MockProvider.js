// services/providers/MockProvider.js
// Mock AI provider used during development.
// It mimics an AI service by returning a static fixed code response.
// This file can be replaced later with real provider implementations (Gemini, Groq, OpenRouter, etc.).

/**
 * Generates a mock response.
 * @param {string} code - The source code submitted by the frontend.
 * @param {string} instruction - The instruction/prompt (e.g., "Fix Code").
 * @returns {Promise<{fixedCode:string, insights?:string[]}>}
 */
async function generateResponse(code, instruction) {
  console.log('MockProvider received instruction:', instruction);
  console.log('MockProvider received code:', code);

  // Static mock response – matches the previous behavior.
  const fixedCode = "Hello from Backend!\n\nYour frontend is connected successfully.";
  return { fixedCode };
}

module.exports = { generateResponse };
