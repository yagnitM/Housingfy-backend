const express = require('express');
const Society = require('../models/Society');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

// Create Society 
router.post('/add', authMiddleware, async (req, res) => {
  try {
    const { name, address, location, rooms, facilities, coordinates } = req.body;

    // Validate required fields
    if (!name || !address) {
      return res.status(400).json({ 
        message: 'Missing required fields', 
        missingFields: {
          name: !name,
          address: !address
        }
      });
    }

    // Additional validation for rooms and facilities
    if (!rooms || typeof rooms !== 'object') {
      return res.status(400).json({ message: 'Invalid rooms data' });
    }

    if (!facilities || typeof facilities !== 'object') {
      return res.status(400).json({ message: 'Invalid facilities data' });
    }

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
      coordinates,
      createdBy: req.user._id
    });

    await newSociety.save();
    res.status(201).json({ 
      message: 'Society created successfully!', 
      society: newSociety 
    });
  } catch (error) {
    console.error('Detailed Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    // More specific error responses
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: Object.values(error.errors).map(err => err.message) 
      });
    }

    res.status(500).json({ 
      message: 'Internal Server Error', 
      error: error.message 
    });
  }
});

// Get societies for admin
router.get('/admin', authMiddleware, async (req, res) => {
  try {
    const societies = await Society.find({ createdBy: req.user._id, isDeleted: false });
    res.json(societies);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

module.exports = router;