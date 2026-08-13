// controllers/aiController.js
// Controller for AI related endpoints

const { fixCode } = require('../services/aiService');

/**
 * Handles POST /fix-code
 * Expects JSON body with { code, instruction }
 */
async function handleFixCode(req, res) {
  try {
    const { code, instruction } = req.body;
    const result = await fixCode(code, instruction);
    res.json({ fixedCode: result.fixedCode, insights: result.insights });
  } catch (err) {
    console.error('Error in handleFixCode:', err);
    res.status(502).json({
      error: 'The AI provider could not process this request.',
      message: err instanceof Error ? err.message : String(err),
    });
  }
}

module.exports = { handleFixCode };
