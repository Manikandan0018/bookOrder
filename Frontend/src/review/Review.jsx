import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const Review = ({ productId }) => {
  const token = localStorage.getItem("token");
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState("");

  // Fetch reviews
  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await axios.get(
        `${VITE_BACKEND_URL}api/reviews/${productId}`
      );
      return res.data;
    },
  });

  // Add review
  const addReview = useMutation({
    mutationFn: async () => {
      if (!token) throw new Error("Login required");
      const res = await axios.post(
        `${VITE_BACKEND_URL}api/reviews/add`,
        { productId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: () => {
      toast.success("Review added!");
      setRating(0);
      setComment("");
      queryClient.invalidateQueries(["reviews", productId]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to add review");
    },
  });

  return (
    <>
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">Customer Reviews</h3>

      {/* Review Form */}
      <div className="mb-6 bg-gray-50 p-4 rounded-lg shadow">
        <div className="flex mb-2">
          {[...Array(5)].map((star, index) => {
            const starValue = index + 1;
            return (
              <button
                key={starValue}
                type="button"
                onClick={() => setRating(starValue)}
                onMouseEnter={() => setHover(starValue)}
                onMouseLeave={() => setHover(null)}
              >
                <FaStar
                  className="mx-1"
                  size={28}
                  color={starValue <= (hover || rating) ? "#f59e0b" : "#e5e7eb"}
                />
              </button>
            );
          })}
        </div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write your review..."
          className="w-full border p-2 rounded mb-2"
        />
        <button
          onClick={() => addReview.mutate()}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600"
        >
          Submit Review
        </button>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length > 0 ? (
          reviews.map((rev) => (
            <div key={rev._id} className="border-b pb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    size={18}
                    color={i < rev.rating ? "#f59e0b" : "#e5e7eb"}
                  />
                ))}
                <span className="ml-2 text-sm text-gray-500">
                  by {rev.user?.name || "Anonymous"}
                </span>
              </div>
              <p className="mt-1 text-gray-700">{rev.comment}</p>
              <p className="text-xs text-gray-400">
                {new Date(rev.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No reviews yet. Be the first!</p>
        )}
      </div>
      </div>
      </>
  );
};

export default Review;
