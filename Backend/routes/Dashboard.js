// routes/Dashboard.js
import express from "express";
import { getDashboardStats } from "../controller/Dashboard.js";

const router = express.Router();
router.get("/stats", getDashboardStats);

export default router;
