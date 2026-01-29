const mongoose = require('mongoose');

const recoveryCodeSchema = new mongoose.Schema(
  {
    codeHash: { type: String, required: true },
    usedAt: { type: Date },
  },
  { _id: false }
);

const passwordHistorySchema = new mongoose.Schema(
  {
    hash: { type: String, required: true },
    changedAt: { type: Date, required: true },
  },
  { _id: false }
);

const encryptedFieldSchema = new mongoose.Schema(
  {
    iv: { type: String },
    content: { type: String },
    tag: { type: String },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'lawyer', 'admin'],
      default: 'user',
    },
    profile: {
      name: { type: String, trim: true },
      avatarUrl: { type: String, trim: true },
      bio: { type: String, trim: true },
      phoneEncrypted: encryptedFieldSchema,
      addressEncrypted: encryptedFieldSchema,
    },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaPending: {
      type: Boolean,
      default: false,
    },
    mfaSecret: {
      type: String,
    },
    mfaRecoveryCodes: [recoveryCodeSchema],
    passwordHistory: [passwordHistorySchema],
    passwordChangedAt: {
      type: Date,
      default: Date.now,
    },
    passwordExpiresAt: {
      type: Date,
    },
    failedLoginAttempts: {
      type: Number,
      default: 0,
    },
    lockoutUntil: {
      type: Date,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
