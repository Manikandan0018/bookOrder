import mongoose from "mongoose";
import dotenv from "dotenv";
import Restaurant from "./models/NearHotel.js";

dotenv.config();

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/foodorder";

const restaurants = [
  {
    name: "Tasty Bites",
    address: "123 Main Street, Srivilliputhur",
    pincode: "626126",
    cuisine: "Indian",
    location: { type: "Point", coordinates: [77.6121, 9.4125] }, // [lng, lat]
    imageUrl: "https://via.placeholder.com/300x200.png?text=Tasty+Bites",
  },
  {
    name: "Pizza Palace",
    address: "45 Market Road, Srivilliputhur",
    pincode: "626126",
    cuisine: "Italian",
    location: { type: "Point", coordinates: [77.614, 9.41] },
    imageUrl: "https://via.placeholder.com/300x200.png?text=Pizza+Palace",
  },
  {
    name: "Burger Hub",
    address: "78 MG Road, Srivilliputhur",
    pincode: "626126",
    cuisine: "Fast Food",
    location: { type: "Point", coordinates: [77.6105, 9.413] },
    imageUrl: "https://via.placeholder.com/300x200.png?text=Burger+Hub",
  },
];

const seed = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Restaurant.deleteMany({});
    console.log("🗑️ Old restaurants removed");

    await Restaurant.insertMany(restaurants);
    console.log(`✅ Inserted ${restaurants.length} restaurants`);

    process.exit();
  } catch (err) {
    console.error("❌ Seed error:", err);
    process.exit(1);
  }
};

seed();
