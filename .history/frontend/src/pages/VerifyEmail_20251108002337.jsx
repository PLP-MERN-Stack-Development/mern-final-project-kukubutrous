import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [message, setMessage] = useState("Verifying your email...");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                if (!token) {
                    setMessage("Invalid verification link.");
                    setLoading(false);
                    return;
                }

                // ✅ Send token as a query parameter (matches backend)
                const response = await api.get(`/auth/verify?token=${token}`);
                setMessage(response.data.message || "Email verified successfully!");
            } catch (error) {
                console.error("Verification error:", error);
                setMessage("Verification failed. Please try again or contact support.");
            } finally {
                setLoading(false);
            }
        };

        verifyEmail();
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Email Verification</h2>
                {loading ? (
                    <p className="text-gray-500 animate-pulse">Please wait...</p>
                ) : (
                    <p className="text-gray-700">{message}</p>
                )}
            </div>
        </div>
    );
}
