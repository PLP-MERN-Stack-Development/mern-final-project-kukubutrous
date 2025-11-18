import React, { useEffect, useState } from "react";
import { AdminLayout } from ".//AdminLayout.jsx";
import api from "./utils/api.jsx";

export default function AdminUsers() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                setUsers(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this user?")) return;
        try {
            await api.delete(`/users/${id}`);
            setUsers(prev => prev.filter(u => u.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold mb-4">Manage Users</h1>
            <table className="w-full border-collapse">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Role</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50">
                            <td className="border p-2">{u.firstName} {u.lastName}</td>
                            <td className="border p-2">{u.email}</td>
                            <td className="border p-2">{u.role}</td>
                            <td className="border p-2">
                                <button
                                    onClick={() => handleDelete(u.id)}
                                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </AdminLayout>
    );
}
