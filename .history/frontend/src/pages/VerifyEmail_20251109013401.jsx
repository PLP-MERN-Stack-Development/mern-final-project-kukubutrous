//Verify





import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Verifying email...");

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`/auth/verify-email/${token}`);
                setMessage(res.data.message);
                setTimeout(() => navigate("/login"), 3000);
            } catch (err) {
                setMessage(err.response?.data?.error || "Verification failed");
            }
        };
        verify();
    }, [token, navigate]);

    return (
        <div className="p-6 max-w-md mx-auto mt-10 border rounded shadow text-center">
            <h1 className="text-xl font-bold">{message}</h1>
        </div>
    );
}
