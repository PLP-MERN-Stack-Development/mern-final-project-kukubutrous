//Register.jsx


import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
    const { register } = useAuth();
    const nav = useNavigate();
    const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '', email: '', password: '' });
    const [msg, setMsg] = useState('');

    const submit = async e => {
        e.preventDefault();
        try {
            await register(form);
            setMsg('Registered. Check email to verify');
            setTimeout(() => nav('/login'), 1800);
        } catch (err) {
            setMsg(err.response?.data?.message || 'Error');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded shadow w-96">
                <h2 className="text-xl font-semibold mb-4">Register</h2>
                {msg && <div className="mb-2">{msg}</div>}
                <form onSubmit={submit} className="space-y-2">
                    <input className="w-full border p-2" placeholder="First name" required value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                    <input className="w-full border p-2" placeholder="Last name" required value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                    <input className="w-full border p-2" placeholder="Phone" required value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
                    <input className="w-full border p-2" placeholder="Email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                    <input className="w-full border p-2" placeholder="Password" type="password" required value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                    <button className="bg-green-600 text-white w-full py-2 rounded">Register</button>
                </form>
            </div>
        </div>
    )
}

*/