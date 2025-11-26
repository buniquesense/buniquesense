require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/product');
const orderRoutes = require('./routes/order');
const adminRoutes = require('./routes/admin');
const studentRoutes = require("./routes/student");
const guideRoutes = require('./routes/guide');
const cloudUpload = require('./routes/upload');
const contactRoutes = require("./routes/contact");

const app = express();
app.use(cors());
app.use(express.json());

// connect mongo
mongoose.connect(process.env.MONGO_URI)
  .then(()=> console.log('MongoDB Connected'))
  .catch(err=> console.error(err));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/order', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/student", studentRoutes);
app.use('/api/guide', guideRoutes);
app.use('/api/upload', cloudUpload);
app.use("/api/contact", contactRoutes);

// error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});

app.get('/api/test', (req, res) => {
  res.json({ ok: true });
});

const port = process.env.PORT || 4000;
app.listen(port, ()=> console.log('listening', port));
