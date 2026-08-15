const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const { handleFixCode } = require('../controllers/aiController');

function getPositiveNumber(value, fallback, maximum = Number.MAX_SAFE_INTEGER) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 && parsed <= maximum ? parsed : fallback;
}

const aiLimiter = rateLimit({
  windowMs: getPositiveNumber(process.env.RATE_LIMIT_WINDOW_MS, 60 * 60 * 1000, 2147483647),
  max: getPositiveNumber(process.env.RATE_LIMIT_MAX_REQUESTS, 20),
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Testing limit reached. Please try again later.'
  }
});

router.post('/fix-code', aiLimiter, handleFixCode);

module.exports = router;
