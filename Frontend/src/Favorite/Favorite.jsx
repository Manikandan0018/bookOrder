// components/FavoriteProducts.jsx
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Trash2, ShoppingCart } from "lucide-react";
import { motion } from "framer-motion";
import { Header } from "../Header/Header";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

const VITE_BACKEND_URL = "http://localhost:5000/";

const Favorite = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // ✅ Add to cart
  const addToCart = async (productId, quantity = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login to add to cart.");
        return;
      }

      await axios.post(
        `${VITE_BACKEND_URL}api/cart/addCart`,
        { product: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Added to cart ✅");
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
      <p className="text-center text-gray-500 mt-20">Loading favorites...</p>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 p-8">
        <div className="container mx-auto mt-20">
          {favorites?.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <img
                src="https://cdn-icons-png.flaticon.com/512/833/833472.png"
                alt="Empty"
                className="w-28 mb-6 opacity-80"
              />
              <h2 className="text-xl md:text-2xl font-bold text-gray-700 mb-2">
                No favorites yet ❤️
              </h2>
              <p className="text-gray-500">Start adding your favorite books!</p>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favorites?.map((item) => {
                if (!item.product) return null;

                return (
                  <motion.div
                    key={item.product._id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="bg-white rounded-2xl shadow-md hover:shadow-2xl transition flex flex-col border border-gray-100"
                  >
                    {/* Book Image */}
                    <div className="relative h-64 overflow-hidden rounded-t-2xl">
                      <img
                        src={
                          item.product.imageUrl ||
                          "https://via.placeholder.com/200x300?text=No+Image"
                        }
                        alt={item.product.title || "Book"}
                        className="w-full h-full object-cover transform hover:scale-105 transition duration-500"
                      />
                      <button
                        onClick={() => removeFavorite.mutate(item.product._id)}
                        className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow hover:bg-red-100 transition"
                      >
                        <Trash2 className="text-red-500" size={20} />
                      </button>
                    </div>

                    {/* Book Details */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                        {item.product.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-1 line-clamp-1">
                        by {item.product.author}
                      </p>
                      <p className="text-xs text-orange-600 font-medium uppercase mb-2">
                        {item.product.category}
                      </p>
                      <p className="text-lg font-extrabold text-gray-800 mb-4">
                        ₹{item.product.price}
                      </p>

                      {/* Actions */}
                      <div className="mt-auto flex flex-col gap-3">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            await addToCart(item.product._id); // ✅ add to cart
                            navigate("/cart"); // ✅ redirect
                          }}
                          className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow hover:shadow-lg transition"
                        >
                          <ShoppingCart size={18} /> Add to Cart
                        </motion.button>
                        <a
                          href={`/`}
                          className="text-center text-sm text-gray-600 font-medium hover:text-orange-600 transition"
                        >
                          go home →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Favorite;
