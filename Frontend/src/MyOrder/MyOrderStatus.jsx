import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Header } from "../Header/Header";
import {
  Clock,
  CheckCircle,
  Truck,
  XCircle,
  Package,
} from "lucide-react";

const VITE_BACKEND_URL =import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", VITE_BACKEND_URL);

const statusSteps = ["pending", "confirmed", "shipped", "delivered"];

const statusConfig = {
  pending: { color: "text-yellow-600", icon: <Clock size={18} /> },
  confirmed: { color: "text-blue-600", icon: <Package size={18} /> },
  shipped: { color: "text-purple-600", icon: <Truck size={18} /> },
  delivered: { color: "text-green-600", icon: <CheckCircle size={18} /> },
  cancelled: { color: "text-red-600", icon: <XCircle size={18} /> },
};

const token = localStorage.getItem("token");

const MyOrderStatus = () => {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(`${VITE_BACKEND_URL}api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load orders");
    }
  };

  const cancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    try {
      await axios.delete(`${VITE_BACKEND_URL}api/orders/cancel/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error cancelling order");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Header />

      {/* Background with overlay */}
      <div
        className="min-h-screen bg-fixed bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1500&q=80')",
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-18">
          <h1 className="text-4xl font-extrabold text-white mb-10 text-center drop-shadow-lg">
            📦 My Orders
          </h1>

          {/* Empty State */}
          {orders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center text-white">
              <img
                src="https://illustrations.popsy.co/gray/shopping-bag.svg"
                alt="No Orders"
                className="w-44 mb-6 opacity-90"
              />
              <p className="text-lg font-medium opacity-90">
                You haven’t placed any orders yet.
              </p>
              <a
                href="/"
                className="mt-6 px-6 py-3 bg-orange-500 text-white rounded-full font-semibold hover:bg-orange-600 transition shadow-lg"
              >
                Start Ordering
              </a>
            </div>
          ) : (
            <div className="space-y-10">
              {orders.map((order) => {
                const currentIndex = statusSteps.indexOf(order.status);

                return (
                  <div
                    key={order._id}
                    className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/30 hover:shadow-2xl transition"
                  >
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between border-b pb-4 mb-6">
                      <p className="text-sm text-gray-500">
                        Order ID:{" "}
                        <span className="font-medium">{order.orderNumber}</span>
                      </p>
                      <span className="mt-2 md:mt-0 inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
                        {statusConfig[order.status]?.icon}
                        <span className="capitalize">{order.status}</span>
                      </span>
                    </div>

                    {/* Progress Tracker */}
                    <div className="relative flex justify-between items-center mb-6">
                      {statusSteps.map((step, idx) => (
                        <div
                          key={step}
                          className={`flex flex-col items-center text-xs sm:text-sm ${
                            idx <= currentIndex
                              ? statusConfig[step]?.color
                              : "text-gray-400"
                          }`}
                        >
                          <div
                            className={`w-9 h-9 flex items-center justify-center rounded-full border-2 transition-all duration-500 ${
                              idx <= currentIndex
                                ? "border-orange-500 bg-orange-100"
                                : "border-gray-300 bg-white"
                            }`}
                          >
                            {statusConfig[step]?.icon}
                          </div>
                          <span className="mt-2 capitalize">{step}</span>
                        </div>
                      ))}

                      {/* Progress Line */}
                      <div className="absolute top-4 left-0 w-full h-2 bg-gray-200 -z-10">
                        <div
                          className="h-2 bg-orange-500 transition-all duration-700"
                          style={{
                            width: `${(currentIndex / (statusSteps.length - 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Products */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      {order.products.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-4 bg-gray-50/80 p-3 rounded-xl hover:bg-gray-100 transition"
                        >
                          <img
                            src={p.product?.imageUrl}
                            alt={p.product?.name}
                            className="w-20 h-20 rounded-lg object-cover shadow-md"
                          />
                          <div className="flex-1">
                            <p className="font-medium text-gray-800">
                              {p.product?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Qty: {p.quantity}
                            </p>
                            <p className="font-semibold text-orange-600">
                              ₹{p.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Summary */}
                    <div className="mt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                      <p className="text-gray-600">
                        Payment:{" "}
                        <span className="font-medium">
                          {order.paymentMethod}
                        </span>
                      </p>
                      <p className="font-bold text-xl text-gray-900">
                        Total: ₹{order.totalAmount}
                      </p>
                    </div>

                    {/* Cancel */}
                    {order.status === "pending" && (
                      <div className="mt-5 text-right">
                        <button
                          onClick={() => cancelOrder(order._id)}
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
          )}
        </div>
      </div>
    </>
  );
};

export default MyOrderStatus;
