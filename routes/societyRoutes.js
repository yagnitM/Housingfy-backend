const express = require('express');
const Society = require('../models/Society'); // Import Society model
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware'); // Example middleware
const router = express.Router();

//Create a new Society (Admins Only)
router.post('/add', authMiddleware, async (req, res) => {
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
      createdBy: req.user._id, // Admin's ID
    });

    await newSociety.save();
    res.status(201).json({ message: 'Society created successfully!', society: newSociety });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ✅ Get all societies (Accessible to all)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const societies = await Society.find();
    res.json(societies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ✅ Get a single society by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }
    res.json(society);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// ✅ Delete a society (Soft Delete)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const society = await Society.findById(req.params.id);
    if (!society) {
      return res.status(404).json({ message: 'Society not found' });
    }

    await Society.updateOne({ _id: req.params.id }, { isDeleted: true });
    res.json({ message: 'Society deleted successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;
