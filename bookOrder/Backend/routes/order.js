import express from "express";
import { placeSingleOrder, placeCartOrder, getMyOrders,cancelOrder } from "../controller/order.js";
import { protect } from "../middleware/middleware.js"; // JWT auth

const router = express.Router();

router.post("/single", protect, placeSingleOrder);
router.post("/cart", protect, placeCartOrder);
router.get("/my", protect, getMyOrders);
router.delete("/cancel/:id", protect, cancelOrder);

export default router;
