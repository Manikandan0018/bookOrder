import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminHeader } from "./AdminHeader";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", VITE_BACKEND_URL); 


const ss = import.meta.env.TWILIO_ACCOUNT_SID;
console.log("URL:", ss); 

const AdminOrder = () => {
  const [orders, setOrders] = useState([]);

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${VITE_BACKEND_URL}api/AdminOrder/getAdminOrder`,
        { withCredentials: true }
      );
      const sortedOrders = data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setOrders(sortedOrders);
    } catch (err) {
      toast.error("Error fetching orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update status
  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.put(
        `${VITE_BACKEND_URL}api/AdminOrder/update/${orderId}`,
        { status },
        { withCredentials: true }
      );
      toast.success("Order status updated");
      fetchOrders();
    } catch (err) {
      toast.error("Error updating status");
    }
  };

  // Delete order
  const handleDelete = async (orderId) => {
    try {
      await axios.delete(
        `${VITE_BACKEND_URL}api/AdminOrder/delete/${orderId}`,
        { withCredentials: true }
      );
      toast.success("Order deleted");
      fetchOrders();
    } catch (err) {
      toast.error("Error deleting order");
    }
  };

  // Print order
  const handlePrint = (order) => {
    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>MOZZO Customer</title>
        <style>
          body {
            text-align: center;
            font-family: Arial, sans-serif;
            padding: 20px;
          }
          h1 {
            color: #ff6600;
            margin-bottom: 20px;
          }
          h2 {
            margin: 15px 0 10px;
          }
          p, div {
            margin: 5px 0;
          }
          hr {
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <h1>Happy MOZZO Customer</h1>
        <h2>Order Details</h2>
        <p><strong>Order Number:</strong> ${order.orderNumber || order._id}</p>
        <p><strong>User Details:</strong> ${order.user?.name} | ${
      order.user?.email
    }</p>
        <h3>Products:</h3>
        ${order.products
          .map((p) => `<p>${p.name} x ${p.quantity} - ₹${p.price}</p>`)
          .join("")}
        <h3>Address:</h3>
        <p>${order.address?.street}, ${order.address?.city}, ${
      order.address?.state
    }, ${order.address?.pincode}, Phone: ${order.address?.phone}</p>
        <p><strong>Total:</strong> ₹${order.totalAmount}</p>
        <p><strong>Status:</strong> ${order.status}</p>
        <p><strong>Order Date:</strong> ${new Date(
          order.createdAt
        ).toLocaleString()}</p>
        <hr/>
      </body>
    </html>
  `);

    printWindow.document.close();
    printWindow.print();
  };

  return (
    <>
      <AdminHeader />
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">📦 Manage Orders</h1>

        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-200 text-gray-700 uppercase">
              <tr>
                <th className="p-3">Order No.</th>
                <th className="p-3">User</th>
                <th className="p-3">Products</th>
                <th className="p-3">Address</th>
                <th className="p-3">Total</th>
                <th className="p-3">Status</th>
                <th className="p-3">Order Date</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-b hover:bg-gray-100">
                  <td className="p-3">{order.orderNumber || order._id}</td>
                  <td className="p-3">{order.user?.name}</td>
                  <td className="p-3">
                    {order.products.map((p, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-16 h-16 rounded"
                        />
                        <span>
                          {p.name} x {p.quantity}
                        </span>
                      </div>
                    ))}
                  </td>
                  <td className="p-3">
                    {order.address?.street}, {order.address?.city},{" "}
                    {order.address?.phone}, {order.address?.pincode}
                  </td>
                  <td className="p-3 font-bold">₹{order.totalAmount}</td>
                  <td className="p-3">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      className="border rounded p-1"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="p-3">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="p-3 flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleDelete(order._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handlePrint(order)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminOrder;
