//login








/

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const { login } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [err, setErr] = useState('');

    const submit = async e => {
        e.preventDefault();
        try {
            await login(form.email, form.password);
            nav('/dashboard');
        } catch (er) {
            setErr(er.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded shadow w-96">
                <h2 className="text-xl font-semibold mb-4">Login</h2>
                {err && <div className="text-red-500 mb-2">{err}</div>}
                <form onSubmit={submit} className="space-y-2">
                    <input className="w-full border p-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input className="w-full border p-2" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <div className="flex justify-between items-center">
                        <a href="/forgot-password" className="text-sm">Forgot?</a>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded">Login</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
