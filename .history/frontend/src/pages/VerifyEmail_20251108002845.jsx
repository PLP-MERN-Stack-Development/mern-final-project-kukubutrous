import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function VerifyEmail() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Verifying...");

    useEffect(() => {
        const verify = async () => {
            try {
                const token = params.get("token");
                if (!token) return setMessage("❌ Missing verification token");
                const res = await api.get(`/auth/verify?token=${token}`);
                setMessage(res.data.message || "✅ Email verified successfully!");
                setTimeout(() => navigate("/login"), 3000);
            } catch (err) {
                setMessage(err.response?.data?.message || "❌ Verification failed");
            }
        };
        verify();
    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen bg-pink-100">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <h2 className="text-2xl font-semibold text-green-600 mb-4">Email Verification</h2>
                <p className="text-gray-700">{message}</p>
            </div>
        </div>
    );
}
