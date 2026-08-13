const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

const { handleFixCode } = require('../controllers/aiController');

const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: process.env.RATE_LIMIT_MAX_REQUESTS || 20,
windowMs: process.env.RATE_LIMIT_WINDOW_MS || 3600000,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        error: "Testing limit reached. Please try again later."
    }
});

// POST /fix-code
router.post('/fix-code', aiLimiter, handleFixCode);

module.exports = router;
