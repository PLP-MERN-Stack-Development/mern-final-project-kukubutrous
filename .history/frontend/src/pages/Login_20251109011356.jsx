





/
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
        try {
            const res = await api.post("/auth/login", { email, password });
            login(res.data.user, res.data.token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.error || "Login failed");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Login</h1>
            {error && <p className="text-red-600 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
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
                <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">
                    Login
                </button>
            </form>
            <div className="mt-4 text-center">
                <Link to="/forgot-password" className="text-blue-600">
                    Forgot Password?
                </Link>
                <p>
                    Don't have an account? <Link to="/register" className="text-blue-600">Register</Link>
                </p>
            </div>
        </div>
    );
}
*/