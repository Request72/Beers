const AuditLog = require('../models/AuditLog');

async function logAudit({
  req,
  userId,
  role,
  action,
  success,
  details,
}) {
  try {
    await AuditLog.create({
      userId,
      role,
      action,
      success,
      details,
      ip: req?.ip,
      userAgent: req?.get?.('user-agent'),
    });
  } catch (error) {
    // Avoid breaking request flow on logging failures
    console.error('Audit log error:', error.message);
  }
}

module.exports = { logAudit };
