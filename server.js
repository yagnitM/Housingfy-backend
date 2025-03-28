const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const userRoutes = require('./routes/userRoutes');
const societyRoutes = require('./routes/societyRoutes'); 

dotenv.config();
const app = express();

// CORS Configuration (Update frontend URL if deployed)
const corsOptions = {
  origin: [
    'http://localhost:5173', // Local frontend
    'https://housingfy-frontend.onrender.com' // Replace with actual deployed frontend URL
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, 
};

app.use(cors(corsOptions));
app.use(express.json()); 

// Root Route (Fixes "Cannot GET /" issue)
app.get("/", (req, res) => {
  res.send("Housingfy Backend is Running Successfully!");
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/societies', societyRoutes); 

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => {
    console.error("MongoDB connection error:", err);
    process.exit(1); 
  });

// Custom Error Handling Middleware
app.use((err, req, res, next) => {
  console.error("Unexpected Error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Start Server
const PORT = process.env.PORT || 6060;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
