import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Link } from 'react-router-dom';

export default function Dashboard(){
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(()=> {
    (async ()=> {
      try {
        const res = await api.get('/users');
        setUsers(res.data);
      } catch (err) { /* ignore */ }
    })();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Welcome, {user?.firstName}</h1>
      <p>Role: {user?.role}</p>

      <h2 className="mt-6 mb-2 font-semibold">Find roommmates</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {users.map(u => (
          <div key={u.id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold">{u.firstName} {u.lastName}</div>
            <div className="text-sm">{u.email}</div>
            <Link to={`/conversations/${u.id}`} className="text-blue-500 text-sm mt-2 inline-block">Message</Link>
          </div>
        ))}
      </div>
    </div>
  )
}
