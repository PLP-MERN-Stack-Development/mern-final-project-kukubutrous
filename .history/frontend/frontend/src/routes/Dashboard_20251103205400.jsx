import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';


export default function Dashboard(){
const [me,setMe]=useState(null);
const [users,setUsers]=useState([]);
const [socket,setSocket]=useState(null);
const [activeTab,setActiveTab]=useState('search');
const [conversations,setConversations]=useState([]);


useEffect(()=>{ async function load(){ const token = localStorage.getItem('token'); if (!token) return; axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; try{ const res = await axios.get('/api/users/me'); setMe(res.data.user); const s = io('/', { auth: { token } }); s.on('new_message', m => console.log('incoming', m)); s.on('admin_user_update', data => handleAdminEvent(data)); setSocket(s); }catch(err){ console.error(err); } } load(); }, []);


function handleAdminEvent(data){
// keep admin view in sync
if (!me) return;
if (me.role === 'admin' || me.role === 'superAdmin'){
// refresh list on changes (for simplicity)
fetchUsers();
}
}


async function fetchUsers(){ const res = await axios.get('/api/admin/users'); setUsers(res.data.users); }
async function search(){ const res = await axios.get('/api/users'); setUsers(res.data.users); setActiveTab('search'); }


async function startChat(otherId){ const res = await axios.post('/api/chats', { otherUserId: otherId }); const convo = res.data.conversation; const text = prompt('Type a message'); if (!text) return; socket.emit('private_message', { conversationId: convo.id, text }); }


async function changeRole(id, role){ await axios.put(`/api/admin/users/${id}/role`, { role }); }
async function removeUser(id){ if (!confirm('Delete user?')) return; await axios.delete(`/api/admin/users/${id}`); }


return (
<div className="min-h-screen bg-gray-50">
<div className="max-w-6xl mx-auto p-4">
<div className="flex items-center justify-between mb-6">
<h1 className="text-xl font-bold">Roommate Finder</h1>
<div>Welcome, <strong>{me?.firstName}</strong> <small className="ml-2 text-gray-500">({me?.role})</small></div>
</div>


<div className="grid grid-cols-4 gap-6">
<aside className="col-span-1 bg-white p-4 rounded shadow">
<nav className="space-y-2">
<button onClick={()=>setActiveTab('search')} className={`w-full text-left p-2 rounded ${activeTab==='search'?'bg-blue-50':'hover:bg-gray-100'}`}>Search</button>
<button onClick={()=>setActiveTab('convos')} className={`w-full text-left p-2 rounded ${activeTab==='convos'?'bg-blue-50':'hover:bg-gray-100'}`}>Conversations</button>
{(me?.role==='admin' || me?.role==='superAdmin') && (
<button onClick={()=>{ setActiveTab('admin'); fetchUsers(); }} className={`w-full text-left p-2 rounded ${activeTab==='admin'?'bg-blue-50':'hover:bg-gray-100'}`}>Manage Users</button>
)}
</nav>
</aside>


<main className="col-span-3">
{activeTab==='search' && (
<div className="bg-white p-6 rounded shadow">
<h2 className="text-lg font-semibold mb-4">Search Roommates</h2>
<button onClick={search} className="bg-indigo-600 text-white px-3 py-1 rounded mb-4">Find</button>
<ul className="space-y-2">
{users.map(u=> (
<li key={u.id} className="p-3 border rounded flex justify-between items-center">
<div>
<div className="font-semibold">{u.firstName} {u.lastName}</div>
<div className="text-sm text-gray-500">{u.email}</div>
</div>
<div className="flex items-center space-x-2">
<button onClick={()=>startChat(u.id)} className="bg-green-500 text-white px-2 py-1 rounded">Chat</button>
{(me?.role==='admin' || me?.role==='superAdmin') && (
<button onClick={()=>{ setActiveTab('admin'); fetchUsers(); }} className="text-sm text-indigo-600">Manage</button>
}
