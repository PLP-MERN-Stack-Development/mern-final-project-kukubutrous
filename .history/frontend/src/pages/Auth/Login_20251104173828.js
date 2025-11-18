import React, { useState } from 'react'
import api from '../../api/axios'
import { useAuth } from '../../context/AuthContext'


export default function Login(){
const { login } = useAuth()
const [form, setForm] = useState({ email:'', password:'' })
const [err, setErr] = useState('')


const submit = async e => {
e.preventDefault();
try {
const res = await api.post('/auth/login', form)
login(res.data.token, res.data.user)
window.location.href = '/dashboard'
} catch (e) { setErr(e.response?.data?.message || 'Login failed') }
}


return (
<div className="max-w-md mx-auto">
<h2 className="text-2xl font-bold mb-4">Login</h2>
{err && <div className="mb-2 text-red-600">{err}</div>}
<form onSubmit={submit} className="space-y-2">
<input required type="email" placeholder="Email" value={form.email} onChange={e=>setForm({...form, email:e.target.value})} className="w-full p-2 border" />
<input required type="password" placeholder="Password" value={form.password} onChange={e=>setForm({...form, password:e.target.value})} className="w-full p-2 border" />
<div className="flex justify-between">
<a href="/forgot-password" className="text-sm">Forgot?</a>
<button className="bg-indigo-600 text-white p-2">Login</button>
</div>
</form>
</div>
)
}