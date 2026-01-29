// Security summary (student note): sanitize user input to reduce XSS payloads
// while leaving password fields untouched for correct hashing.
const xss = require('xss');

const SENSITIVE_KEYS = new Set(['password', 'currentPassword', 'newPassword', 'code']);

function sanitizeValue(value, key) {
  if (typeof value === 'string') {
    if (key && SENSITIVE_KEYS.has(key)) {
      return value;
    }
    return xss(value, {
      whiteList: {},
      stripIgnoreTag: true,
      stripIgnoreTagBody: ['script'],
    });
  }
  if (Array.isArray(value)) {
    return value.map((entry) => sanitizeValue(entry));
  }
  if (value && typeof value === 'object') {
    return Object.keys(value).reduce((acc, key) => {
      acc[key] = sanitizeValue(value[key], key);
      return acc;
    }, {});
  }
  return value;
}

function sanitizeRequest(req, res, next) {
  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  next();
}

module.exports = { sanitizeRequest };
