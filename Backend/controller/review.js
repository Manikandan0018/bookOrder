import Review from "../models/review.js";
import Product from "../models/AllProduct.js";

// Add Review
export const addReview = async (req, res) => {
  console.log("User:", req.user);
  console.log("Body:", req.body);
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user.id;

    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) {
      return res
        .status(400)
        .json({ message: "You already reviewed this product." });
    }

    const review = await Review.create({
      product: productId,
      user: userId,
      rating,
      comment,
    });
    res.status(201).json({ message: "Review added successfully", review });
  } catch (err) {
    console.error("Add Review Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// Get Reviews for a product
export const getReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
