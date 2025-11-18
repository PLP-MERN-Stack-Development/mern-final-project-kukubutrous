// frontend/src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const res = await api.post(`/auth/reset-password?token=${token}`, { password });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password.");
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
        <h2 className="text-2xl font-bold text-green-800 dark:text-green-200 text-center">Reset Password</h2>

        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-green-800 text-green-900 dark:text-green-100"
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full p-3 rounded-xl border border-green-300 dark:border-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 dark:focus:ring-green-500 bg-white dark:bg-green-800 text-green-900 dark:text-green-100"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-700 dark:to-green-800 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
        >
          {loading ? "Resetting..." : "Reset Password"}
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
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState(null);

    async function submit(e) {
        e.preventDefault();
        try {
            const token = params.get("token");
            await api.post("/auth/reset-password", { token, password });
            setMsg("Password reset. Redirecting to login...");
            setTimeout(() => navigate("/login"), 1800);
        } catch (err) {
            setMsg(err?.response?.data?.message || "Failed");
        }
    }

    return (
        <div className="max-w-md mx-auto card">
            <h3 className="font-semibold mb-3">Choose a new password</h3>
            {msg && <div className="mb-2">{msg}</div>}
            <form onSubmit={submit}>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" type="password" className="w-full p-2 border rounded mb-3" />
                <button className="btn-brand">Reset password</button>
            </form>
        </div>
    );
}
*/