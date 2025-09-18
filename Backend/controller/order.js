import Order from "../models/orders.js";
import Cart from "../models/Cart.js";
import Address from "../models/address.js";
import ALLProduct from "../models/Book.js";

// Place single product order

export const placeSingleOrder = async (req, res) => {
  const { productId, quantity, addressId } = req.body;
  try {
    const product = await ALLProduct.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (!addressId)
      return res.status(400).json({ message: "Address is required" });

    const order = new Order({
      user: req.user._id,
      products: [
        {
          product: product._id,
          name: product.title, // ✅ use title instead of name
          imageUrl: product.imageUrl,
          price: product.price,
          quantity,
        },
      ],
      address: addressId,
      totalAmount: product.price * quantity,
      paymentMethod: "COD", // set default payment method
    });

    await order.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Place Single Order Error:", err); // log actual error
    res.status(500).json({ message: err.message });
  }
};


// Place order for full cart
export const placeCartOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const { addressId } = req.body;

    const cartItems = await Cart.find({ user: userId }).populate("product");
    if (cartItems.length === 0) return res.status(400).json({ message: "Cart is empty" });

    const address = await Address.findOne({ _id: addressId, user: userId });
    if (!address) return res.status(400).json({ message: "Address not found" });

    const products = cartItems.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      price: item.product.price,
    }));

    const totalAmount = products.reduce((sum, p) => sum + p.price * p.quantity, 0);

    const order = await Order.create({
      user: userId,
      products,
      address: addressId,
      totalAmount,
      status: "pending", // ✅ lowercase
    });

    // Clear cart
    await Cart.deleteMany({ user: userId });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all orders of a user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }) // <-- filter by user
      .populate("user", "name email")
      .populate({ path: "products.product", select: "title imageUrl" })
      .populate({ path: "address", select: "street city phone pincode" })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("❌ Get Orders Error:", err); // <-- full error
    res
      .status(500)
      .json({ message: "Error fetching orders", error: err.message });
  }
};





// Cancel order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString())
      return res.status(401).json({ message: "Not authorized to cancel this order" });
    if (order.status !== "pending")
      return res.status(400).json({ message: "Only pending orders can be cancelled" });

    order.status = "cancelled";
    await order.save();

    res.json({ message: "Order cancelled successfully", order });
  } catch (error) {
    console.error("Cancel Order Error:", error.message);
    res.status(500).json({ message: "Server error while cancelling order" });
  }
};
