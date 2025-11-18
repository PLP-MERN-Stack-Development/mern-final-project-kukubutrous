




/
import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Admin() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/admin/users");
                setUsers(res.data.users);
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    async function setRole(id, role) {
        try {
            await api.put(`/admin/users/${id}/role`, { role });
            setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
        } catch (err) { console.error(err); alert("Failed"); }
    }

    async function removeUser(id) {
        if (!confirm("Delete user?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) { console.error(err); alert("Failed"); }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-4">Admin</h2>
            <div className="grid gap-2">
                {users.map(u => (
                    <div key={u.id} className="card flex items-center justify-between">
                        <div>
                            <div className="font-semibold">{u.firstName} {u.lastName}</div>
                            <div className="text-sm text-gray-500">{u.email}</div>
                        </div>
                        <div className="flex gap-2">
                            <select value={u.role} onChange={e => setRole(u.id, e.target.value)} className="px-2 py-1 border rounded">
                                <option value="user">user</option>
                                <option value="admin">admin</option>
                                <option value="superAdmin">superAdmin</option>
                            </select>
                            <button onClick={() => removeUser(u.id)} className="btn-brand-outline">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
*/