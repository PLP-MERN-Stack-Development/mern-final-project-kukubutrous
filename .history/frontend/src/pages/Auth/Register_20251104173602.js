import React, { useState } from 'react'
import api from '../../api/axios'


export default function Register() {
    const [form, setForm] = useState({ firstName: '', lastName: '', phoneNumber: '', email: '', password: '' })
    const [msg, setMsg] = useState('')


    const submit = async e => {
        e.preventDefault();
        try { await api.post('/auth/register', form); setMsg('Registered — check your email to verify') }
        catch (err) { setMsg(err.response?.data?.message || 'Error') }
    }


    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">Register</h2>
            {msg && <div className="mb-2">{msg}</div>}
            <form onSubmit={submit} className="space-y-2">
                <input required placeholder="First name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="w-full p-2 border" />
                <input required placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="w-full p-2 border" />
                <input required placeholder="Phone" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="w-full p-2 border" />
                <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full p-2 border" />
                <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="w-full p-2 border" />
                <button className="w-full bg-indigo-600 text-white p-2">Register</button>
            </form>
        </div>
    )
}