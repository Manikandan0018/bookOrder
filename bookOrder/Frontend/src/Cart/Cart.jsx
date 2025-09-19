import React, { useState, useEffect, useRef } from "react";
import { MdOutlineRemove } from "react-icons/md";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Header } from "../Header/Header";
import Address from "../Adress/Address";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Review from "../review/Review";
import Footer from "../Footer/Footer";

const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

const Cart = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");
  const [quantity, setQuantity] = useState({});
  const carouselRef = useRef(null);

  // Fetch Address
  const { data: currentAddress, refetch: refetchAddress } = useQuery({
    queryKey: ["currentAddress"],
    queryFn: async () => {
      if (!token) return null;
      const res = await axios.get(`${VITE_BACKEND_URL}api/address/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data.length > 0 ? res.data[res.data.length - 1] : null;
    },
  });

  // Fetch Cart
  const { data: cartData = [], isLoading: cartLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      if (!token) return [];
      const res = await axios.get(`${VITE_BACKEND_URL}api/cart/getCart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  // Suggested Books
  const { data: suggestedBooks = [] } = useQuery({
    queryKey: ["suggestedBooks"],
    queryFn: async () => {
      const res = await axios.get(`${VITE_BACKEND_URL}api/books/getBooks`);
      return res.data;
    },
  });

  // Set initial quantities
  useEffect(() => {
    if (Object.keys(quantity).length === 0 && cartData.length > 0) {
      const initialQuantities = {};
      cartData.forEach((item) => {
        initialQuantities[item.product._id] = item.quantity || 1;
      });
      setQuantity(initialQuantities);
    }
  }, [cartData]);

  // Remove Cart Item
  const removeCartMutation = useMutation({
    mutationFn: async (cartItemId) => {
      await axios.delete(
        `${VITE_BACKEND_URL}api/cart/removeCart/${cartItemId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      toast.success("Removed from cart");
    },
    onError: (err) => toast.error(err.message),
  });

  // Order
  const orderMutation = useMutation({
    mutationFn: async ({ productId, quantity }) => {
      if (!token) throw new Error("Please login to place an order");
      if (!currentAddress?._id) throw new Error("please enter Address");

      const res = await axios.post(
        `${VITE_BACKEND_URL}api/orders/single`,
        { productId, quantity, addressId: currentAddress._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Order placed successfully!");
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      navigate("/myOrder-status");
    },
    onError: (err) => toast.error(err.response?.data?.message || err.message),
  });

  // Carousel scroll
  const scrollCarousel = (direction = "right") => {
    if (!carouselRef.current) return;
    const scrollAmount = 300;
    carouselRef.current.scrollBy({
      left: direction === "right" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  if (cartLoading) return <div className="text-center py-20">Loading...</div>;

  return (
    <div className="min-h-screen mt-20 bg-gray-50 font-sans">
      <Header />

      {cartData.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3081/3081986.png"
            alt="empty cart"
            className="w-40 mb-6 opacity-80"
          />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-700 mb-2">
            Your Cart is Empty
          </h2>
          <p className="text-gray-500 text-base md:text-lg mb-4">
            Add items to make it happy 😊
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-orange-500 to-pink-500 text-white font-semibold shadow-md hover:scale-105 transition-transform"
          >
            Go Shopping
          </button>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Address Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                <h2 className="text-xl font-bold mb-3 text-gray-700">
                  Delivery Address
                </h2>
                <Address onAddressSaved={refetchAddress} />
              </div>
            </div>
          </div>

          {/* Cart Products */}
          <div className="lg:col-span-2 space-y-6 pb-12">
            {cartData.map(({ product, _id }) => (
              <div
                key={product._id}
                className="bg-white shadow-md hover:shadow-xl rounded-2xl p-6 border border-gray-100 transition transform hover:-translate-y-1"
              >
                <div className="flex flex-col md:flex-row gap-6">
                  <img
                    src={
                      product.imageUrl || "https://via.placeholder.com/400x300"
                    }
                    alt={product.title}
                    className="w-full md:w-1/4 h-48 object-cover rounded-xl"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">
                        {product.title}
                      </h2>
                      <p className="text-sm text-gray-500">
                        by {product.author}
                      </p>
                      <p className="text-sm text-gray-400">
                        {product.category}
                      </p>
                      <p className="text-lg font-semibold text-orange-600 mt-2">
                        ₹{product.price}
                      </p>
                      <p className="text-gray-600 text-sm mt-1">
                        {product.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4 items-center">
                      {/* Quantity */}
                      <div className="flex items-center border rounded-full shadow-sm">
                        <button
                          className="px-3 py-1 "
                          onClick={() =>
                            setQuantity((prev) => ({
                              ...prev,
                              [product._id]: Math.max(1, prev[product._id] - 1),
                            }))
                          }
                        >
                          <MdOutlineRemove />
                        </button>
                        <span className="px-3 font-medium">
                          {quantity[product._id]}
                        </span>
                        <button
                          className="px-3 py-1 "
                          onClick={() =>
                            setQuantity((prev) => ({
                              ...prev,
                              [product._id]: prev[product._id] + 1,
                            }))
                          }
                        >
                          +
                        </button>
                      </div>

                      {/* Buttons */}
                      <button
                        onClick={() => removeCartMutation.mutate(_id)}
                        className="px-5 py-2 rounded-full bg-red-500 text-white font-medium shadow hover:bg-red-600 hover:scale-105 transition"
                      >
                        Remove
                      </button>

                      <button
                        onClick={() =>
                          orderMutation.mutate({
                            productId: product._id,
                            quantity: quantity[product._id],
                          })
                        }
                        className="px-5 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow hover:scale-105 transition"
                      >
                        Buy Now
                      </button>
                    </div>

                    <div className="mt-3">
                      <Review productId={product._id} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Suggested Books */}
            {suggestedBooks.length > 0 && (
              <div className="mt-12">
                <h2 className="text-xl font-bold mb-4 text-gray-700">
                  Suggested Books For You
                </h2>
                <div className="relative">
                  {/* Left Arrow */}
                  <button
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:scale-110 transition"
                    onClick={() => scrollCarousel("left")}
                  >
                    &#10094;
                  </button>

                  <div
                    ref={carouselRef}
                    className="flex overflow-x-auto gap-4 pb-2 scrollbar-hide scroll-smooth"
                  >
                    {suggestedBooks
                      .filter(
                        (b) => !cartData.some((c) => c.product._id === b._id)
                      )
                      .slice(0, 12)
                      .map((book) => (
                        <div
                          key={book._id}
                          className="min-w-[180px] bg-white p-4 rounded-2xl shadow hover:shadow-xl transition hover:-translate-y-1 flex-shrink-0"
                        >
                          <img
                            src={
                              book.imageUrl ||
                              "https://via.placeholder.com/150x200"
                            }
                            alt={book.title}
                            className="w-55 h-44 object-cover rounded-lg mb-3"
                          />
                          <h3
                            className="font-semibold text-base"
                            title={book.title}
                          >
                            {book.title.length > 30
                              ? book.title.slice(0, 30) + "..."
                              : book.title}
                          </h3>
                          <p
                            className="text-xs text-gray-500"
                            title={book.author}
                          >
                            {book.author.length > 20
                              ? book.author.slice(0, 20) + "..."
                              : book.author}
                          </p>
                          <p
                            className="text-xs text-gray-400"
                            title={book.category}
                          >
                            {book.category.length > 15
                              ? book.category.slice(0, 15) + "..."
                              : book.category}
                          </p>

                          <p className="text-orange-600 font-bold text-sm mt-1">
                            ₹{book.price}
                          </p>

                          <button
                            onClick={() => {
                              if (!token) {
                                toast.error("Please login first");
                                navigate("/login");
                                return;
                              }
                              if (!currentAddress?._id) {
                                toast.error("Please select an address first");
                                navigate("/address");
                                return;
                              }
                              orderMutation.mutate({
                                productId: book._id,
                                quantity: 1,
                              });
                            }}
                            className="w-full mt-3 py-2 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium shadow hover:scale-105 transition"
                          >
                            Buy Now
                          </button>
                        </div>
                      ))}
                  </div>

                  {/* Right Arrow */}
                  <button
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 hover:scale-110 transition"
                    onClick={() => scrollCarousel("right")}
                  >
                    &#10095;
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer/>
    </div>
  );
};

export default Cart;
