const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GuideAssignmentLog = new Schema({
  order: { type: Schema.Types.ObjectId, ref: 'Order' },
  guide: { type: Schema.Types.ObjectId, ref: 'User' },
  assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  note: String,
  at: { type: Date, default: Date.now }
});
module.exports = mongoose.model('GuideAssignmentLog', GuideAssignmentLog);
