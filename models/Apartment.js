const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  numberOfFlats: { type: Number, required: true },
  residents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Apartment', apartmentSchema);
