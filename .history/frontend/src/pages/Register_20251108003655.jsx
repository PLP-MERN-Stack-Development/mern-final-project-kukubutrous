import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
    });
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
            const res = await api.post("/auth/register", form);
            setMessage(res.data.message || "✅ Registration successful! Check your email for verification.");
            setTimeout(() => navigate("/login"), 2500);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "❌ Registration failed. Try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 to-green-100">
            <div className="bg-white shadow-2xl rounded-2xl p-10 w-[90%] max-w-lg">
                <h2 className="text-3xl font-bold text-center text-pink-600 mb-6">
                    Create Account 💖
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            name="firstName"
                            type="text"
                            placeholder="First Name"
                            value={form.firstName}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400"
                            required
                        />
                        <input
                            name="lastName"
                            type="text"
                            placeholder="Last Name"
                            value={form.lastName}
                            onChange={handleChange}
                            className="border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400"
                            required
                        />
                    </div>
                    <input
                        name="phoneNumber"
                        type="text"
                        placeholder="Phone Number"
                        value={form.phoneNumber}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 mt-4 rounded-lg focus:ring-2 focus:ring-green-400"
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Email Address"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-3 mt-4 rounded-lg focus:ring-2 focus:ring-pink-400"
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
                        className={`w-full ${loading ? "bg-gray-400" : "bg-pink-500 hover:bg-green-500"
                            } text-white py-3 mt-6 rounded-lg font-semibold transition-all`}
                    >
                        {loading ? "Registering..." : "Register"}
                    </button>
                </form>
                {message && (
                    <p
                        className={`text-center mt-4 ${message.includes("✅")
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                    >
                        {message}
                    </p>
                )}
                <div className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-green-700 hover:underline">
                        Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
