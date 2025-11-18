import React, { useState, useEffect } from 'react'
import api from '../../api/axios.js'
import { useAuth } from '../../context/AuthContext'


export default function Profile(){
const { user, setUser } = useAuth()
const [form, setForm] = useState({})
useEffect(()=> setForm(user || {}), [user])
const submit = async e => { e.preventDefault(); const res = await api.put('/users/me', form); setUser(res.data.user); alert('Profile updated') }
return (
<div className="max-w-2xl mx-auto">
<h2 className="text-xl mb-4">Profile</h2>
<form onSubmit={submit} className="space-y-2">
<input value={form.firstName||''} onChange={e=>setForm({...form, firstName:e.target.value})} className="w-full p-2 border" />
<input value={form.lastName||''} onChange={e=>setForm({...form, lastName:e.target.value})} className="w-full p-2 border" />
<input value={form.phoneNumber||''} onChange={e=>setForm({...form, phoneNumber:e.target.value})} className="w-full p-2 border" />
<input value={form.location||''} onChange={e=>setForm({...form, location:e.target.value})} className="w-full p-2 border" />
<button className="bg-indigo-600 text-white p-2">Save</button>
</form>
</div>
)
}