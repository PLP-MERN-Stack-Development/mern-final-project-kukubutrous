import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Trash2, UserCog } from "lucide-react";
import api from "../utils/api";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data);
      } catch (err) {
        setMessage("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleRoleChange = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      setMessage("User role updated successfully.");
      setUsers((prev) =>
        prev.map((user) => (user.id === id ? { ...user, role } : user))
      );
    } catch {
      setMessage("Error updating role.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter((u) => u.id !== id));
      setMessage("User deleted successfully.");
    } catch {
      setMessage("Error deleting user.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-200 dark:from-gray-900 dark:to-gray-800 transition-all">
      <div className="max-w-5xl mx-auto py-10 px-6">
        <motion.h1
          className="text-4xl font-bold text-green-700 dark:text-green-400 mb-6 flex items-center gap-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ShieldCheck className="w-8 h-8" />
          Admin Dashboard
        </motion.h1>

        {message && (
          <motion.div
            className="p-4 mb-6 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 rounded-xl shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {message}
          </motion.div>
        )}

        {loading ? (
          <div className="text-gray-500 dark:text-gray-300">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="text-gray-500 dark:text-gray-300">No users found.</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {users.map((user, i) => (
              <motion.div
                key={user.id}
                className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                    {user.firstName} {user.lastName}
                  </h2>
                  <UserCog className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-2">
                  {user.email}
                </p>

                <div className="flex items-center gap-3">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="border dark:border-gray-700 rounded-lg px-3 py-1 text-sm bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-green-500"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="superAdmin">Super Admin</option>
                  </select>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="flex items-center gap-1 px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;





/*
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