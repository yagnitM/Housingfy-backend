const express = require("express");
const Apartment = require("../models/Apartment");
const Society = require("../models/Society");
const { authMiddleware, adminOnly } = require("../middleware/authMiddleware");
const router = express.Router();


router.get("/society/:societyId", authMiddleware, async (req, res) => {
  try {
    const apartments = await Apartment.find({ societyId: req.params.societyId });
    res.json(apartments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching apartments", error: error.message });
  }
});


router.post("/add", authMiddleware, async (req, res) => {
  const { 
    societyId, 
    name, 
    type, 
    size, 
    price, 
    status, 
    features, 
    ownerDetails 
  } = req.body;

  try {
    const society = await Society.findById(societyId);
    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    const newApartment = new Apartment({
      societyId,
      name,
      type,
      size,
      price,
      status,
      features,
      ownerDetails: status === 'Occupied' ? ownerDetails : {}
    });

    await newApartment.save();

    res.status(201).json(newApartment);
  } catch (error) {
    console.error("Apartment creation error:", error);
    res.status(500).json({ 
      message: "Error adding apartment", 
      error: error.message 
    });
  }
});

router.put("/:id", authMiddleware, adminOnly, async (req, res) => {
  const { id } = req.params;
  const { 
    size, 
    price, 
    status, 
    features, 
    ownerDetails 
  } = req.body;

  try {
    const updatedApartment = await Apartment.findByIdAndUpdate(
      id, 
      {
        size,
        price,
        status,
        features,
        ownerDetails: status === 'Occupied' ? ownerDetails : {}
      }, 
      { new: true, runValidators: true }
    );

    if (!updatedApartment) {
      return res.status(404).json({ message: "Apartment not found" });
    }

    res.json(updatedApartment);
  } catch (error) {
    console.error("Apartment update error:", error);
    res.status(500).json({ 
      message: "Error updating apartment", 
      error: error.message 
    });
  }
});

module.exports = router;