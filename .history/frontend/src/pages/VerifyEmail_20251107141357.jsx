// src/pages/VerifyEmail.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function VerifyEmail() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    useEffect(() => {
        if (!token) return;
        API.get(`/auth/verify?token=${token}`)
            .then(res => {
                setMessage(res.data.message);
                setTimeout(() => navigate("/login"), 3000);
            })
            .catch(err => setError(err.response?.data?.message || "Verification failed"));
    }, [token]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                <h2 className="text-2xl font-bold mb-6 text-brightGreen">Email Verification</h2>
                {message && <p className="text-brightGreen">{message}</p>}
                {error && <p className="text-red-500">{error}</p>}
            </div>
        </div>
    );
}
