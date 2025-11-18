// src/pages/Admin.jsx
import { useEffect, useState } from "react";
import API from "../utils/api";

export default function Admin() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await API.put(`/admin/users/${id}/role`, { role });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-brightGreen mb-4">Admin Panel</h1>
      <table className="w-full border-collapse border">
        <thead className="bg-brightPink text-white">
          <tr>
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="hover:bg-gray-100">
              <td className="p-2 border">{u.id}</td>
              <td className="p-2 border">{u.firstName} {u.lastName}</td>
              <td className="p-2 border">{u.email}</td>
              <td className="p-2 border">{u.role}</td>
              <td className="p-2 border space-x-2">
                {["user", "admin", "superAdmin"].map(r => 
                  <button key={r} onClick={() => handleRoleChange(u.id, r)} className={`px-2 py-1 rounded text-white ${r==="user"?"bg-brightGreen":"bg-brightPink"} hover:opacity-80 transition`}>{r}</button>
                )}
                <button onClick={() => handleDelete(u.id)} className="px-2 py-1 rounded bg-red-500 text-white hover:opacity-80 transition">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
