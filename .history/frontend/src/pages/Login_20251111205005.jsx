//frontend/src/pages/Login.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // 👁️ toggle state
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await login(email, password);
        setLoading(false);

        if (res.success) {
            toast.success("Logged in successfully!");
            navigate("/");
        } else {
            toast.error(res.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-xl font-bold mb-4 text-center text-green-700">
                    Login
                </h2>

                {/* Email input */}
                <label className="block mb-2">
                    Email
                    <input
                        type="email"
                        className="w-full border p-2 rounded mt-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                {/* Password input with show/hide toggle */}
                <label className="block mb-4 relative">
                    Password
                    <input
                        type={showPassword ? "text" : "password"}
                        className="w-full border p-2 rounded mt-1 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {/* 👁️ Toggle button */}
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-9 text-gray-500 hover:text-gray-700 text-sm"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </label>

                {/* Login button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

                {/* 🔗 Navigation links */}
                <div className="flex justify-between text-sm mt-4">
                    <Link to="/register" className="text-green-600 hover:underline">
                        Create account
                    </Link>
                    <Link to="/forgot-password" className="text-green-600 hover:underline">
                        Forgot password?
                    </Link>
                </div>
            </form>
        </div>
    );
}






/*
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

export default function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const res = await login(email, password);
        setLoading(false);

        if (res.success) {
            toast.success("Logged in successfully!");
            navigate("/");
        } else {
            toast.error(res.message || "Login failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-sm"
            >
                <h2 className="text-xl font-bold mb-4">Login</h2>

                <label className="block mb-2">
                    Email
                    <input
                        type="email"
                        className="w-full border p-2 rounded mt-1"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>

                <label className="block mb-4">
                    Password
                    <input
                        type="password"
                        className="w-full border p-2 rounded mt-1"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}
*/