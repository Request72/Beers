const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    beerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Beer', required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'cancelled'],
      default: 'pending',
    },
    paymentIntentId: { type: String },
    paymentStatus: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
