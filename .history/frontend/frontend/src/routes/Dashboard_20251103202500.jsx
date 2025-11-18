frontend/src/routes/Dashboard.jsx` (basic search + chat trigger)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';


export default function Dashboard(){
const [me,setMe]=useState(null); const [users,setUsers]=useState([]); const [socket,setSocket]=useState(null);


useEffect(()=>{ async function load(){ const token = localStorage.getItem('token'); if (!token) return; axios.defaults.headers.common['Authorization'] = `Bearer ${token}`; const res = await axios.get('/api/users/me'); setMe(res.data.user); const s = io('/', { auth: { token } }); s.on('new_message', m => console.log('incoming', m)); setSocket(s); } load(); }, []);


async function search(){ const res = await axios.get('/api/users'); setUsers(res.data.users); }
async function startChat(otherId){ const res = await axios.post('/api/chats', { otherUserId: otherId }); const convo = res.data.conversation; const text = prompt('Type a message'); if (!text) return; socket.emit('private_message', { conversationId: convo.id, text }); }


return (
<div style={{padding:20}}>
<h1>Welcome {me?.firstName}</h1>
<button onClick={search}>Find Roommates</button>
<ul>{users.map(u=> <li key={u.id}>{u.firstName} {u.lastName} <button onClick={()=>startChat(u.id)}>Chat</button></li>)}</ul>
</div>
);
}