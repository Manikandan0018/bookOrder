import twilio from "twilio";
import Order from "../models/orders.js";

// Initialize Twilio client
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

export const placeOrder = async (req, res) => {
  try {
    const { orderId } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId is required" });
    }

    // Fetch order with user and address populated
    const order = await Order.findById(orderId)
      .populate("user")
      .populate("address");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Get recipient phone number
    const phoneNumber = order.address?.phone || order.user?.phone;
    if (!phoneNumber) {
      return res.status(400).json({ message: "User phone number not found" });
    }

    // Twilio "from" number
    const fromNumber = process.env.TWILIO_PHONE_NUMBER?.trim();
    if (!fromNumber) {
      return res.status(500).json({ message: "TWILIO_PHONE_NUMBER not set" });
    }

    // Ensure recipient number is in E.164 format
    const toNumber = phoneNumber.startsWith("+")
      ? phoneNumber
      : `+91${phoneNumber}`;

    // Send SMS
    const message = await client.messages.create({
      from: fromNumber,
      to: toNumber,
      body: `Hi ${order.user.name}, your order #${orderId} has been placed!`,
    });

    return res.json({
      message: "SMS sent successfully",
      sid: message.sid,
    });
  } catch (err) {
    console.error("SMS Error:", err);
    return res
      .status(500)
      .json({ message: "Failed to send SMS", error: err.message });
  }
};
