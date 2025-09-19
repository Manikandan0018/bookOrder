import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Header } from "../Header/Header";
import { Clock, Package, Truck, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import Footer from "../Footer/Footer";

const VITE_BACKEND_URL = "http://localhost:5000/";
const token = localStorage.getItem("token");

const statusSteps = ["pending", "confirmed", "shipped", "delivered"];
const statusConfig = {
  pending: { color: "text-yellow-500", icon: <Clock size={20} /> },
  confirmed: { color: "text-blue-500", icon: <Package size={20} /> },
  shipped: { color: "text-purple-500", icon: <Truck size={20} /> },
  delivered: { color: "text-green-500", icon: <CheckCircle size={20} /> },
  cancelled: { color: "text-red-500", icon: <XCircle size={20} /> },
};

const OrderStatus = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${VITE_BACKEND_URL}api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);



  const cancelOrder = async (orderId, refreshOrders) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/orders/cancel/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order cancelled successfully");
      refreshOrders(); // refresh order list after cancellation
    } catch (err) {
      toast.error(err.response?.data?.message || "Error cancelling order");
    }
  };

  if (!orders.length)
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-4">No orders yet!</h2>
          <p className="text-gray-500 mb-6">
            Your orders will appear here once placed.
          </p>
          <a
            href="/"
            className="px-6 py-3 bg-orange-500 text-white rounded hover:bg-orange-600"
          >
            Go Shopping
          </a>
        </div>
      </>
    );
  
  
  

  return (
    <>
      <Header />
      <div className="max-w-6xl mx-auto p-6 mt-20 space-y-12">
        <h1 className="text-4xl font-bold mb-10 text-center">📦 My Orders</h1>

        {orders.map((order) => {
          const currentIndex = statusSteps.indexOf(order.status);
          const progressPercent =
            (currentIndex / (statusSteps.length - 1)) * 100;

          return (
            <div
              key={order._id}
              className="bg-white shadow-2xl rounded-2xl p-6 border hover:shadow-3xl transition relative overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b pb-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">
                    Order #:{" "}
                    <span className="font-medium">{order.orderNumber}</span>
                  </p>
                  <p className="text-sm text-gray-500">
                    Placed on:{" "}
                    <span className="font-medium">
                      {new Date(order.createdAt).toLocaleString()}
                    </span>
                  </p>
                </div>
                <span
                  className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${
                    statusConfig[order.status]?.color
                  } bg-gray-100 font-medium mt-2 md:mt-0`}
                >
                  {statusConfig[order.status]?.icon}{" "}
                  {order.status.toUpperCase()}
                </span>
              </div>

              {/* Products */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                {order.products.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition shadow-sm"
                  >
                    <img
                      src={p.product?.imageUrl}
                      alt={p.product?.name}
                      className="w-20 h-20 rounded-lg object-cover shadow-md"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-gray-800">
                        {p.product?.title}
                      </span>
                      <p className="text-sm text-gray-500">Qty: {p.quantity}</p>
                      <p className="font-semibold text-yellow-500">
                        ₹{p.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Timeline */}
              <div className="relative flex items-center mb-6">
                <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-200 rounded"></div>

                {/* Trail fill */}
                <motion.div
                  className="absolute top-1/2 left-0 h-2 bg-orange-500 rounded"
                  style={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 1 }}
                />

                {/* Dot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-yellow-400 rounded-full border-2 border-white shadow-lg"
                  animate={{ left: `${progressPercent}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />

                {/* Step icons */}
                {statusSteps.map((step, idx) => (
                  <div
                    key={step}
                    className="absolute top-1/2 -translate-y-1/2 transform -translate-x-1/2 flex flex-col items-center"
                    style={{
                      left: `${(idx / (statusSteps.length - 1)) * 100}%`,
                    }}
                  >
                    <div
                      className={`w-10 h-10 flex items-center justify-center rounded-full border-2 ${
                        idx <= currentIndex
                          ? "bg-green-100 border-green-500"
                          : "bg-gray-100 border-gray-300"
                      }`}
                    >
                      {statusConfig[step]?.icon}
                    </div>
                    <span className="text-xs mt-1 text-center capitalize">
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <p className="text-gray-600">
                  Payment:{" "}
                  <span className="font-medium">{order.paymentMethod}</span>
                </p>
                <p className="font-bold text-xl text-gray-900">
                  Total: ₹{order.totalAmount}
                </p>
              </div>
              {/* Cancel Button */}

              {order.status === "pending" && (
                <div className="mt-5 text-right">
                  <button
                    onClick={() => cancelOrder(order._id, fetchOrders)}
                    className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shadow-md"
                  >
                    Cancel Order
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Footer/>
    </>
  );
};

export default OrderStatus;
