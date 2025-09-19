import express from "express";
import { createOrder, getAllOrders, updateOrderStatus, deleteOrder } from "../controller/adminOrder.js";
// import { protect } from "../middleware/middleware.js";

const router = express.Router();

// User
router.post("/", createOrder);

// Admin
router.get("/getAdminOrder",  getAllOrders);
router.put("/update/:orderId",  updateOrderStatus);
router.delete("/delete/:orderId", deleteOrder);

export default router;
