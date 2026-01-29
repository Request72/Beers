// Security summary (student note): rate limits reduce brute-force attempts on login and MFA.
const rateLimit = require('express-rate-limit');
const { ipKeyGenerator } = require('./rateLimitUtils');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  // Security note: limit login attempts per IP to slow brute-force.
  message: 'Too many login attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
});

const mfaLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  // Security note: limit MFA verification attempts per IP.
  message: 'Too many MFA attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: ipKeyGenerator,
});

module.exports = {
  loginLimiter,
  mfaLimiter,
};
