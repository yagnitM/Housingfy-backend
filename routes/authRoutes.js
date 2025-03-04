const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret"; // Use .env for security

// Default test users (plaintext passwords for testing)
const defaultUsers = [
  { email: "admin@example.com", password: "Admin123!", role: "admin" },
  { email: "user@example.com", password: "Password123!", role: "resident" },
];

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", email, password); // Debug log

    // Check against default test users first
    // const testUser = defaultUsers.find((user) => user.email === email);
    // if (testUser && testUser.password === password) {
    //   console.log("Test user login successful");
    //   const token = jwt.sign({ email, role: testUser.role }, JWT_SECRET, { expiresIn: "1h" });
    //   return res.json({ token, role: testUser.role });
    // }

    // Check in the database
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found");
      return res.status(400).json({ message: "Invalid credentials" });
    }
    console.log(user);
    console.log("Stored hash in DB:", user.password);

    // Verify using bcrypt
    console.log(password, user.password);
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password match status:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, role: user.role });

  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Signup route (Uses bcrypt for hashing)
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password using bcrypt
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;