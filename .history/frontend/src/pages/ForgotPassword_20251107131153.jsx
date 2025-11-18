




/*
import React, { useState } from "react";
import api from "../utils/api";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [msg, setMsg] = useState(null);

    async function submit(e) {
        e.preventDefault();
        try {
            const res = await api.post("/auth/request-password-reset", { email });
            setMsg(res.data.message);
        } catch (err) {
            setMsg(err?.response?.data?.message || "Failed");
        }
    }

    return (
        <div className="max-w-md mx-auto card">
            <h3 className="font-semibold mb-3">Reset password</h3>
            {msg && <div className="mb-2">{msg}</div>}
            <form onSubmit={submit}>
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full p-2 border rounded mb-3" />
                <button className="btn-brand">Send reset link</button>
            </form>
        </div>
    );
}
*/