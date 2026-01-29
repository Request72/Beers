const express = require('express');
const { z } = require('zod');
const {
  issueCsrfToken,
  register,
  login,
  verifyMfa,
  logout,
  me,
  changePassword,
  setupMfa,
  verifyMfaSetup,
  disableMfa,
  getUserById,
} = require('../controllers/authController');
const { requireAuth, requireSelfOrRole } = require('../middleware/auth');
const { validate } = require('../middleware/validate');
const { loginLimiter, mfaLimiter } = require('../middleware/rateLimit');

const router = express.Router();

const emailSchema = z.string().email();
const passwordSchema = z.string().min(8).max(128);

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

const mfaVerifySchema = z.object({
  code: z.string().min(6).max(32),
});

const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
});

const mfaDisableSchema = z.object({
  password: z.string().min(1),
});

router.get('/csrf', issueCsrfToken);
router.post('/register', loginLimiter, validate(registerSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/mfa/verify', mfaLimiter, validate(mfaVerifySchema), verifyMfa);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, me);
router.post('/password', requireAuth, validate(passwordChangeSchema), changePassword);
router.post('/mfa/setup', requireAuth, setupMfa);
router.post('/mfa/verify-setup', requireAuth, validate(mfaVerifySchema), verifyMfaSetup);
router.post('/mfa/disable', requireAuth, validate(mfaDisableSchema), disableMfa);

router.get('/users/:id', requireAuth, requireSelfOrRole('admin'), getUserById);

module.exports = router;
