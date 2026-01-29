const AuditLog = require('../models/AuditLog');

async function getAuditLogs(req, res) {
  const logs = await AuditLog.find().sort({ createdAt: -1 }).limit(200);
  return res.json({ logs });
}

module.exports = { getAuditLogs };
