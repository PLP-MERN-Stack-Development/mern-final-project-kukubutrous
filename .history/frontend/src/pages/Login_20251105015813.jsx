//login
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
            const user = await login(form.email, form.password);
            console.log('✅ Login successful:', user);
            nav('/dashboard');
        } catch (er) {
            console.error('❌ Login failed:', er);
            setErr(er.response?.data?.message || 'Invalid email or password');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
            <div className="bg-white p-8 rounded shadow w-96">
                <h2 className="text-xl font-semibold mb-4 text-center">Welcome Back</h2>
                {err && <div className="text-red-600 mb-2 text-center">{err}</div>}
                <form onSubmit={submit} className="space-y-2">
                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Email"
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                    />
                    <input
                        className="w-full border p-2 rounded"
                        placeholder="Password"
                        type="password"
                        required
                        value={form.password}
                        onChange={e => setForm({ ...form, password: e.target.value })}
                    />
                    <div className="flex justify-between items-center">
                        <a href="/forgot-password" className="text-sm text-blue-600 hover:underline">
                            Forgot password?
                        </a>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                            Login
                        </button>
                    </div>
                </form>
                <p className="mt-3 text-center text-sm">
                    Dont have an account?{' '}
                    <a href="/register" className="text-blue-600 hover:underline">
                        Register
                    </a>
                </p>
            </div>
        </div>
    );
}








/*

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
*/