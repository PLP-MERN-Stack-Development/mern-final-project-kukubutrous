// src/pages/ForgotPassword.jsx
import { useState } from "react";
import API from "../utils/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(""); setError("");
        try {
            const res = await API.post("/auth/request-password-reset", { email });
            setMessage(res.data.message);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to send reset link");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-brightGreen">Forgot Password</h2>
                {message && <p className="text-brightGreen mb-4">{message}</p>}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-3 border rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <button className="w-full bg-brightPink text-white py-3 rounded hover:bg-pink-600 transition">Send Reset Link</button>
                </form>
            </div>
        </div>
    );
}
