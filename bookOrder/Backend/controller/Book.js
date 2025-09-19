import Book from "../models/Book.js";
import cloudinary from "../config/cloudinary.js";

// ✅ Helper to wrap Cloudinary upload_stream in a Promise
const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "book-store" }, // 📂 new folder for books
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });

// ✅ Add Book
export const addBook = async (req, res) => {
  try {
    let imageUrl = "";
    let imageId = "";

    if (req.file) {
      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
      imageId = result.public_id;
    }

    const newBook = new Book({
      ...req.body,
      imageUrl,
      imageId,
    });

    const savedBook = await newBook.save();
    res.status(201).json(savedBook);
  } catch (err) {
    console.error("Add book error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get All Books
export const getBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Book
export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    if (updatedData.price) updatedData.price = Number(updatedData.price);

    if (req.file) {
      const book = await Book.findById(id);
      if (!book) return res.status(404).json({ message: "Book not found" });

      if (book.imageId) {
        await cloudinary.uploader.destroy(book.imageId);
      }

      const result = await streamUpload(req.file.buffer);
      updatedData.imageUrl = result.secure_url;
      updatedData.imageId = result.public_id;
    }

    const updatedBook = await Book.findByIdAndUpdate(id, updatedData, {
      new: true,
    });
    res.json(updatedBook);
  } catch (err) {
    console.error("Update book error:", err);
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Book
export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.imageId) {
      await cloudinary.uploader.destroy(book.imageId);
    }

    await book.deleteOne();
    res.json({ message: "Book deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
