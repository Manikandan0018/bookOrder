// src/Header/Header.jsx
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { FiShoppingCart, FiMenu, FiX } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";

const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", VITE_BACKEND_URL);

export const Header = () => {
  const token = localStorage.getItem("token");
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  // ✅ Fetch user profile if logged in
  const { data: user } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!token) return null;
      const res = await axios.get(`${VITE_BACKEND_URL}api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  // ✅ Fetch cart
  const { data: cartData = [] } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!token) return [];
      const res = await axios.get(`${VITE_BACKEND_URL}api/cart/getCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    enabled: !!token,
  });

  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <h1
          className="text-2xl font-extrabold text-orange-600 tracking-wide cursor-pointer"
          onClick={() => navigate("/")}
        >
          ReadStore
        </h1>

        {/* Desktop Nav */}
        {!isAuthPage && (
          <nav className="hidden lg:flex space-x-6 font-medium text-gray-700">
            <a href="/menu" className="hover:text-orange-600 transition">
              BookCategory
            </a>
           
            <a href="/favorites" className="hover:text-orange-600 transition">
              Favorites
            </a>
            <a href="/my-orders" className="hover:text-orange-600 transition">
              My Orders
            </a>
          </nav>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {!isAuthPage &&
            (!token ? (
              <button
                onClick={() => navigate("/login")}
                className="hidden lg:block px-4 py-2 border border-orange-600 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition"
              >
                Log In
              </button>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                <span className="font-medium text-gray-800">
                  {user?.name || "User"}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-600 rounded-full hover:text-black transition"
                >
                  Logout
                </button>
              </div>
            ))}

          {/* Cart */}
          {!isAuthPage && (
            <a href="/cart" className="relative hidden lg:block">
              <FiShoppingCart className="text-2xl text-gray-800 hover:text-orange-600 transition" />
              {cartData.length > 0 && (
                <span className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full shadow">
                  {cartData.length}
                </span>
              )}
            </a>
          )}

          {/* Mobile/Tablet Toggle */}
          {!isAuthPage && (
            <button
              className="lg:hidden ml-1.5 text-2xl text-gray-800"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <FiX /> : <FiMenu />}
            </button>
          )}
        </div>
      </div>

      {/* Overlay + Mobile Menu */}
      {menuOpen && !isAuthPage && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setMenuOpen(false)}
          ></div>

          {/* Sidebar */}
          <div className="lg:hidden fixed top-0 right-0 w-3/4 h-full  bg-white shadow-lg z-55  transform transition-transform duration-300 ease-in-out">
            <button
              className="absolute top-4 right-4 text-2xl"
              onClick={() => setMenuOpen(false)}
            >
              <FiX />
            </button>

            <nav className="mt-12 px-4 space-y-4 bg-white font-medium text-gray-700">
              <a
                href="/menu"
                className="block hover:text-orange-600"
                onClick={() => setMenuOpen(false)}
              >
                Menu
              </a>
              <a
                href="/cart"
                className="block hover:text-orange-600"
                onClick={() => setMenuOpen(false)}
              >
                Cart
              </a>
              <a
                href="/favorites"
                className="block hover:text-orange-600"
                onClick={() => setMenuOpen(false)}
              >
                Favorites
              </a>
              <a
                href="/my-orders"
                className="block hover:text-orange-600"
                onClick={() => setMenuOpen(false)}
              >
                My Orders
              </a>
              <div className=" bg-white">
                {!token ? (
                  <button
                    onClick={() => {
                      navigate("/login");
                      setMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 border border-orange-600 text-orange-600 rounded-full hover:bg-orange-600 hover:text-white transition"
                  >
                    Log In
                  </button>
                ) : (
                  <div className="flex justify-between items-center mt-3">
                    <span className="font-medium text-gray-800">
                      {user?.name}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 border mb-2 border-red-600 text-red-600 rounded-full hover:bg-red-600 hover:text-black transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* Auth buttons */}
          </div>
        </>
      )}
    </header>
  );
};
