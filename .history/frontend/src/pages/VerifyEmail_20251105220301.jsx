import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("Verifying your email...");
    const nav = useNavigate();

    useEffect(() => {
        const token = searchParams.get("token");
        if (!token) {
            setMessage("Invalid verification link.");
            return;
        }

        async function verify() {
            try {
                const res = await api.get(`/auth/verify?token=${token}`);
                setMessage(res.data.message || "Email verified successfully!");
                setTimeout(() => nav("/login"), 2000);
            } catch (err) {
                setMessage(err.response?.data?.message || "Verification failed.");
            }
        }

        verify();
    }, [searchParams, nav]);

    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="bg-white p-8 rounded shadow text-center">
                <h1 className="text-xl font-semibold mb-4">Email Verification</h1>
                <p>{message}</p>
            </div>
        </div>
    );
}







/*
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function VerifyEmail() {
    const { token } = useParams();
    const nav = useNavigate();
    const [msg, setMsg] = useState('Verifying...');

    useEffect(() => {
        (async () => {
            try {
                await api.get(`/auth/verify/${token}`);
                setMsg('Email verified. You can login now.');
                setTimeout(() => nav('/login'), 1500);
            } catch (err) {
                setMsg(err.response?.data?.message || 'Verification failed');
            }
        })();
    }, [token]);

    return <div className="max-w-md mx-auto p-8">{msg}</div>
}
*/