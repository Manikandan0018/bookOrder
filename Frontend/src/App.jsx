// App.jsx
import AdminDashboard from "./Admin/AdminDashboard.jsx";
import AdminOrder from "./Admin/AdminOrder.jsx";
import Cart from "./Cart/Cart.jsx";
import Checkout from "./checkout/Checkout.jsx";
import Favorite from "./Favorite/Favorite.jsx";
import Home from "./Home/Home.jsx";
import MenuCart from "./menuCart/MenuCart.jsx";
import MyOrderStatus from "./MyOrder/MyOrderStatus.jsx";
import Login from "./signup/Login.jsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";


function App() {
  return (
      <Routes basename="/">
        {/* Home Page */}
        <Route path="/" element={<Home />} />

        {/* Auth */}
        <Route path="/login" element={<Login/>} />

        {/* Cart & Checkout */}
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/favorites" element={<Favorite />} />
        <Route path="/menu" element={<MenuCart />} />

        {/* Orders */}
        <Route path="/my-orders" element={<MyOrderStatus />} />

        {/* Admin */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/orders" element={<AdminOrder />} />

        {/* Fallback route */}
        <Route path="*" element={<h1 className="text-center mt-10 text-xl">404 Page Not Found</h1>} />
      </Routes>
  );
}

export default App;
