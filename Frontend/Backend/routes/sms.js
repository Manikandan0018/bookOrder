import express from "express";
import { placeOrder } from "../controller/sms.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.post("/place", protect, placeOrder);

export default router;
