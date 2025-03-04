const express = require('express');
const Society = require('../models/Society');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');
const router = express.Router();

// ✅ Create a new Society (Admins Only)
router.post('/add', authMiddleware, adminOnly, async (req, res) => {
  const { name, address, location, rooms, facilities } = req.body;

  try {
    // Check if society already exists
    const existingSociety = await Society.findOne({ name });
    if (existingSociety) {
      return res.status(400).json({ message: 'Society already exists' });
    }

    const newSociety = new Society({
      name,
      address,
      location,
      rooms,
      facilities,
      createdBy: req.user._id, // ✅ Store admin's ID
    });

    await newSociety.save();
    res.status(201).json({ message: 'Society created successfully!', society: newSociety });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

// ✅ Get all societies (Accessible to all)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const societies = await Society.find();
    res.json(societies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
