import express from "express";
import { saveDetectedAddress , getUserAddresses, saveManualAddress } from "../controller/address.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.post("/save-auto", protect,saveDetectedAddress );   // 📍 GPS-based
router.post("/save-manual", protect, saveManualAddress); // ✍️ Manual fields
router.get("/my", protect, getUserAddresses);

export default router;
