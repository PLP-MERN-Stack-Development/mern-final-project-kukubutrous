import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function VerifyEmail() {
    const [message, setMessage] = useState("Verifying your email...");
    const [success, setSuccess] = useState(false);
    const [params] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const token = params.get("token");
        if (!token) {
            setMessage("Invalid or missing token.");
            return;
        }

        api.post("/auth/verify", { token })
            .then(() => {
                setMessage("✅ Email verified successfully! Redirecting...");
                setSuccess(true);
                setTimeout(() => navigate("/login"), 2500);
            })
            .catch(() => setMessage("❌ Verification failed. Try again."));
    }, [params, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-100 to-green-100 text-gray-800">
            <div className="p-8 bg-white shadow-2xl rounded-2xl text-center w-[90%] max-w-md">
                <h1 className="text-2xl font-bold text-green-700 mb-4">Email Verification</h1>
                <p className={`text-lg ${success ? "text-green-600" : "text-pink-600"}`}>
                    {message}
                </p>
            </div>
        </div>
    );
}
