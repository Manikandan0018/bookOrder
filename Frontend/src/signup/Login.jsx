// src/pages/Login.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import foodImage from "../image/sandwitch.jpg";
import foodImage2 from "../image/peeza.jpg";
import bgImg from "../image/burger.jpg";
import { Header } from "../Header/Header";

const VITE_BACKEND_URL =import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", VITE_BACKEND_URL);

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Clean handleChange using name attributes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //login
const handleLogin = async () => {
  try {
    const res = await axios.post(`${VITE_BACKEND_URL}api/users/login`, {
      email: formData.email,
      password: formData.password,
    });

    const token = res.data.token;
    localStorage.setItem("token", token);

    // ✅ Fetch user details or use res.data directly
    const user = res.data;

    setMessage("✅ Login successful");

    if (user.role === "admin") {
      navigate("/admin/orders"); // ✅ admin redirect
    } else {
      navigate("/");
    }
  } catch (err) {
    setMessage(err.response?.data?.message || "❌ Login failed");
  }
};



  // ✅ Register
  const handleRegister = async () => {
    try {
      const res = await axios.post(`${VITE_BACKEND_URL}api/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user", // 🔑 only if you want to register admin manually
      });
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Registration successful");
      setIsLogin(true);
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Registration failed");
    }
  };


  return (
    <div
      className="flex items-center justify-center min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <Header />
      <div className="relative w-[850px] h-[500px] bg-white/20 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden flex border border-white/30 z-10">
        {/* Left Image Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={isLogin ? "loginImage" : "signupImage"}
            initial={{ x: isLogin ? -200 : 200, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: isLogin ? -200 : 200, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-1/2 h-full relative"
          >
            <img
              src={isLogin ? foodImage : foodImage2}
              alt="Food"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </AnimatePresence>

        {/* Right Form Section */}
        <div className="w-1/2 h-full flex items-center justify-center bg-white/30 backdrop-blur-xl p-10">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Welcome Back
                </h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg bg-white/60 focus:outline-none"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg bg-white/60 focus:outline-none"
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Sign In
                </button>
                <p className="mt-4 text-sm text-gray-700">
                  Don’t have an account?{" "}
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign Up
                  </button>
                </p>
                {message && (
                  <p className="mt-3 text-sm text-red-500">{message}</p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  Create Account
                </h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg bg-white/60 focus:outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg bg-white/60 focus:outline-none"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mb-3 px-4 py-3 border border-gray-300 rounded-lg bg-white/60 focus:outline-none"
                />
                <button
                  onClick={handleRegister}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign Up
                </button>
                <p className="mt-4 text-sm text-gray-700">
                  Already have an account?{" "}
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>
                </p>
                {message && (
                  <p className="mt-3 text-sm text-red-500">{message}</p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Login;
