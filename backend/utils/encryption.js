// Security summary (student note): encrypt sensitive profile fields with AES-256-GCM
// so data is protected at rest even if the database is exposed.
const crypto = require('crypto');

const ALGO = 'aes-256-gcm';

function getKey() {
  const rawKey = process.env.ENCRYPTION_KEY;
  if (!rawKey) {
    throw new Error('ENCRYPTION_KEY is not set');
  }
  const key = Buffer.from(rawKey, 'hex');
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes hex');
  }
  return key;
}

function encryptValue(value) {
  if (!value) return null;
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(String(value), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
    tag: tag.toString('hex'),
  };
}

function decryptValue(payload) {
  if (!payload || !payload.iv || !payload.content || !payload.tag) {
    return null;
  }
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(payload.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(payload.tag, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(payload.content, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

module.exports = { encryptValue, decryptValue };
