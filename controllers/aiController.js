const { generateResponse } = require('../providerManager');

async function fixCode(code, instruction) {
  return generateResponse(code, instruction);
}

async function handleFixCode(req, res) {
  try {
    const { code, instruction } = req.body || {};
    const result = await fixCode(code, instruction);
    res.json(result);
  } catch (error) {
    console.error('Code-fix request failed:', error.message);
    res.status(502).json({
      error: 'The AI provider could not process this request.'
    });
  }
}

module.exports = { fixCode, handleFixCode };
