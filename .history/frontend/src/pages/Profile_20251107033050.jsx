import React, { useContext, useState } from "react";
import { AuthContext } from "../App";
import api from "../utils/api";

export default function Profile() {
    const { user, setUser } = useContext(AuthContext);
    const [form, setForm] = useState(user || {});

    async function save() {
        try {
            const res = await api.put("/users/me", form);
            setUser(res.data.user);
            alert("Saved");
        } catch (err) {
            console.error(err);
            alert("Save failed");
        }
    }

    return (
        <div className="max-w-2xl card">
            <h2 className="text-2xl font-semibold mb-4">Profile</h2>
            <div className="grid grid-cols-2 gap-3">
                <input value={form.firstName || ""} onChange={e => setForm({ ...form, firstName: e.target.value })} className="p-2 border rounded" />
                <input value={form.lastName || ""} onChange={e => setForm({ ...form, lastName: e.target.value })} className="p-2 border rounded" />
                <input value={form.phoneNumber || ""} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="p-2 border rounded" />
                <input value={form.location || ""} onChange={e => setForm({ ...form, location: e.target.value })} className="p-2 border rounded" />
                <input value={form.roomType || ""} onChange={e => setForm({ ...form, roomType: e.target.value })} className="p-2 border rounded" />
                <input value={form.hobbies || ""} onChange={e => setForm({ ...form, hobbies: e.target.value })} className="p-2 border rounded" />
            </div>
            <div className="mt-4">
                <button onClick={save} className="btn-brand">Save Profile</button>
            </div>
        </div>
    );
}
