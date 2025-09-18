import Order from "../models/orders.js";
import User from "../models/userLogin.js";
import ALLProduct from "../models/AllProduct.js";

// ✅ Create Order
export const createOrder = async (req, res) => {
  try {
    const { products, address, totalAmount, paymentMethod } = req.body;
    const order = await Order.create({
      user: req.user._id,
      products,
      address,
      totalAmount,
      paymentMethod,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: "Error creating order", error: err.message });
  }
};

// ✅ Get All Orders (Admin)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name image price")
      .populate("address");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Error fetching orders", error: err.message });
  }
};

// ✅ Update Order Status
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: "Error updating status", error: err.message });
  }
};

// ✅ Delete Order
export const deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.orderId);
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting order", error: err.message });
  }
};
