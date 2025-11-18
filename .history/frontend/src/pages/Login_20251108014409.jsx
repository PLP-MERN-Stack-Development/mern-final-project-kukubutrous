import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            const { token, user } = res.data;

            login(token, user);

            // Redirect based on role
            if (user.role === "admin" || user.role === "superAdmin") {
                navigate("/admin");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                {error && (
                    <div className="bg-pink-100 text-pink-600 py-2 px-3 rounded mb-4">
                        {error}
                    </div>
                )}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full mb-4 px-4 py-2 border rounded"
                    required
                />
                <button className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition">
                    Login
                </button>
            </form>
        </div>
    );
}
