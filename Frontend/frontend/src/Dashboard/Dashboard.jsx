import { useEffect, useState } from "react";
import axios from "axios";
import { Card, CardContent } from "../UiCard/UICard.jsx";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const VITE_BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${VITE_BACKEND_URL}api/dashboard/stats`).then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  // ✅ Chart Data (categories)
  const categoryData = stats.categories.map((c) => ({
    name: c.name,
    value: c.count,
  }));

  const COLORS = [
    "#6366f1",
    "#22c55e",
    "#f97316",
    "#e11d48",
    "#06b6d4",
    "#facc15",
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <Card className="p-4 shadow-md rounded-2xl">
          <CardContent>
            <p className="text-gray-500">Total Books</p>
            <h2 className="text-2xl font-bold">{stats.totalBooks}</h2>
          </CardContent>
        </Card>

        <Card className="p-4 shadow-md rounded-2xl">
          <CardContent>
            <p className="text-gray-500">Categories</p>
            <h2 className="text-2xl font-bold">{stats.categories.length}</h2>
          </CardContent>
        </Card>

        <Card className="p-4 shadow-md rounded-2xl">
          <CardContent>
            <p className="text-gray-500">Average Price</p>
            <h2 className="text-2xl font-bold">₹{stats.avgPrice.toFixed(2)}</h2>
          </CardContent>
        </Card>

        <Card className="p-4 shadow-md rounded-2xl">
          <CardContent>
            <p className="text-gray-500">Top Category</p>
            <h2 className="text-2xl font-bold">
              {stats.categories.sort((a, b) => b.count - a.count)[0].name}
            </h2>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <Card className="p-4 shadow-md rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Books by Category</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {categoryData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Category Bar Chart */}
        <Card className="p-6 shadow-md rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Book Distribution</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#4f46e5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
