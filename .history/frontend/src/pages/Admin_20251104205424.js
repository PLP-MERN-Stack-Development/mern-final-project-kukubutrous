import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useAuth } from "../context/AuthContext.js";
import { io } from "socket.io-client";

const Admin = () => {
    const { token } = useAuth();
    const [users, setUsers] = useState([]);
    const socket = io(import.meta.env.VITE_API_URL.replace("/api", ""), { auth: { token } });

    useEffect(() => {
        const loadUsers = async () => {
            const { data } = await api.get("/admin/users");
            setUsers(data);
        };
        loadUsers();

        socket.on("admin_update", (data) => {
            console.log("Admin update received:", data);
            loadUsers();
        });

        return () => socket.disconnect();
    }, []);

    const handleDelete = async (id) => {
        await api.delete(`/admin/users/${id}`);
        socket.emit("admin_action", { type: "delete_user", id });
    };

    return (
        <div className="p-5">
            <h1 className="text-xl font-semibold mb-3">Admin Dashboard</h1>
            <table className="w-full bg-white rounded shadow">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2">Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th className="text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.userId} className="border-t">
                            <td className="p-2">{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.role}</td>
                            <td className="text-right">
                                <button
                                    onClick={() => handleDelete(u.userId)}
                                    className="text-red-500 text-sm"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
