// frontend/src/pages/VerifyEmail.jsx
import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";   // ✅ navigate added
import api from "../utils/api";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();   // ✅ added
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setError("Verification token missing.");
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await api.get(`/auth/verify?token=${token}`);
                setMessage(res.data.message || "Email verified successfully!");
            } catch (err) {
                setError(err.response?.data?.message || "Email verification failed.");
            }
        };

        verifyEmail();
    }, [searchParams]);

    // ✅ Auto redirect after success
    useEffect(() => {
        if (message) {
            setTimeout(() => navigate("/login"), 3000);
        }
    }, [message, navigate]);

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow bg-white text-center">
            <h1 className="text-2xl font-bold mb-4">Email Verification</h1>
            {message && <p className="text-green-600 mb-3">{message}</p>}
            {error && <p className="text-red-600 mb-3">{error}</p>}
            <Link
                to="/login"
                className="inline-block mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
                Go to Login
            </Link>
        </div>
    );
}

