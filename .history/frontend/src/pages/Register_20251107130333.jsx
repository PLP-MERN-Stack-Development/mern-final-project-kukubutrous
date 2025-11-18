




/*
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function Register() {
    const [form, setForm] = useState({ firstName: "", lastName: "", phoneNumber: "", email: "", password: "" });
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();

    async function submit(e) {
        e.preventDefault();
        try {
            await api.post("/auth/register", form);
            setMsg("Registered. Check your email for verification.");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setMsg(err?.response?.data?.message || "Registration failed");
        }
    }

    return (
        <div className="max-w-lg mx-auto card">
            <h2 className="text-2xl font-bold mb-4">Create account</h2>
            {msg && <div className="mb-3 text-sm">{msg}</div>}
            <form onSubmit={submit} className="grid grid-cols-2 gap-3">
                <input placeholder="First name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="col-span-1 px-3 py-2 border rounded" />
                <input placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="col-span-1 px-3 py-2 border rounded" />
                <input placeholder="Phone" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="col-span-2 px-3 py-2 border rounded" />
                <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="col-span-2 px-3 py-2 border rounded" />
                <input placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="col-span-2 px-3 py-2 border rounded" />
                <button className="btn-brand col-span-2">Create account</button>
            </form>
        </div>
    );
}
*/