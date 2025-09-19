import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },      // ✅ add fullName
    phone: { type: String, required: true },   // ✅ add phoneNumber
    street: { type: String, required: false },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    country: { type: String, required: true },
    latitude: { type: Number },
    longitude: { type: Number },
  },
  { timestamps: true }
);

export default mongoose.model("Address", addressSchema);
