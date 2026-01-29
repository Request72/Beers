const MS_IN_MINUTE = 60 * 1000;
const MS_IN_HOUR = 60 * MS_IN_MINUTE;

const isProd = process.env.NODE_ENV === 'production';

const baseCookieOptions = {
  httpOnly: true,
  sameSite: 'strict',
  secure: isProd,
  path: '/',
};

// Security note: httpOnly cookies reduce XSS token theft; SameSite helps CSRF.
const accessCookieOptions = {
  ...baseCookieOptions,
  maxAge: 1 * MS_IN_HOUR,
};

// Security note: MFA cookie is short-lived and scoped to verification.
const mfaCookieOptions = {
  ...baseCookieOptions,
  maxAge: 10 * MS_IN_MINUTE,
};

// Security note: CSRF token stored in cookie for double-submit pattern.
const csrfCookieOptions = {
  ...baseCookieOptions,
  maxAge: 2 * MS_IN_HOUR,
};

module.exports = {
  accessCookieOptions,
  mfaCookieOptions,
  csrfCookieOptions,
  baseCookieOptions,
};
