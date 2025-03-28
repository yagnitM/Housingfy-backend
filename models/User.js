const mongoose = require('mongoose'); 


const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'resident'], default: 'resident' },
  email: { type: String, required: true, unique: true },
  apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment' },
}, { timestamps: true });


module.exports = mongoose.model('users', userSchema);
