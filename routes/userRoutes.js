const express = require('express');
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware'); // Updated import
const router = express.Router();

// Get all users (Admins Only)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
});

module.exports = router;
