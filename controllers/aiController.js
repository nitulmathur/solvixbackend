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
    const status = Number(error.status || error.statusCode);
    const responseStatus = status >= 400 && status <= 599 ? status : 502;

    console.error('Code-fix request failed:', {
      message: error.message,
      status: responseStatus,
      code: error.code
    });
    res.status(responseStatus).json({
      error: 'The AI provider could not process this request.'
    });
  }
}

module.exports = { fixCode, handleFixCode };
