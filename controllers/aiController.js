// services/aiService.js
// This service acts as a thin wrapper around the provider manager.
// It receives the raw request data and forwards it to the currently selected AI provider.

const { generateResponse } = require('./providers/providerManager');

/**
 * Calls the provider manager to obtain a fixed code response.
 * @param {string} code - The source code from the frontend.
 * @param {string} instruction - The user instruction (e.g., "Fix Code").
 * @returns {Promise<{fixedCode:string, insights?:string[]}>}
 */
async function fixCode(code, instruction) {
  // The provider manager abstracts away which AI service is used.
  // At the moment it delegates to the MockProvider.
  return await generateResponse(code, instruction);
}

module.exports = { fixCode };
