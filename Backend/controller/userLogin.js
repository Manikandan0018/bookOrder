import jwt from "jsonwebtoken";
import User from "../models/userLogin.js";
import dotenv from "dotenv";

dotenv.config();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// Register
 export const registerUser = async (req, res) => {
   const { name, email, password, role } = req.body; // ✅ include role

   try {
     const userExists = await User.findOne({ email });
     if (userExists) {
       return res.status(400).json({ message: "User already exists" });
     }

     const user = await User.create({
       name,
       email,
       password,
       role: role || "user", // ✅ default user if role not passed
     });

     res.status(201).json({
       _id: user._id,
       name: user.name,
       email: user.email,
       role: user.role, // ✅ return role to frontend
       token: generateToken(user._id),
     });
   } catch (error) {
     res.status(500).json({ message: "Server error" });
   }
 };


// Login
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      });
     

    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// Get profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
