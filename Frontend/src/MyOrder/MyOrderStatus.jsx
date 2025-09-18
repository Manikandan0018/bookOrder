import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Header } from "../Header/Header";
import Footer from "../Footer/Footer";

const VITE_BACKEND_URL = "http://localhost:5000/";

const MyOrderStatus = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { product, quantity } = state || {};

  const [selectedAddress, setSelectedAddress] = useState(null);

  // Fetch user addresses
  const { data: addresses = [] } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${VITE_BACKEND_URL}api/address/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // Default to last saved address
  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses[addresses.length - 1]);
    }
  }, [addresses]);

  if (!product)
    return (
      <div className="text-center mt-20">
        <h2 className="text-xl font-bold">No product selected!</h2>
        <button
          onClick={() => navigate("/cart")}
          className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Go to Cart
        </button>
      </div>
    );

  const totalAmount = product.price * quantity;

  // Handle Buy Now (COD)
  const handleBuy = async () => {
    if (!selectedAddress) {
      toast.error("Please select an address");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        `${VITE_BACKEND_URL}api/orders/single`,
        {
          productId: product._id,
          quantity,
          addressId: selectedAddress._id,
          paymentMethod: "COD",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Order placed successfully!");
      navigate("/myOrder"); // redirect to orders page
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
      toast.error(err.response?.data?.message || "Failed to place order");
    }
  };

  return (
    <>
      <Header />

      <div className="max-w-4xl mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Confirm Your Order</h2>

        {/* Product Info */}
        <div className="flex gap-6 mb-6">
          <img
            src={product.imageUrl || "https://via.placeholder.com/200x150"}
            alt={product.title}
            className="w-40 h-40 object-cover rounded-lg shadow"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{product.title}</h3>
            <p className="text-gray-500">Author: {product.author}</p>
            <p className="text-gray-500">Category: {product.category}</p>
            <p className="text-gray-700 font-semibold">Quantity: {quantity}</p>
            <p className="text-orange-600 font-bold">Total: ₹{totalAmount}</p>
          </div>
        </div>

        {/* Address Selection */}
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Select Delivery Address</h3>
          {addresses.length === 0 ? (
            <p className="text-red-500">
              No address found! Please add an address in your profile.
            </p>
          ) : (
            addresses.map((addr) => (
              <div key={addr._id} className="flex items-center gap-2 mb-2">
                <input
                  type="radio"
                  name="address"
                  value={addr._id}
                  checked={selectedAddress?._id === addr._id}
                  onChange={() => setSelectedAddress(addr)}
                />
                <span>
                  {addr.street}, {addr.city}, {addr.state} - {addr.pincode} (
                  {addr.name}, {addr.phone})
                </span>
              </div>
            ))
          )}
        </div>

        {/* Buy Button */}
        <button
          onClick={handleBuy}
          className="mt-4 px-6 py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Buy Now (Cash on Delivery)
        </button>
      </div>
      <Footer/>
    </>
  );
};

export default MyOrderStatus;
