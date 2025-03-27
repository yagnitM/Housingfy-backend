const mongoose = require("mongoose");

const apartmentSchema = new mongoose.Schema({
  societyId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Society", 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    required: true 
  },
  size: { 
    type: Number, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Vacant', 'Occupied'], 
    default: 'Vacant' 
  },
  features: {
    Balcony: { type: Boolean, default: false },
    AirConditioned: { type: Boolean, default: false },
    Furnished: { type: Boolean, default: false },
    ModularKitchen: { type: Boolean, default: false }
  },
  ownerDetails: {
    name: { 
      type: String, 
      default: '' 
    },
    contact: { 
      type: String, 
      default: '' 
    },
    email: { 
      type: String, 
      default: '',
      match: [/\S+@\S+\.\S+/, 'Invalid email format']
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Apartment", apartmentSchema);