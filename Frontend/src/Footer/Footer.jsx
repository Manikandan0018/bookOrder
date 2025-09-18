import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaBook,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-200 relative pt-16">
      {/* Top section */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo & Description */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2">
            <FaBook className="text-orange-500 text-3xl animate-bounce" />
            <span className="text-2xl font-bold text-white">BookZone</span>
          </div>
          <p className="text-gray-400 text-sm">
            Your one-stop shop for bestsellers, classics, and new arrivals.
            Discover, order, and enjoy your favorite books from anywhere.
          </p>

          {/* Social icons */}
          <div className="flex space-x-4 mt-2">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
              (Icon, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="p-3 bg-gray-800 rounded-full hover:bg-orange-500 hover:text-white transition transform hover:scale-110"
                >
                  <Icon />
                </a>
              )
            )}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-orange-500 transition cursor-pointer">
              Home
            </li>
            <li className="hover:text-orange-500 transition cursor-pointer">
              Shop
            </li>
            <li className="hover:text-orange-500 transition cursor-pointer">
              Categories
            </li>
            <li className="hover:text-orange-500 transition cursor-pointer">
              About Us
            </li>
            <li className="hover:text-orange-500 transition cursor-pointer">
              Contact
            </li>
          </ul>
        </div>

        {/* Customer Service */}
        <div>
          <h3 className="text-white font-semibold mb-4">Customer Service</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-orange-500 transition cursor-pointer">
              FAQ
            </li>
            <li className="hover:text-orange-500 transition cursor-pointer">
              Shipping & Returns
            </li>
            <li className="hover:text-orange-500 transition cursor-pointer">
              Privacy Policy
            </li>
            <li className="hover:text-orange-500 transition cursor-pointer">
              Terms & Conditions
            </li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="text-white font-semibold mb-4">Newsletter</h3>
          <p className="text-gray-400 text-sm mb-4">
            Subscribe for latest book arrivals, discounts, and updates.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button className="px-4 py-2 bg-orange-500 text-white rounded-r-lg hover:bg-orange-600 transition transform hover:scale-105">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-800 mt-12 pt-6 pb-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} BookZone. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
