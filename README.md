# Beers eCommerce

A full-stack craft beers storefront with a secure Express API and a Next.js frontend.

## ✅ What you get
- Landing page (`/`) with hero + stats
- Beers listing page (`/beers`) with cards (style badge, ABV badge, rating stars)
- Secure auth flow with JWT cookies, MFA, CSRF protection, and audit logging
- Profile management and Stripe checkout (`/checkout`)

## 🚀 Run locally
```bash
npm install
cd backend
npm install
npm start
cd ..
npm install
npm run dev
```
Open: http://localhost:3000

## Environment
- Backend: `backend/.env.local` with MongoDB, JWT/MFA secrets, encryption key, hCaptcha secret, Stripe secret, allowed origins
- Frontend: `.env.local` with `NEXT_PUBLIC_API_URL`, hCaptcha site key, and Stripe publishable key

---
If you want, tell me: **(A) Stripe** or **(B) Khalti/eSewa** and I will extend this into a full eCommerce flow.
