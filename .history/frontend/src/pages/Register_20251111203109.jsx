//frontend/src/pages/Register.jsx
import React, { useState } from "react";
import api from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        gender: "",
        location: "",
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post("/auth/register", form);
            toast.success("Registration successful! Check your email for verification.");
            navigate("/login");
        } catch (err) {
            toast.error(err.response?.data?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-md space-y-4"
            >
                <h2 className="text-xl font-bold">Register</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                        type="text"
                        name="firstName"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={handleChange}
                        className="border p-2 rounded"
                        required
                    />
                </div>

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                    required
                />

                <input
                    type="text"
                    name="gender"
                    placeholder="Gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                />

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={form.location}
                    onChange={handleChange}
                    className="border p-2 rounded w-full"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    {loading ? "Registering..." : "Register"}
                </button>
            </form>
        </div>
    );
}
