import Product from "../models/AllProduct.js";
import cloudinary from "../config/cloudinary.js";


// Helper to wrap Cloudinary upload_stream in a Promise
const streamUpload = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "food-products" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(buffer);
  });


  
export const addProduct = async (req, res) => {
  try {
    let imageUrl = "";
    let imageId = "";

    if (req.file) {
      // Wrap upload_stream in a Promise
      const streamUpload = (buffer) =>
        new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: "food-products" },
            (error, result) => {
              if (error) return reject(error);
              resolve(result);
            }
          );
          stream.end(buffer);
        });

      const result = await streamUpload(req.file.buffer);
      imageUrl = result.secure_url;
      imageId = result.public_id;
    }

    const newProduct = new Product({
      ...req.body,
      imageUrl,
      imageId,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error("Add product error:", err); // check your backend console
    res.status(500).json({ error: err.message });
  }
};



// ✅ Get All Products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update Product
// ✅ Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = { ...req.body };

    // Convert price to Number if it exists
    if (updatedData.price) updatedData.price = Number(updatedData.price);

    if (req.file) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: "Product not found" });

      // Delete old image from Cloudinary
      if (product.imageId) {
        await cloudinary.uploader.destroy(product.imageId);
      }

      // Upload new image
      const result = await streamUpload(req.file.buffer);
      updatedData.imageUrl = result.secure_url;
      updatedData.imageId = result.public_id;
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });
    res.json(updatedProduct);
  } catch (err) {
    console.error("Update product error:", err); // check your backend console
    res.status(500).json({ error: err.message });
  }
};

// ✅ Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    // Delete image from Cloudinary
    if (product.imageId) {
      await cloudinary.uploader.destroy(product.imageId);
    }

    await product.deleteOne();
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
