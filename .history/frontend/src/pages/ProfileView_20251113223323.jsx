//frontend/src/pages/
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function ProfileView() {
    const { id } = useParams();
    const { user: currentUser, setUser } = useAuth();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({});
    const [preview, setPreview] = useState("");

    const isOwnProfile = !id || id === currentUser?.id.toString();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const url = isOwnProfile ? "/users/me" : `/users/${id}`;
                const res = await api.get(url);
                setUserData(res.data);
                setForm({
                    firstName: res.data.firstName || "",
                    lastName: res.data.lastName || "",
                    email: res.data.email || "",
                    phoneNumber: res.data.phoneNumber || "",
                    gender: res.data.gender || "",
                    preferredGender: res.data.preferredGender || "",
                    location: res.data.location || "",
                    roomType: res.data.roomType || "",
                    budgetMin: res.data.budgetMin || "",
                    budgetMax: res.data.budgetMax || "",
                    hobbies: Array.isArray(res.data.hobbies)
                        ? res.data.hobbies.join(", ")
                        : res.data.hobbies || "",
                    activities: res.data.activities || "",
                    profileImage: res.data.profileImage || "",
                });
                setPreview(res.data.profileImage || "/default-avatar.png");
            } catch (err) {
                console.error("Fetch profile error:", err);
                toast.error("Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [id, currentUser, isOwnProfile]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
            setForm({ ...form, profileImage: file });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isOwnProfile) return;

        try {
            const formData = new FormData();
            Object.entries(form).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const res = await api.put("/users/me", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            toast.success("Profile updated successfully!");
            setUser(res.data.user);
            setUserData(res.data.user);
            setEditing(false);
        } catch (err) {
            console.error("Update profile error:", err);
            toast.error(err.response?.data?.message || "Update failed");
        }
    };

    if (loading) return <p className="text-center mt-20">Loading profile...</p>;
    if (!userData) return <p className="text-center mt-20">User not found.</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-md">
            <div className="flex flex-col md:flex-row items-center md:items-start mb-6 space-x-0 md:space-x-6">
                <div className="flex flex-col items-center">
                    <img
                        src={preview}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full border-2 border-green-500"
                    />
                    {isOwnProfile && editing && (
                        <label className="mt-3 cursor-pointer text-green-600 hover:underline text-sm">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            Change Photo
                        </label>
                    )}
                </div>

                <div className="mt-4 md:mt-0 text-center md:text-left">
                    <h2 className="text-2xl font-semibold text-green-700">
                        {form.firstName} {form.lastName}
                    </h2>
                    <p className="text-gray-500">{form.email}</p>
                    <p className="text-sm text-gray-600 mt-1">Role: {userData.role}</p>
                </div>
            </div>

            {/* Profile Form / View */}
            <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700"
            >
                {["firstName", "lastName", "phoneNumber", "location", "gender", "preferredGender", "roomType", "activities", "budgetMin", "budgetMax", "hobbies"].map((field) => (
                    <div key={field} className="flex flex-col">
                        <label className="text-sm font-medium capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                        {editing && isOwnProfile ? (
                            field === "hobbies" ? (
                                <textarea
                                    name={field}
                                    value={form[field]}
                                    onChange={handleChange}
                                    rows="2"
                                    className="border rounded-lg p-2 w-full"
                                />
                            ) : (
                                <input
                                    type={field.includes("budget") ? "number" : "text"}
                                    name={field}
                                    value={form[field]}
                                    onChange={handleChange}
                                    className="border rounded-lg p-2 w-full"
                                />
                            )
                        ) : (
                            <p className="mt-1">{form[field] || "N/A"}</p>
                        )}
                    </div>
                ))}

                {/* Actions */}
                {isOwnProfile && (
                    <div className="md:col-span-2 flex justify-between mt-4">
                        <button
                            type="button"
                            onClick={() => setEditing(!editing)}
                            className="bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300"
                        >
                            {editing ? "Cancel" : "Edit Profile"}
                        </button>

                        {editing && (
                            <button
                                type="submit"
                                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
                            >
                                Save Changes
                            </button>
                        )}
                    </div>
                )}
            </form>
        </div>
    );
}
