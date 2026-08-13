// providerManager.js
// -------------------------------------------------
// SOLVIX Provider Manager
// -------------------------------------------------

const MockProvider = require('./MockProvider');

let GeminiProvider;

try {
  GeminiProvider = require('./GeminiProvider');
} catch (error) {
  console.warn('GeminiProvider could not be loaded:', error.message);
}

function getActiveProvider() {
  const requested = (process.env.AI_PROVIDER || '').trim().toLowerCase();

  if (requested === 'gemini' && GeminiProvider) {
    return GeminiProvider;
  }

  return MockProvider;
}

async function generateResponse(code, instruction) {
  const provider = getActiveProvider();

  if (!provider || typeof provider.generateResponse !== 'function') {
    throw new Error(
      'Selected AI provider does not implement generateResponse'
    );
  }

  return await provider.generateResponse(code, instruction);
}

module.exports = {
  generateResponse
};
