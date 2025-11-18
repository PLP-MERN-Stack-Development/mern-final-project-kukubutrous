frontend/src/routes/Login.jsx` (Tailwind)

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login(){
const [form,setForm]=useState({email:'',password:''});
const nav = useNavigate();
async function submit(e){ e.preventDefault(); const res = await axios.post('/api/auth/login', form); localStorage.setItem('token', res.data.token); axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`; nav('/dashboard'); }
return (
<div className="min-h-screen flex items-center justify-center bg-gray-100">
<form onSubmit={submit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
<h2 className="text-2xl mb-4">Login</h2>
<input className="border p-2 w-full mb-2" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
<input className="border p-2 w-full mb-4" placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
<button className="bg-green-600 text-white px-4 py-2 rounded">Login</button>
</form>
</div>
);
}