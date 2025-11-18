// frontend/src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import api from "../utils/api";
import { motion } from "framer-motion";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState("Verifying...");
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) {
            setStatus("Invalid verification link.");
            return;
        }

        api.get(`/auth/verify?token=${token}`)
            .then(() => setStatus("Email verified successfully! You can now log in."))
            .catch((err) => setStatus(err.response?.data?.message || "Verification failed."));
    }, [token]);

    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900 dark:to-green-800 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-green-900 rounded-2xl shadow-xl p-8 w-full max-w-md text-center"
            >
                <h2 className="text-2xl font-bold text-green-800 dark:text-green-200">{status}</h2>
                {status.includes("successfully") && (
                    <Link
                        to="/login"
                        className="mt-4 inline-block py-2 px-6 bg-gradient-to-r from-green-400 to-green-600 dark:from-green-700 dark:to-green-800 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-transform"
                    >
                        Go to Login
                    </Link>
                )}
            </motion.div>
        </div>
    );
}





/*
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
*/