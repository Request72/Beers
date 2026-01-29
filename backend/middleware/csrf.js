// Security summary (student note): this middleware enforces the double-submit CSRF token pattern
// on state-changing requests and logs failures for auditing.
const { logAudit } = require('../utils/audit');

const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS']);

function csrfProtection({ ignoredPaths = [] } = {}) {
  return async (req, res, next) => {
    if (SAFE_METHODS.has(req.method)) {
      return next();
    }

    if (ignoredPaths.some((path) => req.path.startsWith(path))) {
      return next();
    }

    const csrfCookie = req.cookies?._csrf_token;
    const csrfHeader = req.get('x-csrf-token');

    if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
      // Security note: double-submit check blocks cross-site request forgery.
      await logAudit({
        req,
        userId: req.user?.id,
        role: req.user?.role,
        action: 'CSRF_FAILED',
        success: false,
        details: { path: req.path },
      });
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    return next();
  };
}

module.exports = { csrfProtection };
