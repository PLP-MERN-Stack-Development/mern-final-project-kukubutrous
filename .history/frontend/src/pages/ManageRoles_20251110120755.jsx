// frontend/src/pages/ManageRoles.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export function ManageRoles() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/admin/users");
        setUsers(res.data.users);
      } catch (err) {
        toast.error("Failed to load users");
      }
    }
    load();
  }, []);

  const updateRole = async (id, role) => {
    try {
      await api.put(`/admin/users/${id}/role`, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
      toast.success("Role updated successfully");
    } catch (err) {
      toast.error("Failed to update role");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-semibold">Manage Roles</h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white rounded shadow p-4"
      >
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <motion.tr key={u.id} className="border-t" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <td className="p-2">{u.firstName} {u.lastName}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">
                  <select
                    value={u.role}
                    onChange={(e) => updateRole(u.id, e.target.value)}
                    className="border rounded p-1"
                  >
                    <option value="user">user</option>
                    <option value="admin">admin</option>
                    <option value="superAdmin">superAdmin</option>
                  </select>
                </td>
                <td className="p-2">
                  <button
                    onClick={() => updateRole(u.id, u.role)}
                    className="px-3 py-1 bg-sky-600 text-white rounded hover:bg-sky-700 transition"
                  >
                    Save
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </motion.div>
  );
}
