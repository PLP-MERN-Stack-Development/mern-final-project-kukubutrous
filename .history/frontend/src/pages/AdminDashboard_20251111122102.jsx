import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useSocket } from "../hooks/useSocket.jsx";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Users, CheckCircle, MessageSquare, MessageCircle, Edit } from "lucide-react";

export function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalChats: 0,
    totalMessages: 0,
  });
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form, setForm] = useState({ email: "", role: "" });
  const [saving, setSaving] = useState(false);
  const socketRef = useSocket();

  useEffect(() => {
    async function load() {
      try {
        const s = await api.get("/admin/dashboard/stats");
        setStats(s.data);
        const u = await api.get("/admin/users");
        setUsers(u.data.users);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load dashboard data.");
      }
    }
    load();
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return;

    const onUpdate = (update) => {
      if (update.action === "deleted") {
        setUsers((prev) => prev.filter((x) => x.id !== update.user.id));
        toast.error(`User ${update.user.email} deleted`);
      }
      if (update.action === "role_changed") {
        setUsers((prev) =>
          prev.map((x) =>
            x.id === update.user.id ? { ...x, role: update.user.role } : x
          )
        );
        toast.success(`Role updated for ${update.user.email}`);
      }
      if (update.action === "created") {
        setUsers((prev) => [update.user, ...prev]);
        toast.success(`New user created: ${update.user.email}`);
      }
    };

    socket.on("admin_user_update", onUpdate);
    return () => socket.off("admin_user_update", onUpdate);
  }, [socketRef]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
      toast.success("User deleted successfully");
    } catch {
      toast.error("Failed to delete user");
    }
  };

  const openEditModal = (user) => {
    setSelectedUser(user);
    setForm({ email: user.email, role: user.role });
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    setSaving(true);
    try {
      await api.put(`/admin/users/${selectedUser.id}`, form);
      setUsers((prev) =>
        prev.map((u) =>
          u.id === selectedUser.id ? { ...u, ...form } : u
        )
      );
      toast.success("User updated successfully");
      setSelectedUser(null);
    } catch {
      toast.error("Failed to update user");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 p-6"
    >
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </header>

      {/* Stats */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users size={24} />} color="from-blue-500 to-blue-600" title="Users" value={stats.totalUsers} />
        <StatCard icon={<CheckCircle size={24} />} color="from-green-500 to-green-600" title="Verified" value={stats.verifiedUsers} />
        <StatCard icon={<MessageSquare size={24} />} color="from-purple-500 to-purple-600" title="Chats" value={stats.totalChats} />
        <StatCard icon={<MessageCircle size={24} />} color="from-orange-500 to-orange-600" title="Messages" value={stats.totalMessages} />
      </section>

      {/* Latest Users */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-md p-5"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Latest Users
        </h2>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3">#</th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u, i) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="border-t hover:bg-blue-50 transition"
                  >
                    <td className="p-3 text-gray-700">{i + 1}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {u.firstName} {u.lastName}
                    </td>
                    <td className="p-3 text-gray-600">{u.email}</td>
                    <td className="p-3 capitalize text-gray-700">{u.role}</td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => openEditModal(u)}
                        className="px-3 py-1.5 bg-blue-500 text-white text-sm rounded-lg hover:bg-blue-600 transition inline-flex items-center gap-1"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="px-3 py-1.5 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-6 text-center text-gray-500 italic"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.section>

      {/* Edit User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md"
          >
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Edit User
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                value={`${selectedUser.firstName} ${selectedUser.lastName}`}
                readOnly
                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-700"
              />
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
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
                disabled={saving}
                className={`px-4 py-2 rounded-lg text-white ${
                  saving
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                } transition`}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

// Reusable Card Component
function StatCard({ icon, title, value, color }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 250 }}
      className="bg-white rounded-xl shadow-md p-5 flex items-center justify-between border border-gray-100 hover:shadow-lg transition"
    >
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
      <div
        className={`p-3 rounded-full bg-gradient-to-br ${color} text-white shadow`}
      >
        {icon}
      </div>
    </motion.div>
  );
}





/*
import React, { useEffect, useState } from "react";
import api from "../utils/api.js";
import { useSocket } from "../hooks/useSocket.jsx";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export function AdminDashboard() {
    const [stats, setStats] = useState({ totalUsers: 0, verifiedUsers: 0, totalChats: 0, totalMessages: 0 });
    const [users, setUsers] = useState([]);
    const socketRef = useSocket();

    useEffect(() => {
        async function load() {
            try {
                const s = await api.get("/admin/dashboard/stats");
                setStats(s.data);

                const u = await api.get("/admin/users");
                setUsers(u.data.users);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load dashboard data.");
            }
        }
        load();
    }, []);

    useEffect(() => {
        const socket = socketRef.current;
        if (!socket) return;

        const onUpdate = (update) => {
            if (update.action === "deleted") {
                setUsers((prev) => prev.filter((x) => x.id !== update.user.id));
                toast.error(`User ${update.user.email} deleted`);
            }
            if (update.action === "role_changed") {
                setUsers((prev) => prev.map((x) => (x.id === update.user.id ? { ...x, role: update.user.role } : x)));
                toast.success(`Role updated for ${update.user.email}`);
            }
            if (update.action === "created") {
                setUsers((prev) => [update.user, ...prev]);
                toast.success(`New user created: ${update.user.email}`);
            }
        };

        socket.on("admin_user_update", onUpdate);
        return () => socket.off("admin_user_update", onUpdate);
    }, [socketRef]);

    const handleDelete = async (id) => {
        if (!confirm("Delete this user?")) return;
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers((prev) => prev.filter((u) => u.id !== id));
            toast.success("User deleted successfully");
        } catch {
            toast.error("Failed to delete user");
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="space-y-6 p-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            </header>

            <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <AnimatedCard title="Users" value={stats.totalUsers} />
                <AnimatedCard title="Verified" value={stats.verifiedUsers} />
                <AnimatedCard title="Chats" value={stats.totalChats} />
                <AnimatedCard title="Messages" value={stats.totalMessages} />
            </section>

            <motion.section initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="bg-white rounded shadow p-4">
                <h2 className="text-lg font-medium mb-4">Latest Users</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-100">
                                <th className="p-2">#</th>
                                <th className="p-2">Name</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Role</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, i) => (
                                <motion.tr key={u.id} className="border-t hover:bg-slate-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                    <td className="p-2">{i + 1}</td>
                                    <td className="p-2">{u.firstName} {u.lastName}</td>
                                    <td className="p-2">{u.email}</td>
                                    <td className="p-2 capitalize">{u.role}</td>
                                    <td className="p-2">
                                        <button onClick={() => handleDelete(u.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition">Delete</button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </motion.section>
        </motion.div>
    );
}

function AnimatedCard({ title, value }) {
    return (
        <motion.div whileHover={{ scale: 1.05 }} className="bg-white rounded-lg p-4 shadow cursor-pointer transition">
            <span className="text-sm text-slate-500">{title}</span>
            <span className="text-2xl font-bold block mt-1">{value}</span>
        </motion.div>
    );
}
*/