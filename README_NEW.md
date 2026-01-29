# 🍻 Beers eCommerce - Nepali Beers

A modern full-stack eCommerce application for browsing and purchasing craft Nepali beers.

## ✨ Features

- Browse 6 premium Nepali beers
- View detailed beer information (ABV, rating, brewery)
- Search beers by name, brewery, or style
- Responsive design with Tailwind CSS
- MongoDB Atlas cloud database (free)
- RESTful API backend with Express
- Next.js 14 frontend with React 18

## 🚀 Quick Start (5 minutes)

### Prerequisites
- Node.js (v18 or higher)
- npm

### Step 1: MongoDB Atlas Setup (FREE, No Installation!)
⚠️ **You need MongoDB Atlas** (cloud database)

1. Visit: https://www.mongodb.com/cloud/atlas
2. Sign up for **FREE** account
3. Create a cluster (Shared tier is free forever)
4. Create database user: username `admin`, password: create one
5. Allow network access from anywhere
6. Copy your connection string

**Detailed guide:** See [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

### Step 2: Configure Backend

```bash
cd backend
```

Edit `backend/.env.local` and replace `your_password_here`:
```
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/beers-ecommerce?retryWrites=true&w=majority
PORT=5005
JWT_SECRET=your_strong_random_secret
MFA_JWT_SECRET=your_strong_random_secret
ALLOWED_ORIGINS=http://localhost:3000
ACCESS_TOKEN_TTL=1h
MFA_TOKEN_TTL=10m
ENCRYPTION_KEY=32_byte_hex_key
HCAPTCHA_SECRET=your_hcaptcha_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

### Step 3: Install & Seed Database

```bash
# Still in backend directory
npm install
npm run seed
```

### Step 4: Start the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Visit: http://localhost:3000 🎉

### Frontend Environment

Create `.env.local` in the repo root:
```
NEXT_PUBLIC_API_URL=http://localhost:5005
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 📁 Project Structure

```
beers-ecommerce/
├── backend/
│   ├── models/Beer.js
│   ├── index.js
│   ├── seed.js
│   ├── .env.local
│   └── package.json
├── src/
│   ├── app/
│   │   ├── beers/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── page.tsx
│   └── components/
├── .env.local
├── MONGODB_ATLAS_SETUP.md
└── package.json
```

## 🍻 Nepali Beers

1. Everest Premium Lager
2. Gorkha Gold
3. Kathmandu Dark
4. Pokhara Ale
5. Sherpa's Peak IPA
6. Pashupatinath Special

## 📊 API Endpoints

- `GET /api/beers` - Get all beers
- `GET /api/beers/:id` - Get a specific beer
- `POST /api/auth/register` - Create an account
- `POST /api/auth/login` - Login
- `POST /api/auth/mfa/verify` - Verify MFA
- `GET /api/auth/me` - Current user
- `POST /api/auth/password` - Change password
- `GET /api/admin/audit-logs` - Admin-only audit logs
- `GET /api/users/me` - Current user profile
- `PUT /api/users/me` - Update profile
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/orders/checkout` - Create order + Stripe payment intent
- `POST /api/orders/confirm` - Confirm payment intent status
- `GET /api/orders/me` - Current user orders

## ❓ Troubleshooting

**"MONGODB_URI is not set"**
- Edit `backend/.env.local`
- Replace `your_password_here` with your actual MongoDB password
- Make sure file is named `.env.local` (not `.env`)

**"Connection refused"**
- Check connection string in `.env.local`
- Make sure Network Access includes "Allow Access from Anywhere"
- Read [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)

**Database is empty**
```bash
cd backend
npm run seed
```

## 🧪 Security Tests

Run the backend security suite:
```bash
cd backend
npm test
```

## 📝 Commands

```bash
# Backend
cd backend
npm start          # Start server
npm run seed       # Seed database

# Frontend
npm run dev        # Start dev server
npm run build      # Build production
```

## 🔧 Tech Stack

- **Frontend:** Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Database:** MongoDB Atlas (Cloud, Free)

---

**Full setup guide:** [MONGODB_ATLAS_SETUP.md](MONGODB_ATLAS_SETUP.md)
