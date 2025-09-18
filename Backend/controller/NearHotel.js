import Restaurant from "../models/NearHotel.js";

export const getNearbyRestaurants = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res
        .status(400)
        .json({ message: "Latitude and longitude required" });
    }

    const restaurants = await Restaurant.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(lng), parseFloat(lat)],
          },
          $maxDistance: 5000, // 5 km
        },
      },
    });

    if (!restaurants.length) {
      return res.status(404).json({ message: "No nearby restaurants found" });
    }

    res.json(restaurants);
  } catch (err) {
    console.error("❌ Nearby restaurants error:", err);
    res.status(500).json({ message: "Error fetching hotels" });
  }
};
