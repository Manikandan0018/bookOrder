// src/pages/Login.jsx
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { Header } from "../Header/Header";
import Footer from "../Footer/Footer";

// ✅ Environment variable
const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${VITE_BACKEND_URL}api/users/login`, {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful");

      if (res.data.role === "admin") navigate("/admin/orders");
      else navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post(`${VITE_BACKEND_URL}api/users/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: "user",
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
    <div className="min-h-screen mt-12 flex flex-col bg-gradient-to-br from-gray-100 to-gray-200">
      <Header />

      <div className="flex flex-1 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8"
        >
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                  Welcome Back 👋
                </h2>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleLogin}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                >
                  Sign In
                </button>
                <p className="mt-4 text-sm text-gray-700 text-center">
                  Don’t have an account?{" "}
                  <button
                    className="text-blue-600 font-medium hover:underline"
                    onClick={() => setIsLogin(false)}
                  >
                    Sign Up
                  </button>
                </p>
                {message && (
                  <p className="mt-3 text-sm text-red-500 text-center">
                    {message}
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 40 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                  Create Account ✨
                </h2>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
                <button
                  onClick={handleRegister}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
                >
                  Sign Up
                </button>
                <p className="mt-4 text-sm text-gray-700 text-center">
                  Already have an account?{" "}
                  <button
                    className="text-green-600 font-medium hover:underline"
                    onClick={() => setIsLogin(true)}
                  >
                    Login
                  </button>
                </p>
                {message && (
                  <p className="mt-3 text-sm text-red-500 text-center">
                    {message}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Login;
