// components/FavoriteProducts.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Heart, Trash2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "../Header/Header";

const VITE_BACKEND_URL =import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", VITE_BACKEND_URL);

const Favorite = () => {
  const queryClient = useQueryClient();
  
  // Add to cart

const addToCart = async (productId, quantity = 1) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to add to cart.");
      return;
    }

    const { data } = await axios.post(
      `${VITE_BACKEND_URL}api/cart/addCart`,
      { product: productId, quantity },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    alert("Added to cart ✅");
    console.log("Cart item:", data);

    // ✅ This will refresh cart count in Header without refresh
    queryClient.invalidateQueries(["cart"]);
  } catch (error) {
    console.error(error);
    alert("Failed to add to cart.");
  }
};

  // ✅ Fetch Favorites
  const { data: favorites, isLoading } = useQuery({
    queryKey: ["favorites"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${VITE_BACKEND_URL}api/favorite/get`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // ✅ Remove Favorite
  const removeFavorite = useMutation({
    mutationFn: async (productId) => {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${VITE_BACKEND_URL}api/favorite/remove/${productId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["favorites"]);
    },
  });

 

  if (isLoading) {
    return (
      <p className="text-center text-gray-500 text-lg mt-20 animate-pulse">
        Loading your favorites...
      </p>
    );
  }

  return (
    <>
      <Header />

      {/* Page Background */}
      <div
        className="min-h-screen p-8 bg-gradient-to-br from-orange-50 via-white to-orange-100"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="bg-black/40  mt-20 backdrop-blur-md min-h-screen rounded-2xl p-8">
          

          {/* Empty State */}
          {favorites?.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-white py-24">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076505.png"
                alt="Empty Favorites"
                className="w-36 h-36 mb-6 opacity-80"
              />
              <p className="text-lg opacity-90 mb-4">
                Your favorites list is empty. Start adding some delicious foods
                ❤️
              </p>
              <a
                href="/menu"
                className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition"
              >
                Browse Menu
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {favorites?.map((item) => (
                <motion.div
                  key={item.product._id}
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/95 rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition"
                >
                  {/* Product Image */}
                  <div className="relative h-60">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => removeFavorite.mutate(item.product._id)}
                      className="absolute top-3 right-3 bg-white/80 p-2 rounded-full shadow hover:bg-red-100 transition"
                    >
                      <Trash2 className="text-red-500" size={20} />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-5 flex flex-col justify-between h-44">
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {item.product.description}
                    </p>
                    <p className="text-lg font-bold text-orange-600 mt-2">
                      ₹{item.product.price}
                    </p>

                    {/* Actions */}
                    <div className="flex justify-between items-center mt-3">
                    <button
  onClick={() => addToCart(item.product._id)}
  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
>
  <ShoppingCart size={18} /> Add to Cart
</button>

                      <a
                        href={`/product/${item.product._id}`}
                        className="text-sm text-gray-700 font-medium hover:text-orange-600 transition"
                      >
                        View Details →
                      </a>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Favorite;
