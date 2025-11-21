const mongoose = require('mongoose');

const ShipmentSchema = new mongoose.Schema({
  method: { type: String, enum: ['manual','shiprocket','none'], default: 'none' },
  status: { type: String, enum: ['pending','dispatched','in_transit','out_for_delivery','delivered','cancelled'], default: 'pending'},
  trackingNumber: String,
  courierName: String,
  history: [{ status: String, message: String, at: Date }],
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, default: 1 },
  amount: Number, // total
  payment: {
    provider: { type: String, enum: ['razorpay','offline','none'], default: 'none'},
    paymentId: String,
    orderId: String,
    signature: String,
    paidAt: Date
  },
  shipment: ShipmentSchema,
  assignedGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // guide assigned by admin
  status: { type: String, enum: ['created','paid','dispatched','completed','cancelled'], default: 'created' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
