const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String },
    action: { type: String, required: true },
    success: { type: Boolean, required: true },
    ip: { type: String },
    userAgent: { type: String },
    details: { type: Object },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
