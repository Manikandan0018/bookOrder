import express from "express";
import upload from "../middleware/upload.js";
import {
  addBook,
  getBooks,
  updateBook,
  deleteBook,
} from "../controller/Book.js";

const router = express.Router();

router.post("/addBook", upload.single("image"), addBook);
router.get("/getBooks", getBooks);
router.put("/updateBook/:id", upload.single("image"), updateBook);
router.delete("/deleteBook/:id", deleteBook);

export default router;
