// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function ResetPassword() {
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); setError("");
        try {
            const res = await API.post("/auth/reset-password", { token, password });
            setMessage(res.data.message);
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to reset password");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-brightGreen">Reset Password</h2>
                {message && <p className="text-brightGreen mb-4">{message}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="password" placeholder="New Password" className="w-full p-3 border rounded" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button className="w-full bg-brightPink text-white py-3 rounded hover:bg-pink-600 transition">Reset Password</button>
                </form>
            </div>
        </div>
    );
}
