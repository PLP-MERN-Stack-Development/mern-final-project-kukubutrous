import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [formData, setFormData] = useState(user || {});
  const [message, setMessage] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put("/users/me", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage("✅ Profile updated successfully!");
    } catch {
      setMessage("❌ Update failed. Try again.");
    }
  };

  useEffect(() => {
    if (user) setFormData(user);
  }, [user]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-green-100">
      <form onSubmit={handleUpdate} className="p-8 bg-white rounded-2xl shadow-xl w-[90%] max-w-lg">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">My Profile</h2>

        {["firstName", "lastName", "email", "phone"].map((field) => (
          <input
            key={field}
            type="text"
            value={formData[field] || ""}
            onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
            placeholder={field.replace(/([A-Z])/g, " $1")}
            className="w-full border border-gray-300 p-3 mb-3 rounded-lg focus:ring-2 focus:ring-pink-400"
          />
        ))}

        <div className="flex justify-between mt-4">
          <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg">
            Save Changes
          </button>
          <button
            type="button"
            onClick={logout}
            className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-4 rounded-lg"
          >
            Logout
          </button>
        </div>

        {message && <p className="text-center mt-4 text-pink-600">{message}</p>}
      </form>
    </div>
  );
}
