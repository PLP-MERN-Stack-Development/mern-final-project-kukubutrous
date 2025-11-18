import React, { useState } from 'react';
import api from '../utils/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [msg, setMsg] = useState('');
    const submit = async e => {
        e.preventDefault();
        try {
            await api.post('/auth/forgot-password', { email });
            setMsg('If that email exists, a reset link was sent.');
        } catch (err) {
            setMsg('Error sending reset email');
        }
    };
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded shadow w-96">
                <h2 className="text-xl mb-4">Forgot Password</h2>
                {msg && <div className="mb-2">{msg}</div>}
                <form onSubmit={submit}>
                    <input className="w-full border p-2" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                    <button className="bg-indigo-600 text-white mt-2 w-full py-2 rounded">Send reset link</button>
                </form>
            </div>
        </div>
    )
}
