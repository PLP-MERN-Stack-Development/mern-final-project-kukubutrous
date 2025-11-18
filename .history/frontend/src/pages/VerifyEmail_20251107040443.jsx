// frontend/src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const [msg, setMsg] = useState("Verifying...");
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    async function verify() {
      const token = params.get("token");
      try {
        const res = await api.get(`/auth/verify?token=${token}`);
        setMsg(res.data.message || "Email verified successfully!");
        setStatus("success");
      } catch (err) {
        setMsg(err?.response?.data?.message || "Verification failed");
        setStatus("error");
      }
    }
    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition-all">
      <div className={`p-8 rounded-2xl shadow-2xl w-full max-w-md text-center
        ${status === "success" ? "bg-green-50 dark:bg-green-900/30" : "bg-red-50 dark:bg-red-900/30"}
        animate-fade-in`}>
        <h1 className={`text-3xl font-bold mb-4 ${status === "success" ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
          {status === "success" ? "✅ Verified!" : "⚠️ Verification Failed"}
        </h1>
        <p className="text-gray-700 dark:text-gray-300 mb-6">{msg}</p>
        {status === "success" ? (
          <Link
            to="/login"
            className="inline-block px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Go to Login
          </Link>
        ) : (
          <Link
            to="/register"
            className="inline-block px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl"
          >
            Try Again
          </Link>
        )}
      </div>
    </div>
  );
}
