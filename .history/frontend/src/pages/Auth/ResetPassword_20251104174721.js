import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import api from '../../api/axios.js'


export default function ResetPassword() {
    const [q] = useSearchParams();
    const [password, setPassword] = useState('')
    const [msg, setMsg] = useState('')
    const submit = async e => { e.preventDefault(); try { const token = q.get('token'); await api.post(`/auth/reset-password?token=${token}`, { password }); setMsg('Password reset successful') } catch (e) { setMsg(e.response?.data?.message || 'Error') } }
    return (
        <div className="max-w-md mx-auto">
            <h2 className="text-2xl mb-4">Reset Password</h2>
            {msg && <div className="mb-2">{msg}</div>}
            <form onSubmit={submit} className="space-y-2">
                <input required type="password" placeholder="New password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border" />
                <button className="w-full bg-indigo-600 text-white p-2">Reset</button>
            </form>
        </div>
    )
}