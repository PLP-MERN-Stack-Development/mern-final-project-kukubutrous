

import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function Profile() {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phoneNumber: "",
        location: "",
        roomType: "",
        budgetMin: "",
        budgetMax: "",
        hobbies: "",
        gender: "",
        preferredGender: "",
    });
    const [loading, setLoading] = useState(false);

    // ✅ Load user data when component mounts
    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                phoneNumber: user.phoneNumber || "",
                location: user.location || "",
                roomType: user.roomType || "",
                budgetMin: user.budgetMin || "",
                budgetMax: user.budgetMax || "",
                hobbies: Array.isArray(user.hobbies)
                    ? user.hobbies.join(", ")
                    : user.hobbies || "",
                gender: user.gender || "",
                preferredGender: user.preferredGender || "",
            });
        }
    }, [user]);

    // ✅ Handle input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Update profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // send to /users/me
            const res = await api.put("/users/me", {
                ...form,
                hobbies: form.hobbies
                    ? form.hobbies.split(",").map((h) => h.trim())
                    : [],
            });

            toast.success("Profile updated successfully!");

            // update user in auth context + localStorage
            setUser(res.data.user);
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Update Profile</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        placeholder="First Name"
                        className="border rounded-lg p-2 w-full"
                    />
                    <input
                        type="text"
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        placeholder="Last Name"
                        className="border rounded-lg p-2 w-full"
                    />
                </div>

                <input
                    type="text"
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    placeholder="Phone Number"
                    className="border rounded-lg p-2 w-full"
                />

                <input
                    type="text"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    placeholder="Location"
                    className="border rounded-lg p-2 w-full"
                />

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="roomType"
                        value={form.roomType}
                        onChange={handleChange}
                        placeholder="Room Type"
                        className="border rounded-lg p-2 w-full"
                    />
                    <input
                        type="text"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        placeholder="Gender"
                        className="border rounded-lg p-2 w-full"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <input
                        type="number"
                        name="budgetMin"
                        value={form.budgetMin}
                        onChange={handleChange}
                        placeholder="Budget Min"
                        className="border rounded-lg p-2 w-full"
                    />
                    <input
                        type="number"
                        name="budgetMax"
                        value={form.budgetMax}
                        onChange={handleChange}
                        placeholder="Budget Max"
                        className="border rounded-lg p-2 w-full"
                    />
                </div>

                <input
                    type="text"
                    name="preferredGender"
                    value={form.preferredGender}
                    onChange={handleChange}
                    placeholder="Preferred Gender"
                    className="border rounded-lg p-2 w-full"
                />

                <textarea
                    name="hobbies"
                    value={form.hobbies}
                    onChange={handleChange}
                    placeholder="Hobbies (comma-separated)"
                    className="border rounded-lg p-2 w-full"
                    rows="3"
                ></textarea>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition duration-200 disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
}
