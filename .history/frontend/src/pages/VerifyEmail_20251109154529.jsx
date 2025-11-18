

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function VerifyEmail() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [message, setMessage] = useState("Verifying your email...");

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await api.get(`/auth/verify?token=${token}`);
                setMessage(res.data.message);
                setTimeout(() => navigate("/login"), 3000);
            } catch (err) {
                const errorMsg =
                    err.response?.data?.message ||
                    err.response?.data?.error ||
                    "Verification failed.";
                setMessage(errorMsg);
            }
        };
        if (token) verify();
    }, [token, navigate]);

    return (
        <div className="p-6 max-w-md mx-auto mt-20 border rounded-lg shadow text-center bg-white">
            <h1 className="text-2xl font-bold text-green-600 mb-4">Roommate Finder</h1>
            <p className="text-lg">{message}</p>
            <p className="text-sm text-gray-500 mt-3">Redirecting to login...</p>
        </div>
    );
}
*/