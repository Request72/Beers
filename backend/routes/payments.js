const express = require('express');
const { z } = require('zod');
const { createPaymentIntent } = require('../controllers/paymentsController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

const paymentSchema = z.object({
  amount: z.number().int().min(50),
  currency: z.string().min(3).max(3).optional(),
});

router.post('/create-intent', requireAuth, validate(paymentSchema), createPaymentIntent);

module.exports = router;
