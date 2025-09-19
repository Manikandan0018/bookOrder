import express from "express";
import { addFavorite, getFavorites, removeFavorite } from "../controller/likedItems.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.post("/add", protect, addFavorite);
router.get("/get", protect, getFavorites);
router.delete("/remove/:id", protect, removeFavorite);

export default router;
