import ALLProduct from "../models/AllProduct.js";

export const getDashboardStats = async (req, res) => {
  try {
    const totalProducts = await ALLProduct.countDocuments();

    const vegCount = await ALLProduct.countDocuments({ category: "veg" });
    const nonVegCount = await ALLProduct.countDocuments({ category: "non-veg" });

    // Average price
    const avgPriceResult = await ALLProduct.aggregate([
      { $group: { _id: null, avgPrice: { $avg: "$price" } } },
    ]);
    const avgPrice = avgPriceResult[0]?.avgPrice || 0;

    // All categories distribution
    const categoryCount = await ALLProduct.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);

    // Veg only distribution
    const vegCategoryCount = await ALLProduct.aggregate([
      { $match: { category: "veg" } },
      { $group: { _id: "$name", count: { $sum: 1 } } },
    ]);

    // Non-Veg only distribution
    const nonVegCategoryCount = await ALLProduct.aggregate([
      { $match: { category: "non-veg" } },
      { $group: { _id: "$name", count: { $sum: 1 } } },
    ]);

    res.json({
      totalProducts,
      vegCount,
      nonVegCount,
      avgPrice,
      categoryCount,
      vegCategoryCount,
      nonVegCategoryCount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
