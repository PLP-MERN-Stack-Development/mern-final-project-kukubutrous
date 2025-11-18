import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch {
            setMessage("❌ Invalid email or password.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-pink-100">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-[90%] max-w-md">
                <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
                    Welcome Back 💚
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-green-400"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        className="w-full border border-gray-300 p-3 rounded-lg mb-4 focus:ring-2 focus:ring-pink-400"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-green-500 hover:bg-pink-400 text-white py-3 rounded-lg font-semibold transition-all"
                    >
                        Login
                    </button>
                </form>
                {message && <p className="text-center text-pink-600 mt-3">{message}</p>}
                <div className="flex justify-between mt-6 text-sm">
                    <Link to="/forgot-password" className="text-green-700 hover:underline">
                        Forgot Password?
                    </Link>
                    <Link to="/register" className="text-pink-600 hover:underline">
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
