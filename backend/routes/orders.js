const express = require('express');
const { z } = require('zod');
const { createCheckout, confirmOrder, getMyOrders } = require('../controllers/ordersController');
const { requireAuth } = require('../middleware/auth');
const { validate } = require('../middleware/validate');

const router = express.Router();

const checkoutSchema = z.object({
  items: z.array(
    z.object({
      beerId: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    })
  ),
  currency: z.string().min(3).max(3).optional(),
});

const confirmSchema = z.object({
  orderId: z.string().min(1),
  paymentIntentId: z.string().optional(),
});

router.post('/checkout', requireAuth, validate(checkoutSchema), createCheckout);
router.post('/confirm', requireAuth, validate(confirmSchema), confirmOrder);
router.get('/me', requireAuth, getMyOrders);

module.exports = router;
