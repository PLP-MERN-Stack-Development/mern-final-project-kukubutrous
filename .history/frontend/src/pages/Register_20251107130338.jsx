// frontend/src/pages/Register.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await api.post("/auth/register", form);
      navigate("/verify-email");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4">
      <motion.form
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white dark:bg-green-900 rounded-2xl shadow-xl p-8 w-full max-w-md space-y-4"
      >
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 text-center">Register</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}

        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          value={form.firstName}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-green-800 text-green-900 dark:text-green-100"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          value={form.lastName}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-green-800 text-green-900 dark:text-green-100"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-green-800 text-green-900 dark:text-green-100"
        />
        <input
          type="text"
          name="phoneNumber"
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-green-800 text-green-900 dark:text-green-100"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full p-3 rounded-xl border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-green-800 text-green-900 dark:text-green-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-700 dark:to-green-800 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="text-sm text-green-800 dark:text-green-200 text-center">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold underline hover:text-green-600 dark:hover:text-green-400">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}





/*
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
    const [form, setForm] = useState({ firstName: "", lastName: "", phoneNumber: "", email: "", password: "" });
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        try {
            await api.post("/auth/register", form);
            setMsg("Registered. Check your email for verification.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMsg(err?.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="max-w-lg mx-auto card">
            <h2 className="text-2xl font-bold mb-4">Create account</h2>
            {msg && <div className="mb-3 text-sm">{msg}</div>}
            <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                <input placeholder="First name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="col-span-1 px-3 py-2 border rounded" />
                <input placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="col-span-1 px-3 py-2 border rounded" />
                <input placeholder="Phone" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="col-span-2 px-3 py-2 border rounded" />
                <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="col-span-2 px-3 py-2 border rounded" />
                <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="col-span-2 px-3 py-2 border rounded" />
                <button className="btn-brand col-span-2">Create account</button>
            </form>
        </div>
    );
}
*/