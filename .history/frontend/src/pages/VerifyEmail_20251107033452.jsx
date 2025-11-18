import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api";

export default function VerifyEmail() {
    const [params] = useSearchParams();
    const [msg, setMsg] = useState("Verifying...");

    useEffect(() => {
        async function verify() {
            const token = params.get("token");
            try {
                const res = await api.get(`/auth/verify?token=${token}`);
                setMsg(res.data.message || "Verified");
            } catch (err) {
                setMsg(err?.response?.data?.message || "Verification failed");
            }
        }
        verify();
    }, []);

    return <div className="card"><div>{msg}</div></div>;
}
