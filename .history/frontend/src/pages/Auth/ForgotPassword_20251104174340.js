import React, { useState } from 'react'
import api from '../../api/axios.js'


export default function ForgotPassword(){
const [email, setEmail] = useState('')
const [msg, setMsg] = useState('')
const submit = async e => { e.preventDefault(); try { await api.post('/auth/request-password-reset', { email }); setMsg('If that email exists, a reset link was sent.') } catch (e) { setMsg('Error') } }
return (
<div className="max-w-md mx-auto">
<h2 className="text-2xl mb-4">Forgot Password</h2>
{msg && <div className="mb-2">{msg}</div>}
<form onSubmit={submit} className="space-y-2">
<input required type="email" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full p-2 border" />
<button className="w-full bg-indigo-600 text-white p-2">Send reset link</button>
</form>
</div>
)
}