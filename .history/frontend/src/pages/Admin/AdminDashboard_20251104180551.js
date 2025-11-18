import React, { useEffect, useState } from 'react'
import api from '../../api/axios.js'
import { getSocket } from '../../utils/socket'


export default function AdminDashboard() {
    const [users, setUsers] = useState([])
    useEffect(() => { (async () => { const res = await api.get('/admin/users'); setUsers(res.data.users) })() }, [])


    useEffect(() => {
        const s = getSocket(); if (!s) return;
        s.on('admin_user_update', data => {
            // naive handling: refetch users on any update
            api.get('/admin/users').then(r => setUsers(r.data.users))
        })
        return () => s?.off('admin_user_update')
    }, [])


    const setRole = async (id, role) => { await api.put(`/admin/users/${id}/role`, { role }); const res = await api.get('/admin/users'); setUsers(res.data.users) }
    const deleteUser = async id => { await api.delete(`/admin/users/${id}`); setUsers(prev => prev.filter(u => u.id !== id)) }


    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl mb-4">Admin</h2>
            <div className="space-y-2">
                {users.map(u => (
                    <div key={u.id} className="p-3 bg-white rounded flex justify-between items-center">
                        <div>{u.firstName} {u.lastName} ({u.email}) - {u.role}</div>
                        <div className="flex gap-2">
                            <select defaultValue={u.role} onChange={e => setRole(u.id, e.target.value)} className="border p-1">
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                                <option value="superAdmin">superAdmin</option>
                            </select>
                            <button onClick={() => deleteUser(u.id)} className="text-red-600">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}