// Security summary (student note): this middleware verifies JWT cookies, enforces RBAC,
// and blocks IDOR by checking user ownership.
const User = require('../models/User');
const { verifyAccessToken } = require('../utils/jwt');
const { logAudit } = require('../utils/audit');

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.access_token;
    if (!token) {
      // Security note: missing token means unauthenticated access.
      await logAudit({
        req,
        action: 'AUTH_MISSING',
        success: false,
        details: { reason: 'No access token' },
      });
      return res.status(401).json({ error: 'Authentication required' });
    }

    const payload = verifyAccessToken(token);
    // Security note: token validation ensures signature and expiry checks.
    const user = await User.findById(payload.userId);
    if (!user) {
      await logAudit({
        req,
        action: 'AUTH_INVALID',
        success: false,
        details: { reason: 'User not found' },
      });
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = {
      id: user._id.toString(),
      role: user.role,
      email: user.email,
    };
    next();
  } catch (error) {
    await logAudit({
      req,
      action: 'AUTH_INVALID',
      success: false,
      details: { reason: error.message },
    });
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(role) {
  return async (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      // Security note: RBAC blocks non-admin access.
      await logAudit({
        req,
        userId: req.user?.id,
        role: req.user?.role,
        action: 'ACCESS_DENIED',
        success: false,
        details: { requiredRole: role },
      });
      return res.status(403).json({ error: 'Access denied' });
    }
    return next();
  };
}

function requireSelfOrRole(role) {
  return async (req, res, next) => {
    const targetId = req.params.id;
    if (req.user?.id !== targetId && req.user?.role !== role) {
      // Security note: IDOR prevention checks ownership or admin role.
      await logAudit({
        req,
        userId: req.user?.id,
        role: req.user?.role,
        action: 'IDOR_BLOCKED',
        success: false,
        details: { targetId },
      });
      return res.status(403).json({ error: 'Access denied' });
    }
    return next();
  };
}

module.exports = { requireAuth, requireRole, requireSelfOrRole };
