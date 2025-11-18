//

import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import api from "../utils/api.js";
import toast from "react-hot-toast";

export default function Profile() {
    const { user, setUser } = useContext(AuthContext);
    const [form, setForm] = useState({ ...user });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.put(`/users/${user.id}`, form);
            toast.success("Profile updated!");
            setUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
            toast.error(err.response?.data?.message || "Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-4">My Profile</h2>
            <form className="space-y-2" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    placeholder="First Name"
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Email"
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="w-full border p-2 rounded"
                />
                <input
                    type="text"
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    placeholder="Gender"
                    className="w-full border p-2 rounded"
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
}
