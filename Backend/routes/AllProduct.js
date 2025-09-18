import express from "express";
import upload from "../middleware/upload.js";
import { addProduct, getProducts, updateProduct, deleteProduct } from "../controller/AllProduct.js";

const router = express.Router();

router.post("/addProduct", upload.single("image"), addProduct);
router.get("/getProduct", getProducts);
router.put("/updateProduct/:id", upload.single("image"), updateProduct);
router.delete("/deleteProduct/:id", deleteProduct);

export default router;
