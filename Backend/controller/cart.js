import Cart from "../models/Cart.js";

export const addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    let cartItem = await Cart.findOne({
      user: req.user._id,
      product,
    });

    if (cartItem) {
      cartItem.quantity += quantity || 1;
      await cartItem.save();
    } else {
      cartItem = await Cart.create({
        user: req.user._id,
        product,
        quantity: quantity || 1,
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getCart = async (req, res) => {
  try {
    const cartItems = await Cart.find({ user: req.user._id }).populate("product");
    res.json(cartItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// remove cart item
export const removeCart = async (req, res) => {
  try {
    const { id } = req.params;

    const cartItem = await Cart.findOneAndDelete({
      _id: id,
      user: req.user._id, // ensures user can delete only their own cart item
    });

    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
