const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const { authenticate, authorizeRole } = require('../middleware/auth');

router.get('/', async (req, res) => {
  const list = await Product.find();
  res.json(list);
});

// admin create
router.post('/', authenticate, authorizeRole('admin'), async (req, res) => {
  const p = new Product(req.body);
  await p.save();
  res.json(p);
});

router.put('/:id', authenticate, authorizeRole('admin'), async (req, res) => {
  const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(p);
});

router.delete('/:id', authenticate, authorizeRole('admin'), async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.json({ ok: true });
});

module.exports = router;
