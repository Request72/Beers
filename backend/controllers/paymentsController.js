const Stripe = require('stripe');
const { logAudit } = require('../utils/audit');

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

async function createPaymentIntent(req, res) {
  const { amount, currency } = req.body;
  if (!amount || amount < 50) {
    return res.status(400).json({ error: 'Amount must be at least 50 cents' });
  }

  if (process.env.NODE_ENV === 'production') {
    const proto = req.get('x-forwarded-proto');
    if (proto !== 'https') {
      return res.status(400).json({ error: 'HTTPS required' });
    }
  }

  try {
    const stripe = getStripeClient();

    const intent = await stripe.paymentIntents.create({
      amount,
      currency: currency || 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { userId: req.user.id },
    });

    await logAudit({
      req,
      userId: req.user.id,
      role: req.user.role,
      action: 'PAYMENT_INTENT_CREATED',
      success: true,
      details: { amount, currency: currency || 'usd', intentId: intent.id },
    });

    return res.json({ clientSecret: intent.client_secret });
  } catch (error) {
    await logAudit({
      req,
      userId: req.user.id,
      role: req.user.role,
      action: 'PAYMENT_INTENT_FAILED',
      success: false,
      details: { message: error.message },
    });
    return res.status(500).json({ error: 'Payment intent failed' });
  }
}

module.exports = { createPaymentIntent };
