const express = require('express');
const Apartment = require('../models/Apartment');
const Society = require('../models/Society'); // ✅ Added Society model
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ Add a new apartment under a specific society
router.post('/add', authMiddleware, adminOnly, async (req, res) => {
  const { name, address, numberOfFlats, societyId } = req.body;

  try {
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    const newApartment = new Apartment({ name, address, numberOfFlats });
    await newApartment.save();

    res.status(201).json(newApartment);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
