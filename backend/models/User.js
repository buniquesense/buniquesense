const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  address: String,
  city: String,
  state: String,
  role: { type: String, enum: ['student','admin','guide'], default: 'student' },
  passwordHash: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  assignedGuide: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // for students
});

// helper to set password
UserSchema.methods.setPassword = async function(pass) {
  this.passwordHash = await bcrypt.hash(pass, 10);
};

UserSchema.methods.validatePassword = async function(pass) {
  return bcrypt.compare(pass, this.passwordHash);
};

module.exports = mongoose.model('User', UserSchema);
