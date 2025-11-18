// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError("Invalid credentials. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-pink-100 to-green-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center text-green-500 mb-6">
          Welcome Back 👋
        </h2>

        {error && (
          <div className="text-pink-500 text-center font-medium mb-3">
            {error}
          </div>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded-full px-4 py-2 mb-3 focus:ring-2 focus:ring-pink-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded-full px-4 py-2 mb-4 focus:ring-2 focus:ring-green-400"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white rounded-full py-2 hover:bg-green-600 transition"
        >
          Login
        </button>

        <p className="text-center mt-4 text-gray-600">
          Don't have an account?{" "}
          <Link to="/register" className="text-pink-500 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
}
