// routes/order.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { authenticate, authorizeRole } = require('../middleware/auth');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const razor = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});


// ------------------------------------------------------
// CREATE ORDER (RAZORPAY)
// ------------------------------------------------------
router.post('/create', authenticate, async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  let product = productId
    ? await Product.findById(productId)
    : await Product.findOne(); // AUTO pick first product

  if (!product)
    return res.status(404).json({ message: 'No product found. Contact admin.' });

  const amount = product.price * quantity * 100;

  const razorOrder = await razor.orders.create({
    amount,
    currency: 'INR',
    receipt: `rcpt_${Date.now()}`,
    payment_capture: 1
  });

  const ord = new Order({
    user: req.user._id,
    product: product._id,
    quantity,
    amount: amount / 100,
    payment: {
      provider: 'razorpay',
      orderId: razorOrder.id
    },
    status: 'created'
  });

  await ord.save();
  res.json({ razorOrder, orderId: ord._id });
});


// ------------------------------------------------------
// VERIFY PAYMENT
// ------------------------------------------------------
router.post('/verify', authenticate, async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, localOrderId } = req.body;

  const generatedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(razorpay_order_id + '|' + razorpay_payment_id)
    .digest('hex');

  if (generatedSignature !== razorpay_signature) {
    return res.status(400).json({ message: 'signature mismatch' });
  }

  const order = await Order.findById(localOrderId);
  if (!order) return res.status(404).json({ message: 'local order not found' });

  order.payment.paymentId = razorpay_payment_id;
  order.payment.signature = razorpay_signature;
  order.payment.paidAt = new Date();
  order.status = 'paid';
  await order.save();

  res.json({ ok: true, order });
});


// ------------------------------------------------------
// GET MY ORDERS (STUDENT)
// ------------------------------------------------------
router.get('/my', authenticate, async (req, res) => {
  const list = await Order.find({ user: req.user._id })
    .populate('product')
    .populate('assignedGuide', 'fullName email phoneNumber');

  res.json(list);
});


// ------------------------------------------------------
// GET ALL ORDERS (ADMIN)
// ------------------------------------------------------
router.get('/all', authenticate, authorizeRole('admin'), async (req, res) => {
  const list = await Order.find()
    .populate('user', 'fullName email phoneNumber')
    .populate('product')
    .populate('assignedGuide', 'fullName email phoneNumber');

  res.json(list);
});


// ------------------------------------------------------
// ASSIGN GUIDE (ADMIN)
// ------------------------------------------------------
router.post('/assign-guide', authenticate, authorizeRole('admin'), async (req, res) => {
  const { orderId, guideId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'order not found' });

  order.assignedGuide = guideId;
  await order.save();

  res.json({ ok: true });
});


// ------------------------------------------------------
// DISPATCH (ADMIN) - MANUAL
// ------------------------------------------------------
router.post('/dispatch/manual', authenticate, authorizeRole('admin'), async (req, res) => {
  const { orderId, courierName, trackingNumber } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'order not found' });

  order.shipment = {
    method: "manual",
    trackingNumber,
    courierName,
    status: "dispatched",
    history: [
      {
        status: "dispatched",
        message: `Shipment created via ${courierName}`,
        at: new Date()
      }
    ]
  };

  order.status = "dispatched";
  await order.save();

  res.json({ ok: true, order });
});


// ------------------------------------------------------
// DISPATCH (ADMIN) - MOCK SHIPROCKET
// ------------------------------------------------------
router.post('/dispatch/shiprocket', authenticate, authorizeRole('admin'), async (req, res) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId).populate('user').populate('product');
  if (!order) return res.status(404).json({ message: 'order not found' });

  // MOCK DATA (NO SHIPROCKET API CALL)
  order.shipment = {
    method: "shiprocket",
    trackingNumber: "SR-MOCK-" + Math.floor(Math.random() * 999999),
    courierName: "MockShip Express",
    status: "dispatched",
    history: [
      {
        status: "dispatched",
        message: "Mock Shiprocket dispatch",
        at: new Date()
      }
    ]
  };

  order.status = "dispatched";
  await order.save();

  res.json({ ok: true, order });
});


// ------------------------------------------------------
// UPDATE STATUS (ADMIN)
// ------------------------------------------------------
router.post('/update-status', authenticate, authorizeRole('admin'), async (req, res) => {
  const { orderId, status } = req.body;

  const order = await Order.findById(orderId);
  if (!order) return res.status(404).json({ message: 'order not found' });

  order.status = status;
  await order.save();

  res.json({ ok: true });
});


// ------------------------------------------------------
// SHIPMENT TRACKING (STUDENT + GUIDE + ADMIN)
// ------------------------------------------------------
router.get('/track/:id', authenticate, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order?.shipment?.trackingNumber) {
    return res.status(404).json({ message: 'No shipment info' });
  }

  // MOCK tracking
  res.json({
    ok: true,
    status: order.shipment.status,
    history: order.shipment.history
  });
});


// ------------------------------------------------------
// ⭐ GET ORDER BY ID (for guide & student dashboard)
// ------------------------------------------------------
// router.get('/:id', authenticate, async (req, res) => {
//   const order = await Order.findById(req.params.id)
//     .populate('user', 'fullName email phoneNumber address city state')
//     .populate('product', 'name price sku');

//   if (!order) return res.status(404).json({ message: 'Order not found' });

//   // Permission rules
//   const me = req.user;

//   if (me.role === 'admin') return res.json(order);
//   if (me.role === 'guide' && String(order.assignedGuide) === String(me._id))
//     return res.json(order);
//   if (me.role === 'student' && String(order.user._id) === String(me._id))
//     return res.json(order);

//   return res.status(403).json({ message: 'Forbidden' });
// });


// ------------------------------------------------------
// ⭐ GUIDE: LIST ASSIGNED STUDENTS (clean version)
// ------------------------------------------------------
// ⭐ GUIDE: LIST ASSIGNED STUDENTS
router.get('/guide/students', authenticate, authorizeRole('guide'), async (req, res) => {
  const orders = await Order.find({ assignedGuide: req.user._id })
    .populate('user', 'fullName email phoneNumber')
    .populate('product', 'name price');

  res.json(orders);
});

// ⭐ GUIDE: VIEW A STUDENT'S ORDER
router.get('/guide/student/:id', authenticate, authorizeRole('guide'), async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'fullName email phoneNumber address city state')
    .populate('product', 'name price');

  if (!order) return res.status(404).json({ message: "Order not found" });

  if (String(order.assignedGuide) !== String(req.user._id)) {
    return res.status(403).json({ message: "Not your student" });
  }

  res.json(order);
});

// ⭐ WILDCARD — MUST BE LAST ⭐
router.get('/:id', authenticate, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'fullName email phoneNumber address city state')
    .populate('product', 'name price sku');

  if (!order) return res.status(404).json({ message: 'Order not found' });

  const me = req.user;

  if (me.role === 'admin') return res.json(order);
  if (me.role === 'guide' && String(order.assignedGuide) === String(me._id))
    return res.json(order);
  if (me.role === 'student' && String(order.user._id) === String(me._id))
    return res.json(order);

  return res.status(403).json({ message: 'Forbidden' });
});


module.exports = router;
