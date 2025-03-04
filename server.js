const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Import Routes
const authRoutes = require('./routes/authRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const userRoutes = require('./routes/userRoutes');
const societyRoutes = require('./routes/societyRoutes'); // ✅ Added Society Routes

dotenv.config();
const app = express();

// ✅ CORS Configuration (Modify according to frontend deployment URL)
const corsOptions = {
  origin: ['http://localhost:5173'], // Update this for production (e.g., https://yourdomain.com)
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies/auth headers
};

app.use(cors(corsOptions));
app.use(express.json()); // ✅ Middleware to parse JSON requests

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/societies', societyRoutes); // ✅ Added society routes

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // Exit process if DB connection fails
  });

// ✅ Custom Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("❌ Unexpected Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// ✅ Start Server
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
