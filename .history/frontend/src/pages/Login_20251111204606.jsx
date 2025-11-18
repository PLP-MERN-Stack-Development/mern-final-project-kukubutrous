//frontend/src/pages/Log

import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await login(email, password);
        setLoading(false);

        if (res.success) {
            toast.success("Logged in successfully!");
            navigate("/");
        } else {
            toast.error(res.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-xl font-bold mb-4">Login</h2>

                <label className="block mb-2">
                    Email
                    <input
                        type="email"
                        className="w-full border p-2 rounded mt-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="block mb-4">
                    Password
                    <input
                        type="password"
                        className="w-full border p-2 rounded mt-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
