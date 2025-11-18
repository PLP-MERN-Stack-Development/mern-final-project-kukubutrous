import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { io } from 'socket.io-client';

export default function Admin(){
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(()=> {
    const load = async ()=> {
      try {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } catch (err) {}
    };
    load();

    const url = (import.meta.env.VITE_API_URL || 'http://localhost:4000/api').replace(/\/api\/?$/,'');
    const s = io(url, { auth: { token } });
    s.on('adminUpdate', ()=> load());

    return ()=> s.disconnect();
  }, []);

  const promote = async (id) => {
    await api.patch(`/admin/promote/${id}`);
    const res = await api.get('/admin/users'); setUsers(res.data);
  };
  const demote = async (id) => {
    await api.patch(`/admin/demote/${id}`);
    const res = await api.get('/admin/users'); setUsers(res.data);
  };
  const remove = async (id) => {
    await api.delete(`/admin/delete/${id}`);
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-xl font-semibold mb-4">Admin Dashboard</h1>
      <div className="space-y-2">
        {users.map(u => (
          <div key={u.id} className="p-3 bg-white rounded flex justify-between items-center">
            <div>{u.firstName} {u.lastName} ({u.email}) - {u.role}</div>
            <div className="flex gap-2">
              <button onClick={()=>promote(u.id)} className="bg-green-500 text-white px-2 py-1 rounded">Promote</button>
              <button onClick={()=>demote(u.id)} className="bg-yellow-500 text-white px-2 py-1 rounded">Demote</button>
              <button onClick={()=>remove(u.id)} className="text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
