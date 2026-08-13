// services/providers/providerManager.js
// -------------------------------------------------
// Provider Manager
// -------------------------------------------------
// This module selects the appropriate AI provider based on the
// `AI_PROVIDER` environment variable (loaded from the .env file).
// It exports a single async function `generateResponse(code, instruction)`
// that simply forwards the request to the chosen provider and returns
// the provider's response unchanged.

// Load environment variables (including AI_PROVIDER) from .env.txt at the project root.
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env.txt') });

// Built‑in fallback provider – always present.
const MockProvider = require('./MockProvider');

// Conditional import of the Gemini provider. It may not exist yet, so we wrap it
// in a try/catch to avoid crashing the server during development.
let GeminiProvider;
try {
  GeminiProvider = require('./GeminiProvider');
} catch (e) {
  // If the GeminiProvider file is missing, we simply ignore the error and fall back
  // to the MockProvider. This makes the manager resilient while the Gemini integration
  // is being added.
}

/**
 * Determine which provider should be used.
 * Returns the provider module that implements `generateResponse`.
 */
function getActiveProvider() {
  const requested = (process.env.AI_PROVIDER || '').trim().toLowerCase();
  if (requested === 'gemini' && GeminiProvider) {
    return GeminiProvider; // Use Gemini when explicitly requested and available.
  }
  // Default fallback – always safe because MockProvider is guaranteed to exist.
  return MockProvider;
}

/**
 * Exported function used by the service layer.
 * Delegates to the active provider and returns its response unchanged.
 *
 * @param {string} code - The source code submitted by the frontend.
 * @param {string} instruction - The user instruction (e.g., "Fix Code").
 * @returns {Promise<any>} The raw response from the selected AI provider.
 */
async function generateResponse(code, instruction) {
  const provider = getActiveProvider();
  if (!provider || typeof provider.generateResponse !== 'function') {
    throw new Error('Selected AI provider does not implement generateResponse');
  }
  // Forward the request to the provider. The provider itself is responsible for
  // formatting the response (e.g., the mock returns `{ fixedCode }` while the
  // Gemini provider will return the detailed JSON shape described in the spec).
  return await provider.generateResponse(code, instruction);
}

module.exports = { generateResponse };
