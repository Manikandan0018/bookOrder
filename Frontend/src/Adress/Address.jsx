// src/Adress/Address.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const VITE_BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
console.log("Backend URL:", VITE_BACKEND_URL);

const Address = ({ onAddressSaved }) => {
  const token = localStorage.getItem("token");
  const [currentAddress, setCurrentAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "India",
    latitude: "",
    longitude: "",
  });

  // Save Manual Address Mutation
  const saveManualMutation = useMutation({
    mutationFn: async (data) => {
      return await axios.post(
        `${VITE_BACKEND_URL}api/address/save-manual`,
        data,
        { headers: { Authorization: `Bearer ${token}` } }
      );
    },
    onSuccess: (res) => {
      setCurrentAddress(res.data.address);
      setFormData({
        name: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
        latitude: "",
        longitude: "",
      });
      if (onAddressSaved) onAddressSaved(); // Notify parent
    },
    onError: (err) => {
      alert("Error: " + (err.response?.data?.message || err.message));
    },
  });

  // Auto-Detect Address Mutation
  const detectAddressMutation = useMutation({
    mutationFn: async ({ latitude, longitude }) => {
      const res = await axios.post(
        `${VITE_BACKEND_URL}api/address/save-auto`,
        { latitude, longitude },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    },
    onSuccess: (address) => {
      setCurrentAddress(address);
      setFormData((prev) => ({
        ...prev,
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        country: address.country || "India",
      }));
      if (onAddressSaved) onAddressSaved(); // Notify parent
    },
  });

  // Fetch current/latest address
  useEffect(() => {
    const fetchCurrentAddress = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${VITE_BACKEND_URL}api/address/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.data && res.data.length > 0) {
          setCurrentAddress(res.data[res.data.length - 1]);
          setFormData((prev) => ({
            ...prev,
            ...res.data[res.data.length - 1],
          }));
        }
      } catch (err) {
        console.error("Error fetching current address:", err);
      }
    };
    fetchCurrentAddress();
  }, [token]);

  // Auto-detect
  const handleDetectAddress = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({ ...prev, latitude, longitude }));

        try {
          await detectAddressMutation.mutateAsync({ latitude, longitude });
        } catch (err) {
          console.error(err);
        }
        setLoading(false);
      },
      () => {
        alert("Location access denied ❌");
        setLoading(false);
      }
    );
  };

  const handleSaveManual = (e) => {
    e.preventDefault();
    if (!token) {
      alert("Please login first ❌");
      return;
    }
    saveManualMutation.mutate(formData);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow rounded-lg">
      <h2 className="text-xl font-semibold mb-4">Add Address</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full mb-2 border p-2 rounded-lg"
      />
      <input
        type="text"
        placeholder="Phone"
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        className="w-full mb-2 border p-2 rounded-lg"
      />
      <input
        type="text"
        placeholder="Street"
        value={formData.street}
        onChange={(e) => setFormData({ ...formData, street: e.target.value })}
        className="w-full mb-2 border p-2 rounded-lg"
      />
      <input
        type="text"
        placeholder="City"
        value={formData.city}
        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
        className="w-full mb-2 border p-2 rounded-lg"
      />
      <input
        type="text"
        placeholder="State"
        value={formData.state}
        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
        className="w-full mb-2 border p-2 rounded-lg"
      />
      <input
        type="text"
        placeholder="Pincode"
        value={formData.pincode}
        onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
        className="w-full mb-2 border p-2 rounded-lg"
      />
      <input
        type="text"
        placeholder="Country"
        value={formData.country}
        onChange={(e) => setFormData({ ...formData, country: e.target.value })}
        className="w-full mb-2 border p-2 rounded-lg"
      />

      <div className="flex gap-4 mt-4">
        <button
          onClick={handleDetectAddress}
          disabled={loading || detectAddressMutation.isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg"
        >
          {loading || detectAddressMutation.isLoading
            ? "Detecting..."
            : "Detect Address"}
        </button>
        <button
          onClick={handleSaveManual}
          disabled={saveManualMutation.isLoading}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          {saveManualMutation.isLoading ? "Saving..." : "Save"}
        </button>
      </div>

      {currentAddress && (
        <div className="mt-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="font-semibold mb-2">📍 Current Address:</h3>
          <p>
            {currentAddress.name} ({currentAddress.phone})
          </p>
          <p>
            {currentAddress.street}, {currentAddress.city},{" "}
            {currentAddress.state}
          </p>
          <p>
            {currentAddress.pincode}, {currentAddress.country}
          </p>
        </div>
      )}
    </div>
  );
};

export default Address;
