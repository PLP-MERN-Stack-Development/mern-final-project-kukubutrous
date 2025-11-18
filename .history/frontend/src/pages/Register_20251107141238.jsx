// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";

export default function Register() {
    const [form, setForm] = useState({
        firstName: "", lastName: "", email: "", phoneNumber: "", password: ""
    });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setSuccess("");
        try {
            await API.post("/auth/register", form);
            setSuccess("✅ Registered successfully! Check your email to verify.");
            setTimeout(() => navigate("/login"), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6 text-brightGreen">Register</h2>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-brightGreen mb-4">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="firstName" placeholder="First Name" value={form.firstName} onChange={handleChange} className="w-full p-3 border rounded" required />
                    <input type="text" name="lastName" placeholder="Last Name" value={form.lastName} onChange={handleChange} className="w-full p-3 border rounded" required />
                    <input type="text" name="phoneNumber" placeholder="Phone Number" value={form.phoneNumber} onChange={handleChange} className="w-full p-3 border rounded" required />
                    <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full p-3 border rounded" required />
                    <input type="password" name="password" placeholder="Password" value={form.password} onChange={handleChange} className="w-full p-3 border rounded" required />
                    <button className="w-full bg-brightPink text-white py-3 rounded hover:bg-pink-600 transition">Register</button>
                </form>
                <p className="mt-4 text-sm">
                    Already have an account? <Link to="/login" className="text-brightGreen font-bold">Login</Link>
                </p>
            </div>
        </div>
    );
}
