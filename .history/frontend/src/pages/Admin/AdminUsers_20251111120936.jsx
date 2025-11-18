import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout.jsx";
import api from "../../utils/api.js";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", role: "" });
  const [loading, setLoading] = useState(false);

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
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setForm({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    });
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.put(`/users/${selectedUser.id}`, form);
      setUsers((prev) =>
        prev.map((u) => (u.id === selectedUser.id ? { ...u, ...form } : u))
      );
      setSelectedUser(null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 bg-white rounded-xl shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h1 className="text-2xl font-semibold text-gray-800">Manage Users</h1>

          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700">
                <th className="p-3 text-left font-medium border-b">Name</th>
                <th className="p-3 text-left font-medium border-b">Email</th>
                <th className="p-3 text-left font-medium border-b">Role</th>
                <th className="p-3 text-center font-medium border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u, idx) => (
                  <tr
                    key={u.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-blue-50 transition-colors`}
                  >
                    <td className="p-3 border-b text-gray-800">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-3 border-b text-gray-600">{u.email}</td>
                    <td className="p-3 border-b text-gray-700 capitalize">{u.role}</td>
                    <td className="p-3 border-b text-center space-x-2">
                      <button
                        onClick={() => handleEdit(u)}
                        className="bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="p-6 text-center text-gray-500">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit User
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                placeholder="First name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                placeholder="Last name"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Role</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-white ${
                  loading ? "bg-blue-300" : "bg-blue-600 hover:bg-blue-700"
                } transition`}
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}



/*
import React, { useEffect, useState } from "react";
import { AdminLayout } from "../../layouts/AdminLayout.jsx";

import api from "../../utils/api.js";



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
*/