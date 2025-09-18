import express from "express";
import { addToCart, getCart, removeCart } from "../controller/cart.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.post("/addCart", protect, addToCart);
router.get("/getCart", protect, getCart);
router.delete("/removeCart/:id", protect, removeCart);  // 👈 remove route

export default router;
