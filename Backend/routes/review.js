import express from "express";
import { addReview, getReviews } from "../controller/review.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.post("/add", protect, addReview);
router.get("/:productId", getReviews);

export default router;
