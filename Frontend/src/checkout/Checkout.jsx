import React from "react";
import axios from "axios";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Header } from "../Header/Header";
import { FaRupeeSign, FaShoppingBag } from "react-icons/fa";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", VITE_BACKEND_URL);

const Checkout = () => {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();

  // Fetch orders
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["myOrders"],
    queryFn: async () => {
      const res = await axios.get(`${VITE_BACKEND_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  const cancelOrderMutation = useMutation({
    mutationFn: async (orderId) => {
      return axios.delete(`${VITE_BACKEND_URL}api/orders/cancel/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onMutate: async (orderId) => {
      await queryClient.cancelQueries(["myOrders"]);
      const previousOrders = queryClient.getQueryData(["myOrders"]);
      queryClient.setQueryData(["myOrders"], (old) =>
        old.map((order) =>
          order._id === orderId ? { ...order, status: "cancelled" } : order
        )
      );
      return { previousOrders };
    },
    onError: (_err, _orderId, context) => {
      queryClient.setQueryData(["myOrders"], context.previousOrders);
    },
    onSettled: () => {
      queryClient.invalidateQueries(["myOrders"]);
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Loading your checkout...
      </div>
    );

  const latestOrder = orders.length > 0 ? orders[0] : null;

  return (
    <>
          <Header />

    <div className="relative min-h-screen bg-gray-50">

      {/* Background Food Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1600&q=80"
          alt="food background"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
      </div>

      {/* Checkout Header */}
      <div className="relative z-10 text-white py-16 text-center">
        <h1 className="text-4xl font-extrabold drop-shadow-lg flex items-center justify-center gap-2">
          <FaShoppingBag /> Checkout
        </h1>
        <p className="mt-2 text-gray-200">
          Review your order & complete the checkout
        </p>
      </div>

      {/* Checkout Card */}
      <div className="relative z-10 container mx-auto px-6 py-10 flex justify-center">
        <div className="bg-white/90 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full md:w-2/3 lg:w-1/2 border border-white/30">
          <h2 className="text-xl font-semibold mb-6 text-gray-800 flex items-center gap-2">
            <FaShoppingBag className="text-orange-500" /> Order Summary
          </h2>

          {latestOrder ? (
            <>
              {/* Products */}
              <div className="divide-y">
                {latestOrder.products.map((p) => (
                  <div
                    key={p.product._id}
                    className="flex items-center justify-between py-4"
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={p.product.imageUrl}
                        alt={p.product.name}
                        className="w-20 h-20 rounded-lg object-cover border shadow-sm"
                      />
                      <div>
                        <p className="font-medium text-gray-800">
                          {p.product.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Qty: {p.quantity}
                        </p>
                      </div>
                    </div>
                    <p className="text-orange-600 font-semibold flex items-center gap-1">
                      <FaRupeeSign size={14} />
                      {(p.price * p.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Price Details */}
              <div className="mt-6 space-y-3 text-sm text-gray-700">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="flex items-center gap-1">
                    <FaRupeeSign size={12} />
                    {latestOrder.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="flex items-center gap-1">
                    <FaRupeeSign size={12} />20.00
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg text-gray-900">
                  <span>Total</span>
                  <span className="flex items-center gap-1">
                    <FaRupeeSign size={14} />
                    {(latestOrder.totalAmount + 20).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Cancel Button */}
              <div className="mt-8">
                <button
                  onClick={() => cancelOrderMutation.mutate(latestOrder._id)}
                  disabled={
                    cancelOrderMutation.isLoading ||
                    latestOrder.status !== "pending"
                  }
                  className={`w-full py-3 rounded-lg font-medium text-white transition ${
                    latestOrder.status === "cancelled"
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 disabled:opacity-50"
                  }`}
                >
                  {latestOrder.status === "cancelled"
                    ? "Order Cancelled"
                    : cancelOrderMutation.isLoading
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-center py-10 text-gray-500">
              <p>No recent order found.</p>
              <a
                href="/"
                className="inline-block mt-4 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
              >
                Browse Menu
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default Checkout;
