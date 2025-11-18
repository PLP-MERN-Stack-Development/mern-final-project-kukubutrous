import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Register() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "", email: "", password: "", gender: "", location: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", form);
            login(res.data.user, res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Register</h1>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
                <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                <input type="text" name="gender" placeholder="Gender" value={form.gender} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full border rounded px-3 py-2" required />
                <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">Register</button>
            </form>
            <p className="mt-4 text-center">
                Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
            </p>
        </div>
    );
}
