import ALLProduct from "../models/Book.js";

export const getDashboardStats = async (req, res) => {
  try {
    // ✅ Total Books
    const totalBooks = await ALLProduct.countDocuments();

    // ✅ Average Price of Books
    const avgPriceResult = await ALLProduct.aggregate([
      { $group: { _id: null, avgPrice: { $avg: "$price" } } },
    ]);
    const avgPrice = avgPriceResult[0]?.avgPrice || 0;

    // ✅ Count books per category
    const categories = await ALLProduct.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { _id: 0, name: "$_id", count: 1 } },
    ]);

    // ✅ Find top category
    const topCategory =
      categories.length > 0
        ? categories.reduce(
            (max, c) => (c.count > max.count ? c : max),
            categories[0]
          )
        : null;

    res.json({
      totalBooks,
      avgPrice,
      categories, // e.g. [ { name: "Fiction", count: 40 }, ... ]
      topCategory, // e.g. { name: "Fiction", count: 40 }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching stats" });
  }
};
