import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const token = params.get("token");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post(`/auth/reset-password?token=${token}`, { password });
            setMessage(res.data.message || "✅ Password reset successful!");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || "❌ Failed to reset password");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100">
            <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold text-green-600 text-center mb-4">Reset Password</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        placeholder="New Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full border border-pink-300 p-2 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                    />
                    <button className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">
                        Reset Password
                    </button>
                </form>
                {message && <p className="text-center mt-4 text-sm text-gray-600">{message}</p>}
            </div>
        </div>
    );
}
