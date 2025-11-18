import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile } from "../api/users";

export default function Profile() {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({ ...user });

  const handleUpdate = async () => {
    const updated = await updateProfile(form);
    setUser(updated);
    alert("Profile updated!");
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Profile</h2>
      <div className="flex flex-col gap-2 max-w-md">
        <input
          placeholder="First Name"
          className="border p-1 rounded"
          value={form.firstName || ""}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
        />
        <input
          placeholder="Last Name"
          className="border p-1 rounded"
          value={form.lastName || ""}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
        />
        <input
          placeholder="Phone"
          className="border p-1 rounded"
          value={form.phoneNumber || ""}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
        />
        <input
          placeholder="Location"
          className="border p-1 rounded"
          value={form.location || ""}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
        />
        <input
          placeholder="Room Type"
          className="border p-1 rounded"
          value={form.roomType || ""}
          onChange={(e) => setForm({ ...form, roomType: e.target.value })}
        />
        <input
          placeholder="Budget Min"
          type="number"
          className="border p-1 rounded"
          value={form.budgetMin || ""}
          onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
        />
        <input
          placeholder="Budget Max"
          type="number"
          className="border p-1 rounded"
          value={form.budgetMax || ""}
          onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
        />
        <input
          placeholder="Hobbies (comma separated)"
          className="border p-1 rounded"
          value={form.hobbies || ""}
          onChange={(e) => setForm({ ...form, hobbies: e.target.value })}
        />
        <button
          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
          onClick={handleUpdate}
        >
          Update
        </button>
      </div>
    </div>
  );
}
