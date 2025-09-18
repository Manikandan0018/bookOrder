// src/pages/ShopDetails.jsx
import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaHeart,
  FaRegHeart,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
} from "react-icons/fa";
import { MdOutlineRemove, MdOutlineAddShoppingCart } from "react-icons/md";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "../Header/Header";
import Address from "../Adress/Address";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Review from "../review/Review";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

console.log("Backend URL:", VITE_BACKEND_URL);

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  const [quantity, setQuantity] = useState({});
  const [wishlist, setWishlist] = useState({});

  // Fetch current address
  const { data: currentAddress, refetch: refetchAddress } = useQuery({
    queryKey: ["currentAddress"],
    queryFn: async () => {
      if (!token) return null;
      const res = await axios.get(`${VITE_BACKEND_URL}api/address/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.length > 0 ? res.data[res.data.length - 1] : null;
    },
  });

  // Fetch cart
  const { data: cartData = [], isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!token) return [];
      const res = await axios.get(`${VITE_BACKEND_URL}api/cart/getCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  useEffect(() => {
    if (Object.keys(quantity).length === 0 && cartData.length > 0) {
      const initialQuantities = {};
      cartData.forEach((item) => {
        initialQuantities[item.product._id] = item.quantity || 1;
      });
      setQuantity(initialQuantities);
    }
  }, [cartData]);

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (productId) => {
      if (!token) throw new Error("Please login to add cart.");
      if (!currentAddress)
        throw new Error("Please add address first before ordering.");
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}api/cart/addCart`,
        { product: productId, quantity: quantity[productId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: (err) => alert(err.message),
  });

  // Add to favorites mutation
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

  // Remove cart item mutation
  const removeCartMutation = useMutation({
    mutationFn: async (cartItemId) => {
      if (!token) throw new Error("Login required");
      await axios.delete(
        `${VITE_BACKEND_URL}api/cart/removeCart/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
    onError: (err) => alert(err.message),
  });

  // Handle single order
  const handleOrder = async (productId, cartItemId) => {
    try {
      if (!token) throw new Error("Please login to order.");
      if (!currentAddress) throw new Error("Please add address first.");
      // Place order
      const orderRes = await axios.post(
        `${VITE_BACKEND_URL}api/orders/single`,
        {
          productId,
          quantity: quantity[productId],
          addressId: currentAddress._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Remove cart item
      await axios.delete(
        `${VITE_BACKEND_URL}api/cart/removeCart/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("✅ Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  if (cartLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="relative font-sans text-gray-800 min-h-screen">
      <Header />

      {cartData.length === 0 ? (
        <div className="relative w-full min-h-[70vh] flex flex-col items-center justify-center text-center px-4 mt-20">
          <img
            src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80"
            alt="empty cart"
            className="w-full max-w-md object-cover rounded-lg shadow-lg mb-8"
          />
          <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 text-base md:text-lg mb-4">
            Looks like you haven't added any items yet.
          </p>
          <button
            onClick={() => navigate("/")}
            className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition"
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="relative z-10 max-w-7xl mx-auto px-4 mt-20 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Address Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative backdrop-blur-lg bg-white/90 rounded-xl shadow-lg p-6 border border-white/30">
                <h2 className="text-lg font-bold mb-4 text-gray-800">
                  Delivery Address
                </h2>
                {/* Pass refetchAddress to Address */}
                <Address onAddressSaved={refetchAddress} />
              </div>
            </div>
          </div>

          {/* Cart Products */}
          <div className="lg:col-span-2 space-y-8 pb-12">
            {cartData.map(({ product, _id }) => (
              <section
                key={product._id}
                className="grid md:grid-cols-2 gap-10 bg-white/90 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-white/30 hover:shadow-2xl transition"
              >
                {/* Product Image */}
                <div className="overflow-hidden rounded-xl">
                  <img
                    src={
                      product.imageUrl ||
                      "https://via.placeholder.com/500x350.png"
                    }
                    alt={product.name}
                    className="rounded-xl shadow-md w-full transform hover:scale-110 transition duration-500"
                  />
                </div>

                {/* Product Info */}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                  <div className="flex items-center mb-3">
                    {/* <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-500">
                      (4.8 Review)
                    </span>
                    <span className="ml-6 text-sm text-orange-600 cursor-pointer hover:underline">
                      Write a Review
                    </span> */}

                    <Review productId={product._id} />
                    
                  </div>
                  <p className="text-lg font-semibold text-orange-600">
                    ₹{product.price}
                  </p>
                  <p className="text-sm text-green-600 font-medium mt-1">
                    Availability: In Stock
                  </p>
                  <p className="text-gray-600 mt-4">{product.description}</p>

                  {/* Quantity & Actions */}
                  <div className="flex items-center flex-wrap gap-4 mt-6">
                    <div className="flex items-center border rounded-full bg-white shadow-sm overflow-hidden">
                      <button
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() =>
                          setQuantity((prev) => ({
                            ...prev,
                            [product._id]: Math.max(1, prev[product._id] - 1),
                          }))
                        }
                      >
                        <MdOutlineRemove />
                      </button>
                      <span className="px-4 font-medium">
                        {quantity[product._id]}
                      </span>
                      <button
                        className="px-4 py-2 hover:bg-gray-100"
                        onClick={() =>
                          setQuantity((prev) => ({
                            ...prev,
                            [product._id]: prev[product._id] + 1,
                          }))
                        }
                      >
                        +
                      </button>
                    </div>

                    {/* Order button only enabled if currentAddress exists */}
                    <button
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full shadow hover:shadow-lg hover:scale-105 transition disabled:opacity-50"
                      onClick={() => handleOrder(product._id, _id)}
                      disabled={!currentAddress}
                    >
                      <MdOutlineAddShoppingCart className="mr-2" /> Order Now
                    </button>

                    {/* Wishlist */}
                    <button
                      onClick={() => {
                        setWishlist((prev) => ({
                          ...prev,
                          [product._id]: !prev[product._id],
                        }));
                        addToFavorite.mutate(product._id);
                      }}
                      className="flex items-center px-6 py-3 border rounded-full text-orange-600 border-orange-600 hover:bg-orange-50 transition"
                    >
                      {wishlist[product._id] ? (
                        <FaHeart className="mr-2 text-red-500" />
                      ) : (
                        <FaRegHeart className="mr-2" />
                      )}
                      {wishlist[product._id] ? "Wishlisted" : "Add to Wishlist"}
                    </button>
                  </div>

                  {!currentAddress && (
                    <p className="text-red-600 mt-2 text-sm">
                      ⚠ Please add address before ordering
                    </p>
                  )}
                </div>
              </section>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
