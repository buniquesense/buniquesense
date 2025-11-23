const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const jwtSecret = process.env.JWT_SECRET || 'shh';

router.post('/register', async (req, res) => {
  const { fullName, email, phoneNumber, password, address, city, state } = req.body;

  if (!email || !password)
    return res.status(422).json({ message: 'email+password required' });

  const existing = await User.findOne({ email });
  if (existing)
    return res.status(422).json({ message: 'email exists' });

  const user = new User({ fullName, email, phoneNumber, address, city, state });
  await user.setPassword(password);
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, jwtSecret, { expiresIn: '7d' });

  return res.json({
    ok: true,
    token,
    user: {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role
    }
  });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const u = await User.findOne({ email });
  if(!u) return res.status(401).json({message:'No user'});
  const ok = await u.validatePassword(password);
  if(!ok) return res.status(401).json({message:'Invalid'});
  const token = jwt.sign({ id: u._id, role: u.role }, jwtSecret, { expiresIn: '7d' });
  res.json({
  token,
  user: {
    id: u._id,
    fullName: u.fullName,
    email: u.email,
    phoneNumber: u.phoneNumber,
    address: u.address,
    city: u.city,
    state: u.state,
    role: u.role
  }
});
});

module.exports = router;
