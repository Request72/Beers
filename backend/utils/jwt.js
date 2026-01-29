const jwt = require('jsonwebtoken');

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || '1h';
const MFA_TOKEN_TTL = process.env.MFA_TOKEN_TTL || '10m';

function signAccessToken(user) {
  // Security note: access token includes user id and role, with short expiry.
  return jwt.sign(
    { userId: user._id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_TTL }
  );
}

function signMfaToken(user) {
  // Security note: MFA token is short-lived and scoped to MFA verification only.
  return jwt.sign(
    { userId: user._id.toString(), mfa: true },
    process.env.MFA_JWT_SECRET,
    { expiresIn: MFA_TOKEN_TTL }
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

function verifyMfaToken(token) {
  return jwt.verify(token, process.env.MFA_JWT_SECRET);
}

module.exports = {
  signAccessToken,
  signMfaToken,
  verifyAccessToken,
  verifyMfaToken,
  ACCESS_TOKEN_TTL,
  MFA_TOKEN_TTL,
};
