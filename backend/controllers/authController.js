// Security summary (student note): this controller handles password hashing, MFA setup/verification,
// account lockout, token cookies, and audit logging for auth-related actions.
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');
const User = require('../models/User');
const { signAccessToken, signMfaToken, verifyMfaToken } = require('../utils/jwt');
const {
  accessCookieOptions,
  mfaCookieOptions,
  csrfCookieOptions,
  baseCookieOptions,
} = require('../utils/cookies');
const {
  passwordMeetsComplexity,
  passwordExpiryDate,
  PASSWORD_HISTORY_LIMIT,
} = require('../utils/passwordPolicy');
const { logAudit } = require('../utils/audit');

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    mfaEnabled: user.mfaEnabled,
    passwordExpiresAt: user.passwordExpiresAt,
  };
}

function generateRecoveryCodes(count = 10) {
  return Array.from({ length: count }).map(() =>
    crypto.randomBytes(5).toString('hex').toUpperCase()
  );
}

async function issueCsrfToken(req, res) {
  const token = crypto.randomBytes(32).toString('hex');
  res.cookie('_csrf_token', token, csrfCookieOptions);
  return res.json({ csrfToken: token });
}

async function register(req, res) {
  const { email, password } = req.body;

  const complexity = passwordMeetsComplexity(password);
  if (!complexity.valid) {
    // Security note: enforce strong passwords to reduce brute-force and reuse risk.
    return res.status(400).json({ error: 'Password does not meet requirements', details: complexity.errors });
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(409).json({ error: 'Email already registered' });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  // Security note: bcrypt hashing protects passwords at rest.
  const now = new Date();
  const user = await User.create({
    email,
    passwordHash,
    passwordHistory: [{ hash: passwordHash, changedAt: now }],
    passwordChangedAt: now,
    passwordExpiresAt: passwordExpiryDate(now),
  });

  await logAudit({
    req,
    userId: user._id,
    role: user.role,
    action: 'REGISTER',
    success: true,
  });

  return res.status(201).json({ user: sanitizeUser(user) });
}

async function login(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    await logAudit({
      req,
      action: 'LOGIN_FAILED',
      success: false,
      details: { reason: 'User not found' },
    });
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.lockoutUntil && user.lockoutUntil > new Date()) {
    // Security note: account lockout throttles brute-force attempts.
    const retryAfterSeconds = Math.ceil((user.lockoutUntil.getTime() - Date.now()) / 1000);
    res.set('Retry-After', retryAfterSeconds.toString());
    await logAudit({
      req,
      userId: user._id,
      role: user.role,
      action: 'ACCOUNT_LOCKED',
      success: false,
      details: { retryAfterSeconds },
    });
    return res.status(423).json({ error: 'Account locked. Try again later.' });
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);
  if (!passwordMatches) {
    // Security note: track failed logins to lock the account after repeated attempts.
    user.failedLoginAttempts += 1;
    if (user.failedLoginAttempts >= 5) {
      user.lockoutUntil = new Date(Date.now() + 30 * 60 * 1000);
      user.failedLoginAttempts = 0;
    }
    await user.save();

    await logAudit({
      req,
      userId: user._id,
      role: user.role,
      action: 'LOGIN_FAILED',
      success: false,
      details: { reason: 'Invalid password' },
    });

    return res.status(401).json({ error: 'Invalid credentials' });
  }

  if (user.passwordExpiresAt && user.passwordExpiresAt < new Date()) {
    // Security note: force password rotation when expired.
    await logAudit({
      req,
      userId: user._id,
      role: user.role,
      action: 'PASSWORD_EXPIRED',
      success: false,
    });
    return res.status(403).json({ error: 'Password expired', code: 'PASSWORD_EXPIRED' });
  }

  user.failedLoginAttempts = 0;
  user.lockoutUntil = null;
  user.lastLoginAt = new Date();
  await user.save();

  if (user.mfaEnabled) {
    // Security note: require MFA if enabled, issue short-lived MFA token.
    const mfaToken = signMfaToken(user);
    res.cookie('mfa_token', mfaToken, mfaCookieOptions);
    await logAudit({
      req,
      userId: user._id,
      role: user.role,
      action: 'MFA_REQUIRED',
      success: true,
    });
    return res.json({ mfaRequired: true });
  }

  const accessToken = signAccessToken(user);
  // Security note: access token stored in httpOnly cookie to reduce XSS risk.
  res.cookie('access_token', accessToken, accessCookieOptions);

  await logAudit({
    req,
    userId: user._id,
    role: user.role,
    action: 'LOGIN_SUCCESS',
    success: true,
  });

  return res.json({ user: sanitizeUser(user) });
}

