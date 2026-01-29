// Security summary (student note): orders use server-side pricing validation and Stripe intents,
// so clients cannot change prices in the browser.
const Stripe = require('stripe');
const Beer = require('../models/Beer');
const Order = require('../models/Order');
const { logAudit } = require('../utils/audit');

function getStripeClient() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(key, { apiVersion: '2024-06-20' });
}

async function buildOrderItems(items = []) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cart is empty');
  }

  const ids = items.map((item) => item.beerId);
  const beers = await Beer.find({ _id: { $in: ids } });
  const beerMap = new Map(beers.map((beer) => [beer._id.toString(), beer]));
  // Security note: server-side lookup prevents price tampering from the client.

  const orderItems = items.map((item) => {
    const beer = beerMap.get(item.beerId);
    if (!beer) {
      throw new Error('Invalid beer selection');
    }
    // Security note: clamp quantity to reduce abuse and overflow.
    const quantity = Math.max(1, Math.min(Number(item.quantity || 1), 99));
    const price = Number(beer.price);
    const lineTotal = Number((price * quantity).toFixed(2));
    return {
      beerId: beer._id,
      name: beer.name,
      price,
      quantity,
      lineTotal,
    };
  });

  const subtotal = Number(
    orderItems.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)
  );

  return { orderItems, subtotal };
}

async function createCheckout(req, res) {
  const { items, currency } = req.body;

  try {
    const { orderItems, subtotal } = await buildOrderItems(items);

    const order = await Order.create({
      userId: req.user.id,
      items: orderItems,
      subtotal,
      currency: currency || 'usd',
    });

    const stripe = getStripeClient();
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(subtotal * 100),
      currency: order.currency,
      automatic_payment_methods: { enabled: true },
      metadata: { orderId: order._id.toString(), userId: req.user.id },
    });

    order.paymentIntentId = intent.id;
    order.paymentStatus = intent.status;
    await order.save();

    await logAudit({
      req,
      userId: req.user.id,
      role: req.user.role,
      action: 'ORDER_CHECKOUT_CREATED',
      success: true,
      details: { orderId: order._id.toString(), subtotal },
    });

    return res.json({
      orderId: order._id.toString(),
      clientSecret: intent.client_secret,
    });
  } catch (error) {
    await logAudit({
      req,
      userId: req.user.id,
      role: req.user.role,
      action: 'ORDER_CHECKOUT_FAILED',
      success: false,
      details: { message: error.message },
    });
    return res.status(400).json({ error: error.message });
  }
}

async function confirmOrder(req, res) {
  const { orderId, paymentIntentId } = req.body;

  const order = await Order.findOne({
    _id: orderId,
    userId: req.user.id,
  });

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  if (!paymentIntentId && !order.paymentIntentId) {
    return res.status(400).json({ error: 'Missing payment intent' });
  }

  try {
    const stripe = getStripeClient();
    const intent = await stripe.paymentIntents.retrieve(paymentIntentId || order.paymentIntentId);

    order.paymentStatus = intent.status;
    if (intent.status === 'succeeded') {
      order.status = 'paid';
    } else if (intent.status === 'canceled') {
      order.status = 'cancelled';
    } else if (intent.status === 'requires_payment_method') {
      order.status = 'failed';
    }
    await order.save();

    await logAudit({
      req,
      userId: req.user.id,
      role: req.user.role,
      action: 'ORDER_CONFIRM',
      success: true,
      details: { orderId: order._id.toString(), status: order.status },
    });

    return res.json({
      orderId: order._id.toString(),
      status: order.status,
      paymentStatus: order.paymentStatus,
    });
  } catch (error) {
    await logAudit({
      req,
      userId: req.user.id,
      role: req.user.role,
      action: 'ORDER_CONFIRM_FAILED',
      success: false,
      details: { message: error.message },
    });
    return res.status(500).json({ error: 'Payment confirmation failed' });
  }
}

async function getMyOrders(req, res) {
  const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
  return res.json({ orders });
}

async function getAllOrders(req, res) {
  const orders = await Order.find().sort({ createdAt: -1 }).limit(200);
  return res.json({ orders });
}

module.exports = {
  createCheckout,
  confirmOrder,
  getMyOrders,
  getAllOrders,
};
