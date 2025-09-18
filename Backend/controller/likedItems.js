import Favorite from "../models/likedItem.js";
import Product from "../models/AllProduct.js";   // Product model

// Add to favorite
export const addFavorite = async (req, res) => {
  try {
    const userId = req.user._id;  // assuming you're using auth middleware
    const { product } = req.body;

    // ✅ check if product exists in DB
    const productExists = await Product.findById(product);
    if (!productExists) {
      return res.status(404).json({ message: "Product not found" });
    }

    // ✅ check if already in favorites
    const existingFavorite = await Favorite.findOne({ user: userId, product });
    if (existingFavorite) {
      return res.status(400).json({ message: "Product already in favorites" });
    }

    // ✅ add to favorites
    const favorite = new Favorite({
      user: userId,
      product,
    });

    await favorite.save();
    res.status(201).json({ message: "Added to favorites", favorite });
  } catch (error) {
    console.error("Add to Favorite Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// Get all favorite items
export const getFavorites = async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).populate("product");
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove from favorites
export const removeFavorite = async (req, res) => {
  try {
    const fav = await Favorite.findOneAndDelete({ user: req.user._id, product: req.params.id });
    if (!fav) return res.status(404).json({ message: "Not found" });

    res.json({ message: "Removed from favorites" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
