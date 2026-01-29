// Security summary (student note): this server enforces secure cookies, CSRF checks, rate limits, and strict CORS.
// It also requires secrets and encryption keys from env so nothing sensitive is hardcoded.
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

const envLocalPath = path.join(__dirname, '.env.local');
const envPath = path.join(__dirname, '.env');
dotenv.config({ path: fs.existsSync(envLocalPath) ? envLocalPath : envPath });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { securityHeaders } = require('./utils/securityHeaders');
const { sanitizeRequest } = require('./middleware/sanitize');
const { csrfProtection } = require('./middleware/csrf');
const beersRoutes = require('./routes/beers');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const usersRoutes = require('./routes/users');
const paymentsRoutes = require('./routes/payments');
const ordersRoutes = require('./routes/orders');

const app = express();
const PORT = process.env.PORT || 5005;
const MONGODB_URI = process.env.MONGODB_URI;
const JWT_SECRET = process.env.JWT_SECRET;
const MFA_JWT_SECRET = process.env.MFA_JWT_SECRET;
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Middleware
app.set('trust proxy', 1);
app.use(securityHeaders());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(sanitizeRequest);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (ALLOWED_ORIGINS.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);

app.use(
  csrfProtection({
    ignoredPaths: ['/api/auth/login', '/api/auth/register', '/api/auth/mfa/verify', '/api/auth/csrf'],
  })
);

async function startServer() {
  if (!MONGODB_URI) {
    console.error('❌ ERROR: MONGODB_URI is not set in .env.local');
    console.error('Please follow these steps:');
    console.error('1. Read MONGODB_ATLAS_SETUP.md for MongoDB Atlas setup (FREE, no installation needed)');
    console.error('2. Update backend/.env.local with your MongoDB Atlas connection string');
    console.error('3. Run: npm run seed');
    process.exit(1);
  }

  if (!JWT_SECRET || !MFA_JWT_SECRET) {
    console.error('❌ ERROR: JWT_SECRET or MFA_JWT_SECRET is not set in .env.local');
    console.error('Please set secure random secrets for authentication.');
    process.exit(1);
  }

  if (ALLOWED_ORIGINS.length === 0) {
    console.error('❌ ERROR: ALLOWED_ORIGINS is not set in .env.local');
    console.error('Please set ALLOWED_ORIGINS (comma-separated) for CORS.');
    process.exit(1);
  }

  if (!process.env.ENCRYPTION_KEY) {
    console.error('❌ ERROR: ENCRYPTION_KEY is not set in .env.local');
    process.exit(1);
  }
  if (process.env.ENCRYPTION_KEY && process.env.ENCRYPTION_KEY.length !== 64) {
    console.error('❌ ERROR: ENCRYPTION_KEY must be 32 bytes hex (64 characters)');
    process.exit(1);
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('❌ ERROR: STRIPE_SECRET_KEY is not set in .env.local');
    process.exit(1);
  }

  // MongoDB Connection
  mongoose.connect(MONGODB_URI)
    .then(() => {
      console.log('✅ Connected to MongoDB');
    })
    .catch((err) => {
      console.error('❌ MongoDB connection error:', err.message);
      console.error('\nTroubleshooting:');
      console.error('1. Check MONGODB_URI in backend/.env.local');
      console.error('2. Replace "your_password_here" with your actual password');
      console.error('3. Make sure Network Access includes "Allow Access from Anywhere"');
      console.error('4. Read MONGODB_ATLAS_SETUP.md for detailed instructions');
      process.exit(1);
    });

  app.listen(PORT, () => {
    console.log(`\n🍻 Backend server running on http://localhost:${PORT}`);
    console.log(`\nTo seed initial data, run: npm run seed\n`);
  });
}

// Routes
app.use('/api/beers', beersRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/orders', ordersRoutes);

app.get('/api/health', (req, res) => {
  res.json({ ok: true });
});

app.use((err, req, res, next) => {
  if (err && err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'CORS blocked' });
  }
  if (err && err.name === 'MulterError') {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Something went wrong' });
});

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
