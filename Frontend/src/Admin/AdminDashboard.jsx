import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash2 } from "lucide-react";
import Dashboard from "../Dashboard/Dashboard";
import { AdminHeader } from "./AdminHeader";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:5000",
});

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: null,
  });

  const { data: products = [] } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await api.get(`/api/AllProduct/getProduct`);
      return res.data;
    },
  });

  const addMutation = useMutation({
    mutationFn: (data) => api.post(`/api/AllProduct/addProduct`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product added!");
      resetForm();
    },
    onError: () => toast.error("Failed to add product"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) =>
      api.put(`/api/AllProduct/updateProduct/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product updated!");
      resetForm();
      setEditing(null);
    },
    onError: () => toast.error("Failed to update product"),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/api/AllProduct/deleteProduct/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["products"]);
      toast.success("Product deleted!");
    },
    onError: () => toast.error("Failed to delete product"),
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setFormData({ ...formData, image: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    if (editing) {
      updateMutation.mutate({ id: editing._id, data });
    } else {
      addMutation.mutate(data);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      category: "",
      description: "",
      image: null,
    });
  };

  const filteredProducts =
    filter === "all"
      ? products
      : filter === "dashboard"
      ? []
      : products.filter((p) => p.category.toLowerCase() === filter);

  return (
    <>
      <AdminHeader />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white shadow-md p-4">
          <h2 className="text-lg font-bold mb-4 text-orange-600">Categories</h2>
          <ul className="space-y-2">
            {[
              "all",
              "veg",
              "non-veg",
              "breakfast",
              "lunch",
              "dinner",
              "dashboard",
            ].map((cat) => (
              <li key={cat}>
                <button
                  className={`w-full text-left p-2 rounded-lg ${
                    filter === cat
                      ? "bg-orange-500 text-white"
                      : "hover:bg-gray-200"
                  }`}
                  onClick={() => setFilter(cat)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col md:flex-row gap-6 p-6">
          {/* Form */}
          <div className="w-full md:w-80 bg-white p-4 shadow-lg rounded-xl md:sticky md:top-6 h-max self-start">
            <h2 className="text-lg font-semibold mb-3">
              {editing ? "Edit Product" : "Add Product"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
                required
              >
                <option value="">Select Category</option>
                <option value="veg">Veg</option>
                <option value="non-veg">Non-Veg</option>
                <option value="breakfast">Breakfast</option>
                <option value="lunch">Lunch</option>
                <option value="dinner">Dinner</option>
              </select>
              <textarea
                name="description"
                placeholder="Description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="w-full border p-2 rounded-lg"
              />
              <button
                type="submit"
                disabled={addMutation.isPending || updateMutation.isPending}
                className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
              >
                {editing
                  ? updateMutation.isPending
                    ? "Updating..."
                    : "Update Product"
                  : addMutation.isPending
                  ? "Adding..."
                  : "Add Product"}
              </button>
            </form>
          </div>

          {/* Products List */}
          <div className="flex-1 overflow-y-auto">
            {filter === "dashboard" ? (
              <Dashboard />
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-3">Products</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.map((p) => (
                    <div
                      key={p._id}
                      className="p-4 bg-white shadow-md rounded-xl flex flex-col items-center"
                    >
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="h-32 w-32 object-cover rounded-lg"
                        />
                      )}
                      <h3 className="font-bold mt-2">{p.name}</h3>
                      <p className="text-gray-500 text-sm">{p.category}</p>
                      <p className="text-orange-600 font-semibold">
                        ₹{p.price}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setEditing(p);
                            setFormData({
                              name: p.name,
                              price: p.price,
                              category: p.category,
                              description: p.description,
                              image: null,
                            });
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(p._id)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1"
                        >
                          <Trash2 size={16} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default AdminDashboard;
