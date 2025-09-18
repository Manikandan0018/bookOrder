import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../Header/Header";

const VITE_BACKEND_URL =import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", VITE_BACKEND_URL);

const MenuCart = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}api/AllProduct/getProduct`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const getProductsByCategory = (category) =>
    products.filter((p) => p.category.toLowerCase() === category);

  const ProductCard = ({ item }) => (
    <div className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex flex-col">
      {item.imageUrl && (
        <img
          src={item.imageUrl}
          alt={item.name}
          className="h-40 w-full object-cover"
        />
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-lg mb-1">{item.name}</h3>
        <p className="text-orange-600 font-bold mb-2">₹{item.price}</p>
        <p className="text-gray-600 text-sm flex-1 line-clamp-3">
          {item.description}
        </p>
        <button className="mt-4 py-2 px-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition">
          View Details
        </button>
      </div>
    </div>
  );

  const CategorySection = ({ title, category }) => {
    const items = getProductsByCategory(category);
    if (!items.length) return null;

    return (
      <section className="px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {items.map((item) => (
            <ProductCard key={item._id} item={item} />
          ))}
        </div>
      </section>
    );
  };

  return (
    <div className="font-sans text-gray-800">
      <Header />

      <section className="relative bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center py-16">
        <h2 className="text-3xl font-bold">Menu Categories</h2>
        <p className="mt-2 text-sm">Home / Pages / Menu Categories</p>
      </section>

      <CategorySection title="Popular Breakfast Items" category="breakfast" />
      <CategorySection title="Our Lunch Items" category="lunch" />
      <CategorySection title="Our Dinner Items" category="dinner" />
    </div>
  );
};

export default MenuCart;
