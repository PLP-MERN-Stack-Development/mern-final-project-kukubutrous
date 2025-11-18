import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(form.email, form.password);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-8 shadow-md rounded-xl w-96">
                <h1 className="text-2xl font-semibold mb-6 text-center">Login</h1>
                {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                    <input
                        type="email"
                        placeholder="Email"
                        className="border p-2 rounded"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border p-2 rounded"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                    <button className="bg-blue-500 hover:bg-blue-600 text-white rounded p-2">
                        Login
                    </button>
                </form>
                <p className="text-sm mt-3 text-center">
                    Don’t have an account?{" "}
                    <Link to="/register" className="text-blue-500">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
