import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        email: "",
        password: "",
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");
        try {
            const res = await api.post("/auth/register", form);
            setMessage(res.data.message || "✅ Registration successful! Check your email to verify your account.");
        } catch (err) {
            setError(err.response?.data?.message || "❌ Registration failed. Please try again.");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow bg-white">
            <h1 className="text-2xl font-bold mb-4 text-center">Create Account</h1>

            {message && <p className="text-green-600 text-center mb-3">{message}</p>}
            {error && <p className="text-red-600 text-center mb-3">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={form.firstName}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={form.lastName}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <input
                    type="text"
                    name="phoneNumber"
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2"
                    required
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded"
                >
                    Register
                </button>
            </form>

            <p className="mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-blue-600 hover:underline">
                    Login
                </Link>
            </p>
        </div>
    );
}
