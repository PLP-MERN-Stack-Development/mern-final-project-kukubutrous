//

import React, { useState } from "react";
import api from "../utils/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/forgot-password", { email });
            setMessage(res.data.message);
        } catch (err) {
            setMessage(err.response?.data?.error || "Failed to request reset");
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow">
            <h1 className="text-xl font-bold mb-4">Forgot Password</h1>
            {message && <p className="mb-2 text-green-600">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-2">
                <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full border rounded px-3 py-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit" className="w-full bg-green-500 text-white px-3 py-2 rounded">
                    Submit
                </button>
            </form>
        </div>
    );
}
