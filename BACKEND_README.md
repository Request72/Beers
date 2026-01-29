# Beers eCommerce - Full Stack

A modern full-stack eCommerce application for browsing and purchasing craft beers.

## Project Structure

```
beers-ecommerce/
├── frontend/           # Next.js React app
├── backend/           # Express.js API server
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

#### Backend
```bash
cd backend
npm install
```

#### Frontend
```bash
npm install
```

### Running the Application

You need to run both the backend and frontend servers. Open two terminal windows:

#### Terminal 1 - Backend Server
```bash
cd backend
npm start
# Server runs on http://localhost:5005
```

#### Terminal 2 - Frontend Server
```bash
npm run dev
# Frontend runs on http://localhost:3000
```

Visit `http://localhost:3000` in your browser to view the application.

## API Endpoints

### Backend API (Running on port 5005)
- `GET /api/beers` - Get all beers
- `GET /api/beers/:id` - Get a specific beer by ID
- `POST /api/auth/register` - Create an account
- `POST /api/auth/login` - Login (rate limited)
- `POST /api/auth/mfa/verify` - Verify MFA code (rate limited)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/password` - Change password
- `POST /api/auth/mfa/setup` - Begin MFA setup
- `POST /api/auth/mfa/verify-setup` - Confirm MFA setup
- `POST /api/auth/mfa/disable` - Disable MFA
- `POST /api/auth/logout` - Logout
- `GET /api/admin/audit-logs` - Admin-only audit logs
- `GET /api/users/me` - Current user profile
- `PUT /api/users/me` - Update profile
- `POST /api/payments/create-intent` - Create Stripe payment intent
- `POST /api/orders/checkout` - Create order + Stripe payment intent
- `POST /api/orders/confirm` - Confirm payment intent status
- `GET /api/orders/me` - Current user orders

## Environment Configuration

### Backend (.env.local)
```
PORT=5005
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_strong_random_secret
MFA_JWT_SECRET=your_strong_random_secret
ALLOWED_ORIGINS=http://localhost:3000
ACCESS_TOKEN_TTL=1h
MFA_TOKEN_TTL=10m
ENCRYPTION_KEY=32_byte_hex_key
HCAPTCHA_SECRET=your_hcaptcha_secret
STRIPE_SECRET_KEY=your_stripe_secret
```
The backend loads `backend/.env.local` when present; otherwise it falls back to `backend/.env`.

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5005
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## Features

- Browse catalog of craft beers
- View beer details (style, ABV, rating, price)
- Responsive design with Tailwind CSS
- Real API calls to backend server

## Technologies

### Frontend
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS

### Backend
- Express.js
- Node.js
- CORS enabled for frontend communication

## Development

The application fetches real data from the backend API instead of using mock data. All beer data is managed and served by the backend server.

To modify beer data, edit `/backend/data.js`.

## Security Tests

Run the security suite from the backend folder (requires MongoDB env vars):
```bash
cd backend
npm test
```
Use `MONGODB_URI_TEST` to point tests at a dedicated test database.
Set `HCAPTCHA_BYPASS=true` for automated tests if you do not want to call hCaptcha.
