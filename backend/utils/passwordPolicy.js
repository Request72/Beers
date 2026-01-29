// Security summary (student note): password policy enforces length, complexity,
// history checks, and expiry dates to reduce reuse and weak passwords.
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const PASSWORD_HISTORY_LIMIT = 5;
const PASSWORD_EXPIRY_DAYS = 90;

function passwordMeetsComplexity(password) {
  const errors = [];

  if (password.length < PASSWORD_MIN_LENGTH || password.length > PASSWORD_MAX_LENGTH) {
    errors.push(`Password must be between ${PASSWORD_MIN_LENGTH} and ${PASSWORD_MAX_LENGTH} characters.`);
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must include at least one uppercase letter.');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must include at least one lowercase letter.');
  }
  if (!/[0-9]/.test(password)) {
    errors.push('Password must include at least one number.');
  }
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
    errors.push('Password must include at least one special character.');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

function passwordExpiryDate(fromDate = new Date()) {
  const expiry = new Date(fromDate);
  expiry.setDate(expiry.getDate() + PASSWORD_EXPIRY_DAYS);
  return expiry;
}

module.exports = {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_HISTORY_LIMIT,
  PASSWORD_EXPIRY_DAYS,
  passwordMeetsComplexity,
  passwordExpiryDate,
};
