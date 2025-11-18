import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const res = await api.post("/auth/register", form);
            setMessage(res.data.message || "✅ Registration successful. Check your email!");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setMessage(err.response?.data?.message || "❌ Registration failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold text-center text-green-600 mb-6">Create Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {["firstName", "lastName", "phoneNumber", "email", "password"].map((field) => (
                        <input
                            key={field}
                            type={field === "password" ? "password" : "text"}
                            name={field}
                            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                            value={form[field]}
                            onChange={handleChange}
                            className="w-full border border-pink-300 rounded-lg p-2 focus:ring-2 focus:ring-green-500"
                            required
                        />
                    ))}
                    <button className="w-full bg-green-500 text-white p-2 rounded-lg hover:bg-green-600 transition">
                        Register
                    </button>
                </form>
                {message && <p className="text-center mt-4 text-sm text-gray-600">{message}</p>}
                <p className="text-center mt-4 text-sm">
                    Already have an account?{" "}
                    <span
                        className="text-pink-600 cursor-pointer hover:underline"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </span>
                </p>
            </div>
        </div>
    );
}
