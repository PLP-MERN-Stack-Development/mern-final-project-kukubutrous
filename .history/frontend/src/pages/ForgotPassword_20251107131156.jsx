// frontend/src/pages/ForgotPassword.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import api from "../utils/api";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post("/auth/request-password-reset", { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send reset link");
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
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 text-center">Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-3 rounded-xl border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-green-800 text-green-900 dark:text-green-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-700 dark:to-green-800 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {message && <p className="text-center text-green-800 dark:text-green-200">{message}</p>}

        <p className="text-sm text-green-800 dark:text-green-200 text-center">
          <Link to="/login" className="underline hover:text-green-600 dark:hover:text-green-400">
            Back to Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}





/*
import React, { useState } from "react";
import api from "../utils/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState(null);

    async function submit(e) {
        e.preventDefault();
        try {
            const res = await api.post("/auth/request-password-reset", { email });
            setMsg(res.data.message);
        } catch (err) {
            setMsg(err?.response?.data?.message || "Failed");
        }
    }

    return (
        <div className="max-w-md mx-auto card">
            <h3 className="font-semibold mb-3">Reset password</h3>
            {msg && <div className="mb-2">{msg}</div>}
            <form onSubmit={submit}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded mb-3" />
                <button className="btn-brand">Send reset link</button>
            </form>
        </div>
    );
}
*/