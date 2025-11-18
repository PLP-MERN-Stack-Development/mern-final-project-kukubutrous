import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setMessage("✅ Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-pink-600 mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {["email", "password"].map((field) => (
            <input
              key={field}
              type={field === "password" ? "password" : "email"}
              name={field}
              placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
              value={form[field]}
              onChange={handleChange}
              className="w-full border border-green-300 rounded-lg p-2 focus:ring-2 focus:ring-pink-500"
              required
            />
          ))}
          <button className="w-full bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition">
            Login
          </button>
        </form>
        {message && <p className="text-center mt-4 text-sm text-gray-600">{message}</p>}
        <p className="text-center mt-4 text-sm">
          Forgot password?{" "}
          <span
            className="text-green-600 cursor-pointer hover:underline"
            onClick={() => navigate("/forgot-password")}
          >
            Reset here
          </span>
        </p>
      </div>
    </div>
  );
}
