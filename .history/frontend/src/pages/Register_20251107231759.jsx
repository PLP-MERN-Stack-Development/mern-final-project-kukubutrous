// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate("/verify-email");
    } catch (err) {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-100 to-pink-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg"
      >
        <h2 className="text-3xl font-bold text-center text-pink-500 mb-6">
          Create an Account 💖
        </h2>

        {error && (
          <div className="text-red-500 text-center font-medium mb-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <input
            name="firstName"
            placeholder="First Name"
            className="border rounded-full px-4 py-2 focus:ring-2 focus:ring-pink-400"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <input
            name="lastName"
            placeholder="Last Name"
            className="border rounded-full px-4 py-2 focus:ring-2 focus:ring-green-400"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <input
          name="phoneNumber"
          placeholder="Phone Number"
          className="w-full border rounded-full px-4 py-2 mt-3 focus:ring-2 focus:ring-green-400"
          value={form.phoneNumber}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full border rounded-full px-4 py-2 mt-3 focus:ring-2 focus:ring-pink-400"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="w-full border rounded-full px-4 py-2 mt-3 focus:ring-2 focus:ring-green-400"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="w-full bg-pink-500 text-white rounded-full py-2 mt-4 hover:bg-pink-600 transition"
        >
          Register
        </button>

        <p className="text-center mt-4 text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
