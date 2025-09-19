import express from "express";
import { registerUser, loginUser, getUserProfile } from "../controller/userLogin.js";
import { protect } from "../middleware/middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

export default router;