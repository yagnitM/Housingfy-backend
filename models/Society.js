const mongoose = require('mongoose');

const societySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  location: { type: String }, 
  coordinates: {
    latitude: { type: Number },
    longitude: { type: Number }
  },
  rooms: {
    "1BHK": { 
      count: { type: Number, default: 0 }, 
      price: { type: Number, default: 0 } 
    },
    "2BHK": { 
      count: { type: Number, default: 0 }, 
      price: { type: Number, default: 0 } 
    },
    "3BHK": { 
      count: { type: Number, default: 0 }, 
      price: { type: Number, default: 0 } 
    },
  },
  facilities: {
    Parking: { type: Boolean, default: false },
    Gymnasium: { type: Boolean, default: false },
    Security: { type: Boolean, default: false },
    Pool: { type: Boolean, default: false },
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'users' 
  },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Society', societySchema);