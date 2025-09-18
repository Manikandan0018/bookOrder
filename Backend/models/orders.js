import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "ALLProduct", required: true },
    name: { type: String },
    imageUrl: { type: String },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
  },
],

    address: { type: mongoose.Schema.Types.ObjectId, ref: "Address", required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    paymentMethod: { type: String, default: "COD" },

    // ✅ Custom 6-digit order ID
    orderNumber: {
      type: String,
      unique: true,
    },

    // ✅ Store cancellation timestamp
    cancelledAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// Generate 6-digit order number before saving
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    this.orderNumber = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit number
  }
  next();
});

// ✅ TTL Index: Delete document 24 hours after cancellation
orderSchema.index({ cancelledAt: 1 }, { expireAfterSeconds: 86400 }); // 24 hours

export default mongoose.model("Order", orderSchema);
