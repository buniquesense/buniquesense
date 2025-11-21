const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number, // in rupees
  sku: String,
  stock: Number,
  createdAt: { type: Date, default: Date.now },
  published: { type: Boolean, default: true }
});

module.exports = mongoose.model('Product', ProductSchema);
