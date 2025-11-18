import React, { useState } from "react";
import api from "../utils/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSend = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/forgot-password", { email });
            setMessage("✅ Reset link sent! Check your email.");
        } catch {
            setMessage("❌ Failed to send reset link.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-pink-100">
            <form onSubmit={handleSend} className="p-8 bg-white shadow-2xl rounded-2xl w-[90%] max-w-md">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-4">Forgot Password</h2>
                <input
                    type="email"
                    className="w-full border border-gray-300 p-3 mb-4 rounded-lg focus:ring-2 focus:ring-green-400"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button className="w-full bg-pink-500 hover:bg-green-400 text-white py-3 rounded-lg transition-all">
                    Send Reset Link
                </button>
                {message && <p className="text-center mt-4 text-pink-600">{message}</p>}
            </form>
        </div>
    );
}
