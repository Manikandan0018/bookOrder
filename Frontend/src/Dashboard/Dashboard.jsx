// components/Dashboard.jsx
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

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

console.log("Backend URL:", VITE_BACKEND_URL);

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${VITE_BACKEND_URL}api/dashboard/stats`).then((res) => {
      setStats(res.data);
    });
  }, []);

  if (!stats) return <p>Loading dashboard...</p>;

  // ✅ Single chart data: Veg vs Non-Veg counts
  const vegNonVegData = [
    { name: "Veg", value: stats.vegCount },
    { name: "Non-Veg", value: stats.nonVegCount },
  ];

  // ✅ All categories chart data

  const data =[{ name: "Veg", count: stats.vegCount},
    { name: "Non-Veg", count: stats.nonVegCount },
    { name: "All Products", count: stats.totalProducts}, // sum of veg + non-veg
  ];

  const COLORS = ["#4CAF50", "#FF5722", "#2196F3", "#FFC107", "#9C27B0"];

  return (
    <div className="p-6 space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6">
        <Card className="p-4 shadow-md rounded-2xl">
          <CardContent>
            <p className="text-gray-500">Total Products</p>
            <h2 className="text-2xl font-bold">{stats.totalProducts}</h2>
          </CardContent>
        </Card>

        <Card className="p-4 shadow-md rounded-2xl">
          <CardContent>
            <p className="text-gray-500">Veg Products</p>
            <h2 className="text-2xl font-bold">{stats.vegCount}</h2>
          </CardContent>
        </Card>

        <Card className="p-4 shadow-md rounded-2xl">
          <CardContent>
            <p className="text-gray-500">Non-Veg Products</p>
            <h2 className="text-2xl font-bold">{stats.nonVegCount}</h2>
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
            <p className="text-gray-500">Categories</p>
            <h2 className="text-2xl font-bold">{stats.categoryCount.length}</h2>
          </CardContent>
        </Card>
      </div>

      {/* ✅ Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Veg vs Non-Veg Chart */}
        <Card className="p-4 shadow-md rounded-2xl">
          <h3 className="text-lg font-semibold mb-4">Veg vs Non-Veg Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vegNonVegData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {vegNonVegData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </Card>

       

        <Card className="p-6 shadow-md rounded-2xl">
      <h3 className="text-lg font-semibold mb-4">Product Distribution</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#4f46e5" radius={[8, 8, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>
      </div>
    </div>
  );
}
