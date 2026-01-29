# Video Demonstration Script (Security Features)

## 1) Intro
- Show app home page and mention secure auth, MFA, RBAC, CSRF, rate limits, audit logs.

## 2) Registration + Password Policy
- Register with weak password (fails).
- Register with strong password (succeeds).

## 3) CAPTCHA
- Show hCaptcha on registration/login.

## 4) Login + MFA
- Login user with MFA enabled (show MFA prompt).
- Verify TOTP code.

## 5) Account Lockout + Rate Limiting
- Attempt 5 failed logins -> show 423 lockout or 429 rate limit.

## 6) Profile Encryption
- Update phone/address in profile.
- Mention encrypted storage in DB.

## 7) RBAC + IDOR
- Attempt admin audit logs as non-admin (403).

## 8) CSRF Protection
- Attempt POST without CSRF token -> 403 (show in dev tools/console).

## 9) Stripe Payments
- Create payment intent and show Stripe test card flow.

## 10) Audit Logs
- Show admin audit log list.

## Closing
- Summarize security controls and remediation notes.
