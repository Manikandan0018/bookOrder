// src/pages/Homepage.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FiSearch } from "react-icons/fi";
import { Header } from "../Header/Header";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { FaChevronDown, FaHeart } from "react-icons/fa";

import book1 from "../image/bs1.jpg";
import book2 from "../image/bs2.jpg";
import book3 from "../image/bs3.jpg";
import book4 from "../image/bs4.jpg";
import book5 from "../image/bs5.jpg";
import Footer from "../Footer/Footer";

const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [visibleCount, setVisibleCount] = useState(10);
  const [sortOrder, setSortOrder] = useState("default");
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  

  // Fetch books
  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}api/books/getBooks`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const addToCart = async (productId, quantity = 1) => {
    try {
      if (!token) return alert("Please login to add to cart.");

      await axios.post(
        `${VITE_BACKEND_URL}api/cart/addCart`,
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
        `${VITE_BACKEND_URL}api/favorite/add`,
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

  // Safe processing
  const processedProducts = [...products]
    .filter((item) => {
      const category = (item.category || "").toLowerCase();
      if (filterType === "fiction") return category === "fiction";
      if (filterType === "non-fiction") return category === "non-fiction";
      if (filterType === "comics") return category === "comics";
      if (filterType === "children") return category === "children";

      return true;
    })
    .filter((item) =>
      (item.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;
      if (sortOrder === "lowToHigh") return priceA - priceB;
      if (sortOrder === "highToLow") return priceB - priceA;
      return 0;
    });

  const [currentIndex, setCurrentIndex] = useState(0);
  const featuredBooks = [book1, book2, book3, book4, book5];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredBooks.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-sans text-gray-800 bg-gray-50 min-h-screen">
      {/* Navbar */}
      <Header />

      {/* Hero Section: Full-screen Auto Carousel */}
      <div className="relative w-full h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 flex transition-transform duration-1000 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {featuredBooks.map((img, idx) => (
            <div key={idx} className="w-full flex-shrink-0 h-[80vh] relative">
              <img
                src={img}
                alt={`Featured Book ${idx + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
                <h2 className="text-4xl md:text-6xl font-extrabold drop-shadow-lg leading-tight">
                  Discover Your Next Favorite Book
                </h2>
                <p className="mt-4 text-lg md:text-2xl drop-shadow-md max-w-3xl">
                  Browse bestsellers, classics, and new arrivals
                </p>
                <button
                  onClick={() =>
                    window.scrollTo({
                      top: window.innerHeight,
                      behavior: "smooth",
                    })
                  }
                  className="mt-6 px-6 py-3 rounded-full bg-orange-600 text-white font-semibold shadow-lg hover:bg-orange-700 transition"
                >
                  Shop Now
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* Scroll Down Button */}
        <button
          onClick={() =>
            window.scrollTo({ top: window.innerHeight, behavior: "smooth" })
          }
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-md shadow-lg border border-white/30 animate-bounce hover:bg-white/30 transition"
        >
          <FaChevronDown className="text-white text-2xl" />
        </button>
      </div>

      {/* Search + Filters */}
      <div className="sticky top-0 z-50 flex justify-center px-4 py-4 bg-white shadow-md">
        <div className="flex w-full max-w-6xl gap-4 flex-wrap items-center justify-between">
          <div className="flex w-full md:flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search books by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-3 bg-gray-200 text-gray-800 rounded-l-lg w-full focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-5 py-3 bg-orange-600 rounded-r-lg hover:bg-orange-700 transition">
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
              <option value="children">Children</option>
              <option value="comics">Comics</option>
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
      <section className="px-6 md:px-10 lg:px-16 py-12">
        {processedProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {processedProducts.slice(0, visibleCount).map((item) => (
              <div
                key={item._id}
                className="relative bg-white shadow-md rounded-2xl overflow-hidden transform transition duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-72 w-full bg-gray-100">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
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

                <div className="p-4 flex flex-col">
                  <h3 className="font-semibold text-lg">
                    {item.title.length > 20
                      ? item.title.slice(0, 20) + "..."
                      : item.title}
                  </h3>
                  <p className="text-sm text-gray-500 italic">
                    by{" "}
                    {item.author.length > 30
                      ? item.author.slice(0, 30) + "..."
                      : item.author}
                  </p>

                  <p className="mt-1 text-sm text-gray-600">
                    {item.description
                      ? item.description.length > 50
                        ? item.description.slice(0, 50) + "..."
                        : item.description
                      : "No description available"}
                  </p>

                  <p className="mt-2 text-xs font-medium text-orange-600 uppercase">
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
          <div className="flex flex-col items-center justify-center min-h-[50vh] bg-white">
            <div className="w-20 h-20 border-8 border-orange-500 border-dashed rounded-full animate-spin"></div>
            <p className="mt-6 text-lg font-semibold text-gray-700">
              Loading books...
            </p>
          </div>
        )}

        {/* Load More */}
        {visibleCount < processedProducts.length && (
          <div className="flex justify-center mt-10">
            <button
              onClick={() => setVisibleCount(visibleCount + 8)}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
            >
              Load More Books
            </button>
          </div>
        )}
      </section>
      <Footer/>
    </div>
  );
};

export default Home;
