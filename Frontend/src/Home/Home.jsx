// src/pages/Homepage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { Header } from "../Header/Header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaChevronDown } from "react-icons/fa";

// Sample book images (replace with your assets if needed)
import book1 from "../image/bs1.jpg";
import book2 from "../image/bs2.jpg";
import book3 from "../image/bs3.jpg";
import book4 from "../image/bs4.jpg";
import book5 from "../image/bs5.jpg";

const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [sortOrder, setSortOrder] = useState("default");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  // Fetch books
  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}/api/AllProduct/getProduct`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (!token) return alert("Please login to add to cart.");

      await axios.post(
        `${VITE_BACKEND_URL}/api/cart/addCart`,
        { product: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Added to cart ✅");
      queryClient.invalidateQueries(["cart"]);
    } catch (err) {
      toast.error("Failed to add to cart.");
    }
  };

  const addToFavorite = useMutation({
    mutationFn: async (productId) => {
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}/api/favorite/add`,
        { product: productId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["favorites"]);
      toast.success(data.message || "Added to favorites ❤️");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add favorite.");
    },
  });

  const processedProducts = [...products]
    .filter((item) => {
      if (filterType === "fiction")
        return item.category?.toLowerCase() === "fiction";
      if (filterType === "non-fiction")
        return item.category?.toLowerCase() === "non-fiction";
      return true;
    })
    .filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priceA = Number(a.price);
      const priceB = Number(b.price);
      if (sortOrder === "lowToHigh") return priceA - priceB;
      if (sortOrder === "highToLow") return priceB - priceA;
      return 0;
    });

  
  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredBooks = [book1, book2, book3, book4, book5];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, []);


  return (
    <div className="font-sans text-gray-800">
      {/* Navbar */}
      <Header />

      {/* Hero Section: Full-screen Auto Carousel */}
      <div className="relative w-full h-screen overflow-hidden">
        {/* Carousel Slides */}
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {[book1, book2, book3, book4, book5].map((img, idx) => (
            <div key={idx} className="w-full flex-shrink-0 h-screen relative">
              <img
                src={img}
                alt={`Featured Book ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <h2 className="text-3xl md:text-5xl font-bold drop-shadow-lg">
                  Discover Your Next Favorite Book
                </h2>
                <p className="mt-4 text-lg md:text-2xl drop-shadow-md max-w-2xl">
                  Browse bestsellers, classics, and new arrivals
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Scroll Down Button */}
        <button
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md shadow-lg border border-white/30 animate-bounce hover:bg-white/30 transition"
        >
          <FaChevronDown className="text-white text-2xl" />
        </button>
      </div>

      {/* Search + Filters */}
      <div className="sticky top-16 z-40 flex justify-center px-4 py-3 bg-white shadow-sm">
        <div className="flex w-full max-w-4xl gap-3 flex-wrap justify-between">
          <div className="flex w-full md:max-w-md">
            <input
              type="text"
              placeholder="Search books..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 bg-gray-100 text-gray-800 rounded-l-full w-full focus:outline-none"
            />
            <button className="px-5 py-3 bg-orange-600 rounded-r-full hover:bg-orange-700 transition">
              <FiSearch size={20} className="text-white" />
            </button>
          </div>

          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="all">All Categories</option>
              <option value="fiction">Fiction</option>
              <option value="non-fiction">Non-Fiction</option>
            </select>

            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="default">Sort by Price</option>
              <option value="lowToHigh">Low to High</option>
              <option value="highToLow">High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Book Grid */}
      <section className="px-8 py-10">
        {processedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {processedProducts.slice(0, visibleCount).map((item) => (
              <div
                key={item._id}
                className="relative bg-white shadow-md rounded-2xl overflow-hidden transform transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-72 w-full bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => addToFavorite.mutate(item._id)}
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/70 hover:bg-white transition"
                  >
                    ❤️
                  </button>
                  <span className="absolute bottom-3 left-3 bg-white/90 px-3 py-1 rounded-full text-sm font-semibold text-orange-600 shadow">
                    ₹{item.price}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-lg truncate">{item.name}</p>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {item.description}
                  </p>
                  <p className="mt-1 text-xs text-gray-500 uppercase">
                    {item.category}
                  </p>
                  <button
                    onClick={() => addToCart(item._id)}
                    className="mt-3 w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="w-24 h-24 border-8 border-orange-500 border-dashed rounded-full animate-spin"></div>
            <p className="mt-6 text-lg font-semibold text-gray-700">
              Loading books...
            </p>
          </div>
        )}

        {/* Load More */}
        {visibleCount < processedProducts.length && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setVisibleCount(visibleCount + 8)}
              className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition"
            >
              Load More
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
