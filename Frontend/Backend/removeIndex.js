import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/test"; // replace 'test' with your DB name

const run = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const db = mongoose.connection.db;

    // Drop the index
    await db.collection("books").dropIndex("isbn_1");
    console.log("Index 'isbn_1' removed successfully");

    process.exit(0);
  } catch (err) {
    console.error("Error removing index:", err.message);
    process.exit(1);
  }
};

run();
