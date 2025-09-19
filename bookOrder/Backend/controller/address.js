import axios from "axios";
import Address from "../models/address.js";

// Save address using lat/lng + form details

export const saveDetectedAddress = async (req, res) => {
  try {
    const { latitude, longitude } = req.body;
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and longitude required" });
    }

    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
    );

    const data = response.data;
    if (!data || !data.address) {
      return res.status(500).json({ message: "Could not fetch address details" });
    }

    const street = data.address.road || "";
    const city = data.address.city || data.address.town || data.address.village || "";
    const state = data.address.state || "";
    const pincode = data.address.postcode || "";
    const name = data.address.name || "";
    const phone = data.address.phone || "";
    const country = data.address.country || "India";

    res.json({ street, city, state, pincode, country,name,phone });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error detecting address", error: err.message });
  }
};


// save address entered manually
export const saveManualAddress = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const {
      street,
      city,
      state,
      pincode,
      country,
      name,
      phone,
      latitude,
      longitude,
    } = req.body;

    if (!street || !city || !state || !pincode || !country || !name || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    const address = new Address({
      user: req.user._id,
      street,
      city,
      state,
      pincode,
      country,
      name,
      phone,
      latitude, // ✅ store latitude
      longitude, // ✅ store longitude
    });

    await address.save();
    res.status(201).json({ message: "Manual address saved", address });
  } catch (err) {
    console.error("❌ Address Save Error:", err);
    res
      .status(500)
      .json({ message: "Error saving manual address", error: err.message });
  }
};

// ✅ Get all addresses for logged in user
export const getUserAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id }).sort({ createdAt: 1 });
    res.json(addresses);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


