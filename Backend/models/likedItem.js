import mongoose from "mongoose";

const favoriteSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "ALLProduct", required: true },
  },
  { timestamps: true }
);

// Ensure a product is not duplicated in user's favorites
favoriteSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Favorite", favoriteSchema);
