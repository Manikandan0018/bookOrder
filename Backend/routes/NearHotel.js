import express from "express";
import { getNearbyRestaurants } from "../controller/NearHotel.js";

const router = express.Router();

router.get("/nearby", getNearbyRestaurants);

export default router;
