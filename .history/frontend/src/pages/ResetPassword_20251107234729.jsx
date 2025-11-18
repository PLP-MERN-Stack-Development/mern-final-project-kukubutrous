import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [params] = useSearchParams();
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            const token = params.get("token");
            await api.post("/auth/reset-password", { token, password });
            setMessage("✅ Password reset successfully!");
            setTimeout(() => navigate("/login"), 2000);
        } catch {
            setMessage("❌ Reset failed. Try again.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-pink-100">
            <form onSubmit={handleReset} className="p-8 bg-white rounded-2xl shadow-xl w-[90%] max-w-md">
                <h2 className="text-2xl font-bold text-center text-green-700 mb-4">Reset Password</h2>
                <input
                    type="password"
                    className="w-full border border-gray-300 rounded-lg p-3 mb-4 focus:ring-2 focus:ring-green-400"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button className="w-full bg-green-500 hover:bg-pink-400 text-white py-3 rounded-lg transition-all">
                    Reset Password
                </button>
                {message && <p className="text-center mt-4 text-pink-600">{message}</p>}
            </form>
        </div>
    );
}
