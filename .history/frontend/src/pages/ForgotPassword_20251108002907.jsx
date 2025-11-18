import React, { useState } from "react";
import api from "../utils/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/request-password-reset", { email });
      setMessage(res.data.message || "Check your inbox for a reset link.");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Failed to send reset link.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-100">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-pink-600 text-center mb-4">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-green-300 p-2 rounded-lg focus:ring-2 focus:ring-pink-500"
            required
          />
          <button className="w-full bg-pink-500 text-white p-2 rounded-lg hover:bg-pink-600 transition">
            Send Reset Link
          </button>
        </form>
        {message && <p className="text-center mt-4 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
