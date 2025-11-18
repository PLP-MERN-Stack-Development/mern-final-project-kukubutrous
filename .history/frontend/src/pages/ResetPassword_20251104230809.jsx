import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

export default function ResetPassword() {
    const { token } = useParams();
    const nav = useNavigate();
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');

    const submit = async e => {
        e.preventDefault();
        try {
            await api.post(`/auth/reset/${token}`, { password });
            setMsg('Password reset successful');
            setTimeout(() => nav('/login'), 1200);
        } catch (err) {
            setMsg(err.response?.data?.message || 'Error');
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="bg-white p-8 rounded shadow w-96">
                <h2 className="text-xl mb-4">Reset Password</h2>
                {msg && <div className="mb-2">{msg}</div>}
                <form onSubmit={submit}>
                    <input className="w-full border p-2" placeholder="New password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
                    <button className="bg-indigo-600 text-white mt-2 w-full py-2 rounded">Reset</button>
                </form>
            </div>
        </div>
    )
}
