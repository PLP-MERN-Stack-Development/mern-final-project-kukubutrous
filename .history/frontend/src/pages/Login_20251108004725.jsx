import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        try {
            const res = await api.post("/auth/login", form);
            const { token, user } = res.data;

            // Save credentials
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(user));

            setMessage("✅ Login successful! Redirecting...");

            // Redirect based on role
            setTimeout(() => {
                if (user.role === "superAdmin") navigate("/super-admin");
                else if (user.role === "admin") navigate("/admin");
                else navigate("/dashboard");
            }, 1200);
        } catch (error) {
            const msg =
                error.response?.data?.message ||
                "❌ Invalid email or password.";
            setMessage(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-pink-100">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-[90%] max-w-lg">
                <h2 className="text-3xl font-bold text-center text-green-600 mb-6">
                    Welcome Back 💚
                </h2>
                <form onSubmit={handleSubmit}>
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 mt-4 rounded-lg focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full ${loading ? "bg-gray-400" : "bg-green-500 hover:bg-pink-500"
                            } text-white py-3 mt-6 rounded-lg font-semibold transition-all`}
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                {message && (
                    <p
                        className={`text-center mt-4 ${message.includes("✅") ? "text-green-600" : "text-red-500"
                            }`}
                    >
                        {message}
                    </p>
                )}

                {/* Forgot password and create account buttons */}
                <div className="text-center mt-6 space-y-3">
                    <Link
                        to="/forgot-password"
                        className="inline-block w-full bg-pink-500 hover:bg-green-500 text-white py-3 rounded-lg font-semibold transition-all"
                    >
                        Forgot Password?
                    </Link>
                    <Link
                        to="/register"
                        className="inline-block w-full bg-green-500 hover:bg-pink-500 text-white py-3 rounded-lg font-semibold transition-all"
                    >
                        Create Account
                    </Link>
                </div>
            </div>
        </div>
    );
}
