// backend/routes/guide.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const { authenticate, authorizeRole } = require('../middleware/auth');

// All guide routes require auth + guide role
router.use(authenticate, authorizeRole('guide'));

// GET list of students/orders assigned to current guide
// returns orders assignedGuide === req.user._id
router.get('/students', async (req, res) => {
  try {
    const orders = await Order.find({ assignedGuide: req.user._id })
      .populate('user', 'fullName email phoneNumber')
      .populate('product', 'name price sku');

    res.json(orders);
  } catch (err) {
    console.error('guide/students error', err);
    res.status(500).json({ message: 'Failed to load students' });
  }
});

module.exports = router;
