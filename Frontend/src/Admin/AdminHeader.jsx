import React, { useState } from "react";
import { Menu, X } from "lucide-react"; // hamburger & close icons

export const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white shadow relative">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-orange-600">MOZZU</h1>

      {/* Desktop Nav */}
      <nav className="hidden md:flex space-x-6 text-sm font-medium">
        <a href="/" className="hover:text-orange-600">
          Home
        </a>
        <a href="/admin/orders" className="hover:text-orange-600">
          Orders
        </a>
        <a href="/admin/dashboard" className="hover:text-orange-600">
          Dashboard
        </a>
      </nav>

      {/* Mobile Toggle Button */}
      <button
        className="md:hidden text-orange-600 focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Mobile Nav (dropdown) */}
      {menuOpen && (
        <div className="absolute top-full right-0 bg-white shadow-lg rounded-lg w-40 py-4 flex flex-col items-start md:hidden">
          <a
            href="/"
            className="block w-full px-4 py-2 hover:bg-orange-100"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </a>
          <a
            href="/admin/orders"
            className="block w-full px-4 py-2 hover:bg-orange-100"
            onClick={() => setMenuOpen(false)}
          >
            Orders
          </a>
          <a
            href="/admin/dashboard"
            className="block w-full px-4 py-2 hover:bg-orange-100"
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </a>
        </div>
      )}
    </header>
  );
};
