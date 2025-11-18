import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Register() {
    const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '', email: '', password: '' });
    const nav = useNavigate();
    async function onSubmit(e) { e.preventDefault(); await axios.post('/api/auth/register', form); alert('Registered. Check email.'); nav('/'); }
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={onSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl mb-4">Register</h2>
                <input className="border p-2 w-full mb-2" placeholder="First" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
                <input className="border p-2 w-full mb-2" placeholder="Last" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
                <input className="border p-2 w-full mb-2" placeholder="Phone" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} required />
                <input className="border p-2 w-full mb-2" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
                <input className="border p-2 w-full mb-4" placeholder="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
                <button className="bg-blue-600 text-white px-4 py-2 rounded">Register</button>
            </form>
        </div>
    );
}