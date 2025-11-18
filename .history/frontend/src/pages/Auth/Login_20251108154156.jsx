import React, { useState } from "react";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const { setUser, setToken } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await loginUser(form);
            setUser(res.user);
            setToken(res.token);
            navigate("/"); // redirect to main page
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
            <form
                className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
                onSubmit={handleLogin}
            >
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="border p-2 rounded w-full mb-3"
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="border p-2 rounded w-full mb-3"
                    required
                />
                <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 text-center">
                    Don't have an account?{" "}
                    <Link className="text-blue-500 hover:underline" to="/register">
                        Register
                    </Link>
                </p>
            </form>
        </div>
    );
}
