// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login({ setUser }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
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
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 text-center">Login</h2>
        {error && <div className="text-red-500 text-sm">{error}</div>}

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
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-sm text-green-800 dark:text-green-200 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="font-semibold underline hover:text-green-600 dark:hover:text-green-400">
            Register
          </Link>
        </p>
        <p className="text-sm text-green-800 dark:text-green-200 text-center">
          <Link to="/forgot-password" className="underline hover:text-green-600 dark:hover:text-green-400">
            Forgot password?
          </Link>
        </p>
      </motion.form>
    </div>
  );
}





/*
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../App";

export default function Login() {
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    async function handle(e) {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            navigate("/dashboard");
        } catch (error) {
            setErr(error?.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="max-w-md mx-auto card">
            <h2 className="text-2xl font-bold mb-4">Sign in</h2>
            {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
            <form onSubmit={handle} className="space-y-3">
                <input className="w-full px-4 py-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="w-full px-4 py-2 border rounded" placeholder="Password" value={password} type="password" onChange={e => setPassword(e.target.value)} />
                <button className="btn-brand w-full">Login</button>
            </form>
            <div className="mt-3 flex justify-between text-sm">
                <Link to="/register" className="text-brand-600">Register</Link>
                <Link to="/forgot-password" className="text-gray-600">Forgot?</Link>
            </div>
        </div>
    );
}
*/