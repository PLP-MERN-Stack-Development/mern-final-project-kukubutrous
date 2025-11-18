## `frontend/src/routes/Register.jsx`

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Register(){
const [form,setForm]=useState({firstName:'',lastName:'',phoneNumber:'',email:'',password:''});
const nav = useNavigate();
async function onSubmit(e){ e.preventDefault(); await axios.post('/api/auth/register', form); alert('Registered. Check email.'); nav('/'); }
return (
<form onSubmit={onSubmit} style={{maxWidth:400,margin:'auto'}}>
<h2>Register</h2>
<input placeholder="First" value={form.firstName} onChange={e=>setForm({...form,firstName:e.target.value})} required />
<input placeholder="Last" value={form.lastName} onChange={e=>setForm({...form,lastName:e.target.value})} required />
<input placeholder="Phone" value={form.phoneNumber} onChange={e=>setForm({...form,phoneNumber:e.target.value})} required />
<input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
<input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
<button type="submit">Register</button>
</form>
);
}