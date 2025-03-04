const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  location: { type: String }, // Google Maps URL
  rooms: {
    "1BHK": { count: { type: Number, default: 0 }, price: { type: Number, default: 0 } },
    "2BHK": { count: { type: Number, default: 0 }, price: { type: Number, default: 0 } },
    "3BHK": { count: { type: Number, default: 0 }, price: { type: Number, default: 0 } },
  },
  facilities: {
    Parking: { type: Boolean, default: false },
    Gymnasium: { type: Boolean, default: false },
    Security: { type: Boolean, default: false },
    Pool: { type: Boolean, default: false },
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' }, // Admin who created it
}, { timestamps: true });

module.exports = mongoose.model('Society', societySchema);
