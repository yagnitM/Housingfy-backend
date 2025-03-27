const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User'); //Import User model

dotenv.config();

const authMiddleware = async (req, res, next) => {
  const authHeader = req.header("Authorization"); //Correct way to get header
  if (!authHeader) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  const token = authHeader.split(" ")[1]; //Extract the token

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('password'); //Fetch full user details

    if (!req.user) {
      return res.status(401).json({ message: 'User not found' });
    }
    
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: 'Token is not valid' });
  }
};

//New middleware: Restricts access to admins only
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied. Admins only.' });
  }
};

module.exports = { authMiddleware, adminOnly };
