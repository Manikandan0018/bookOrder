import React, { useEffect, useState } from "react";
import axios from "axios";
import { Header } from "../Header/Header";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Footer from "../Footer/Footer";

const VITE_BACKEND_URL = "http://localhost:5000/";

const MenuCart = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // user auth token

  useEffect(() => {
    axios
      .get(`${VITE_BACKEND_URL}api/books/getBooks`)
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Get unique categories
  const categories = [
    ...new Set(products.map((p) => p.category.toLowerCase())),
  ];

  const addToCart = async (productId, quantity = 1) => {
    if (!token) {
      toast.error("Please login first");
      return;
    }

    try {
      await axios.post(
        `${VITE_BACKEND_URL}api/cart/addCart`,
        { product: productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Product added to cart ✅");
      navigate("/cart"); // redirect to cart
    } catch (err) {
      console.error(err);
      toast.error("Failed to add product to cart");
    }
  };

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
        <h3 className="font-semibold text-lg mb-1 line-clamp-1">{item.name}</h3>
        <p className="text-orange-600 font-bold mb-2">₹{item.price}</p>
        <p className="text-gray-600 text-sm flex-1 line-clamp-3">
          {item.description || "No description available"}
        </p>
        <button
          onClick={() => addToCart(item._id)}
          className="mt-4 py-2 px-4 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
        >
          Buy
        </button>
      </div>
    </div>
  );

  const CategorySection = ({ category }) => {
    const items = products.filter((p) => p.category.toLowerCase() === category);
    if (!items.length) return null;

    const title = category.charAt(0).toUpperCase() + category.slice(1);

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

      {categories.map((cat) => (
        <CategorySection key={cat} category={cat} />
      ))}

      <Footer/>
    </div>
  );
};

export default MenuCart;
