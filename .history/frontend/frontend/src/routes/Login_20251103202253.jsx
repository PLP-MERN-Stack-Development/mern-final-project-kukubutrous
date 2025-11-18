frontend/src/routes/Login.jsx`
```jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login(){
const [form,setForm]=useState({email:'',password:''});
const nav = useNavigate();
async function submit(e){ e.preventDefault(); const res = await axios.post('/api/auth/login', form); localStorage.setItem('token', res.data.token); axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`; nav('/dashboard'); }
return (
<form onSubmit={submit} style={{maxWidth:400,margin:'auto'}}>
<h2>Login</h2>
<input placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
<input placeholder="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
<button type="submit">Login</button>
</form>
);
}