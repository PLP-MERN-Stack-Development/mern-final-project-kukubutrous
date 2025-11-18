//
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/api";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/auth/login", { email, password });
            const { user, token } = res.data;

            // Store token and user in AuthContext
            login(user, token);

            // Redirect based on role
            if (user.role === "superAdmin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/dashboard");
            }
        } catch (err) {
            const message =
                err.response?.data?.message ||
                "❌ Login failed. Please try again.";
            setError(message);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow bg-white">
            <h1 className="text-2xl font-bold mb-4 text-center">Login</h1>
            {error && <p className="text-red-600 mb-2 text-center">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="email"
                    placeholder="Email"
                    className="w-full border rounded px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded"
                >
                    Login
                </button>
            </form>

            <div className="mt-4 text-center">
                <Link to="/forgot-password" className="text-blue-600 hover:underline">
                    Forgot Password?
                </Link>
                <p className="mt-2">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-600 hover:underline">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}

