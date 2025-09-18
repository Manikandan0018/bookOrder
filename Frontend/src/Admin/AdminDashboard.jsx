import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { Edit, Trash2, BookOpen, Library } from "lucide-react";
import { AdminHeader } from "./AdminHeader";
import Dashboard from "../Dashboard/Dashboard.jsx"; // ✅ import your dashboard

const api = axios.create({ baseURL: "http://localhost:5000/" });

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    price: "",
    category: "",
    description: "",
    image: null,
  });

  // Fetch Books
  const { data: books = [] } = useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const res = await api.get("api/books/getBooks");
      return res.data;
    },
  });

  // Add Book
  const addMutation = useMutation({
    mutationFn: (data) => api.post("api/books/addBook", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      toast.success("Book added!");
      resetForm();
    },
    onError: () => toast.error("Failed to add book"),
  });

  // Update Book
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`api/books/updateBook/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      toast.success("Book updated!");
      resetForm();
      setEditing(null);
    },
    onError: () => toast.error("Failed to update book"),
  });

  // Delete Book
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`api/books/deleteBook/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(["books"]);
      toast.success("Book deleted!");
    },
    onError: () => toast.error("Failed to delete book"),
  });

  const handleChange = (e) => {
    if (e.target.name === "image")
      setFormData({ ...formData, image: e.target.files[0] });
    else setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("title", formData.title);
    data.append("author", formData.author);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("description", formData.description);
    if (formData.image) data.append("image", formData.image);

    if (editing) updateMutation.mutate({ id: editing._id, data });
    else addMutation.mutate(data);
  };

  const resetForm = () =>
    setFormData({
      title: "",
      author: "",
      price: "",
      category: "",
      description: "",
      image: null,
    });

  const filteredBooks =
    filter === "all"
      ? books
      : filter === "dashboard"
      ? []
      : books.filter((b) => b.category.toLowerCase() === filter);

  return (
    <>
      <AdminHeader />
      <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white shadow-md p-4">
          <h2 className="text-lg font-bold mb-4 text-indigo-600">
            Book Categories
          </h2>
          <ul className="space-y-2">
            {[
              "all",
              "fiction",
              "non-fiction",
              "children",
              "comics",
              "dashboard",
            ].map((cat) => (
              <li key={cat}>
                <button
                  className={`w-full text-left p-2 rounded-lg ${
                    filter === cat
                      ? "bg-indigo-500 text-white"
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
          {/* Left Form */}
          {filter !== "dashboard" && (
            <div className="w-full md:w-80 bg-white p-4 shadow-lg rounded-xl md:sticky md:top-6 h-max self-start">
              <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen size={18} /> {editing ? "Edit Book" : "Add Book"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input
                  type="text"
                  name="title"
                  placeholder="Book Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-lg"
                  required
                />
                <input
                  type="text"
                  name="author"
                  placeholder="Author"
                  value={formData.author}
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
                  <option value="fiction">Fiction</option>
                  <option value="non-fiction">Non-Fiction</option>
                  <option value="children">Children</option>
                  <option value="comics">Comics</option>
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
                  className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
                >
                  {editing ? "Update Book" : "Add Book"}
                </button>
              </form>
            </div>
          )}

          {/* Right Content Area */}
          <div className="flex-1 overflow-y-auto">
            {filter === "dashboard" ? (
              <Dashboard /> // ✅ show your chart dashboard
            ) : (
              <>
                <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Library size={18} /> Books
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredBooks.map((b) => (
                    <div
                      key={b._id}
                      className="p-4 bg-white shadow-md rounded-xl flex flex-col items-center"
                    >
                      {b.imageUrl && (
                        <img
                          src={b.imageUrl}
                          alt={b.title}
                          className="h-40 w-32 object-cover rounded-lg"
                        />
                      )}
                      <h3 className="font-bold mt-2">{b.title}</h3>
                      <p className="text-gray-500 text-sm">By {b.author}</p>
                      <p className="text-indigo-600 font-semibold">
                        ₹{b.price}
                      </p>
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => {
                            setEditing(b);
                            setFormData({ ...b, image: null });
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-1"
                        >
                          <Edit size={16} /> Edit
                        </button>
                        <button
                          onClick={() => deleteMutation.mutate(b._id)}
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
