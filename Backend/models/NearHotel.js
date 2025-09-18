import mongoose from "mongoose";

const restaurantSchema = new mongoose.Schema({
  name: String,
  address: String,
  pincode: String,
  cuisine: String,
  imageUrl: String,
  location: {
    type: { type: String, enum: ["Point"], required: true },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
});

restaurantSchema.index({ location: "2dsphere" });

export default mongoose.model("Restaurant", restaurantSchema);
