// frontend/src/pages/ResetPassword.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false); // 👁️
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👁️
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            await api.post(`/auth/reset-password?token=${token}`, { password });
            setMessage("✅ Password reset successfully!");
            navigate("/login");
        } catch (err) {
            setMessage(err.response?.data?.message || "Reset failed");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow bg-white">
            <h1 className="text-xl font-bold mb-4 text-center text-green-700">Reset Password</h1>
            {message && <p className="mb-2 text-red-600 text-center">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-3">
                {/* 👁️ Password field */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="New Password"
                        className="w-full border rounded px-3 py-2 pr-10"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 text-sm"
                    >
                        {showPassword ? "Hide" : "Show"}
                    </button>
                </div>

                {/* 👁️ Confirm password field */}
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm Password"
                        className="w-full border rounded px-3 py-2 pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2 top-2 text-gray-500 hover:text-gray-700 text-sm"
                    >
                        {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                </div>

                <button
                    type="submit"
                    className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 transition"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}






/*
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        try {
            await api.post(`/auth/reset-password?token=${token}`, { password });
            setMessage("✅ Password reset successfully!");
            navigate("/login");
        } catch (err) {
            setMessage(err.response?.data?.message || "Reset failed");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
            <h1 className="text-xl font-bold mb-4">Reset Password</h1>
            {message && <p className="mb-2 text-red-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border rounded px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border rounded px-3 py-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-green-500 text-white px-3 py-2 rounded"
                >
                    Reset Password
                </button>
            </form>
        </div>
    );
}
*/



/*
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPassword() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }
        try {
            await api.post(`/auth/reset-password/${token}`, { password });
            setMessage("Password reset successfully!");
            navigate("/login");
        } catch (err) {
            setMessage(err.response?.data?.error || "Reset failed");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
            <h1 className="text-xl font-bold mb-4">Reset Password</h1>
            {message && <p className="mb-2 text-red-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="password"
                    placeholder="New Password"
                    className="w-full border rounded px-3 py-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border rounded px-3 py-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">
                    Reset Password
                </button>
            </form>
        </div>
    );
}
*/