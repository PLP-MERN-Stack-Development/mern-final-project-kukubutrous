import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function ResetPassword() {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState(null);

    async function submit(e) {
        e.preventDefault();
        try {
            const token = params.get("token");
            await api.post("/auth/reset-password", { token, password });
            setMsg("Password reset. Redirecting to login...");
            setTimeout(() => navigate("/login"), 1800);
        } catch (err) {
            setMsg(err?.response?.data?.message || "Failed");
        }
    }

    return (
        <div className="max-w-md mx-auto card">
            <h3 className="font-semibold mb-3">Choose a new password</h3>
            {msg && <div className="mb-2">{msg}</div>}
            <form onSubmit={submit}>
                <input value={password} onChange={e => setPassword(e.target.value)} placeholder="New password" type="password" className="w-full p-2 border rounded mb-3" />
                <button className="btn-brand">Reset password</button>
            </form>
        </div>
    );
}