async function verifyMfa(req, res) {
  const { code } = req.body;
  const mfaToken = req.cookies?.mfa_token;

  if (!mfaToken) {
    return res.status(401).json({ error: 'MFA token missing' });
  }

  let payload;
  try {
    payload = verifyMfaToken(mfaToken);
  } catch (error) {
    return res.status(401).json({ error: 'Invalid MFA token' });
  }

  const user = await User.findById(payload.userId);
  if (!user || !user.mfaEnabled) {
    return res.status(401).json({ error: 'MFA not enabled' });
  }

  const verifiedTotp = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });
  // Security note: allow recovery codes as one-time backup.

  let recoveryUsed = false;
  if (!verifiedTotp) {
    for (const entry of user.mfaRecoveryCodes) {
      if (entry.usedAt) continue;
      const matches = await bcrypt.compare(code, entry.codeHash);
      if (matches) {
        entry.usedAt = new Date();
        recoveryUsed = true;
        break;
      }
    }
  }

  if (!verifiedTotp && !recoveryUsed) {
    // Security note: log MFA failures for monitoring.
    await logAudit({
      req,
      userId: user._id,
      role: user.role,
      action: 'MFA_FAILED',
      success: false,
    });
    return res.status(401).json({ error: 'Invalid MFA code' });
  }

  await user.save();

  const accessToken = signAccessToken(user);
  res.cookie('access_token', accessToken, accessCookieOptions);
  // Security note: clear MFA token after successful verification.
  res.clearCookie('mfa_token', baseCookieOptions);

  await logAudit({
    req,
    userId: user._id,
    role: user.role,
    action: 'MFA_SUCCESS',
    success: true,
    details: { recoveryUsed },
  });

  return res.json({ user: sanitizeUser(user) });
}

async function logout(req, res) {
  res.clearCookie('access_token', baseCookieOptions);
  res.clearCookie('mfa_token', baseCookieOptions);
  await logAudit({
    req,
    userId: req.user?.id,
    role: req.user?.role,
    action: 'LOGOUT',
    success: true,
  });
  return res.json({ success: true });
}

async function me(req, res) {
  const user = await User.findById(req.user.id);
  return res.json({ user: sanitizeUser(user) });
}

async function changePassword(req, res) {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user.id);

  const matches = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!matches) {
    // Security note: verify current password before allowing change.
    return res.status(401).json({ error: 'Invalid current password' });
  }

  const complexity = passwordMeetsComplexity(newPassword);
  if (!complexity.valid) {
    return res.status(400).json({ error: 'Password does not meet requirements', details: complexity.errors });
  }

  const recentHistory = (user.passwordHistory || []).slice(-PASSWORD_HISTORY_LIMIT);
  for (const entry of recentHistory) {
    const reused = await bcrypt.compare(newPassword, entry.hash);
    if (reused) {
      // Security note: prevent reuse of recent passwords.
      return res.status(400).json({ error: 'Cannot reuse recent passwords' });
    }
  }

  const newHash = await bcrypt.hash(newPassword, 10);
  user.passwordHash = newHash;
  user.passwordHistory.push({ hash: newHash, changedAt: new Date() });
  user.passwordHistory = user.passwordHistory.slice(-PASSWORD_HISTORY_LIMIT);
  user.passwordChangedAt = new Date();
  user.passwordExpiresAt = passwordExpiryDate();
  // Security note: reset expiry when password changes.
  await user.save();

  await logAudit({
    req,
    userId: user._id,
    role: user.role,
    action: 'PASSWORD_CHANGED',
    success: true,
  });

  return res.json({ success: true });
}

async function setupMfa(req, res) {
  const user = await User.findById(req.user.id);
  if (user.mfaEnabled) {
    return res.status(400).json({ error: 'MFA already enabled' });
  }

  const secret = speakeasy.generateSecret({ name: 'Beers Ecommerce' });
  const recoveryCodes = generateRecoveryCodes(10);
  const recoveryHashes = await Promise.all(recoveryCodes.map((code) => bcrypt.hash(code, 10)));

  user.mfaSecret = secret.base32;
  user.mfaPending = true;
  user.mfaRecoveryCodes = recoveryHashes.map((hash) => ({ codeHash: hash }));
  await user.save();

  const qrCodeDataUrl = await qrcode.toDataURL(secret.otpauth_url);

  await logAudit({
    req,
    userId: user._id,
    role: user.role,
    action: 'MFA_SETUP',
    success: true,
  });

  return res.json({
    qrCodeDataUrl,
    recoveryCodes,
  });
}

async function verifyMfaSetup(req, res) {
  const { code } = req.body;
  const user = await User.findById(req.user.id);

  if (!user.mfaPending || !user.mfaSecret) {
    return res.status(400).json({ error: 'MFA setup not initiated' });
  }

  const verified = speakeasy.totp.verify({
    secret: user.mfaSecret,
    encoding: 'base32',
    token: code,
    window: 1,
  });

  if (!verified) {
    await logAudit({
      req,
      userId: user._id,
      role: user.role,
      action: 'MFA_SETUP_FAILED',
      success: false,
    });
    return res.status(400).json({ error: 'Invalid MFA code' });
  }

  user.mfaEnabled = true;
  user.mfaPending = false;
  await user.save();

  await logAudit({
    req,
    userId: user._id,
    role: user.role,
    action: 'MFA_ENABLED',
    success: true,
  });

  return res.json({ success: true });
}

async function disableMfa(req, res) {
  const { password } = req.body;
  const user = await User.findById(req.user.id);

  const matches = await bcrypt.compare(password, user.passwordHash);
  if (!matches) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  user.mfaEnabled = false;
  user.mfaPending = false;
  user.mfaSecret = null;
  user.mfaRecoveryCodes = [];
  await user.save();

  await logAudit({
    req,
    userId: user._id,
    role: user.role,
    action: 'MFA_DISABLED',
    success: true,
  });

  return res.json({ success: true });
}

async function getUserById(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ user: sanitizeUser(user) });
}

module.exports = {
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
};
