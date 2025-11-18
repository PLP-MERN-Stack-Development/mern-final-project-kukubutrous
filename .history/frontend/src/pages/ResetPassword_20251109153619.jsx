//src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setMessage("Password reset successfully!");
            navigate("/login");
        } catch (err) {
            setMessage(err.response?.data?.error || "Reset failed");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
            <h1 className="text-xl font-bold mb-4">Reset Password</h1>
            {message && <p className="mb-2 text-red-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border rounded px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border rounded px-3 py-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">
                    Reset Password
                </button>
            </form>
        </div>
    );
}
/