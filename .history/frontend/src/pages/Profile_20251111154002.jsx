import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import { toast } from "react-toastify";

export default function Profile() {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: "",
        preferredGender: "",
        location: "",
        roomType: "",
        budgetMin: "",
        budgetMax: "",
        hobbies: "",
        activities: "",
        profileImage: "",
    });
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(null);

    // ✅ Load user data into form
    useEffect(() => {
        if (user) {
            setForm({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phoneNumber: user.phoneNumber || "",
                gender: user.gender || "",
                preferredGender: user.preferredGender || "",
                location: user.location || "",
                roomType: user.roomType || "",
                budgetMin: user.budgetMin || "",
                budgetMax: user.budgetMax || "",
                hobbies:
                    Array.isArray(user.hobbies) && user.hobbies.length > 0
                        ? user.hobbies.join(", ")
                        : user.hobbies || "",
                activities: user.activities || "",
                profileImage: user.profileImage || "",
            });
            setPreview(user.profileImage || "");
        }
    }, [user]);

    // ✅ Handle input changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // ✅ Handle profile image change (preview only)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const previewURL = URL.createObjectURL(file);
            setPreview(previewURL);
            setForm({ ...form, profileImage: file });
        }
    };

    // ✅ Submit profile update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

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
            localStorage.setItem("user", JSON.stringify(res.data.user));
        } catch (err) {
            console.error("Update error:", err);
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return <p className="text-center mt-20">Loading profile...</p>;

    return (
        <div className="max-w-4xl mx-auto mt-10 bg-white p-8 rounded-2xl shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center text-green-700">
                {user.role === "admin" || user.role === "superAdmin"
                    ? "Admin Profile"
                    : "My Profile"}
            </h2>

            {/* Profile Image and Info */}
            <div className="flex flex-col md:flex-row items-center md:items-start mb-6 space-x-0 md:space-x-6">
                <div className="flex flex-col items-center">
                    <img
                        src={preview || "/default-avatar.png"}
                        alt="Profile"
                        className="w-32 h-32 object-cover rounded-full border-2 border-green-500 shadow-sm"
                    />
                    <label className="mt-3 cursor-pointer text-green-600 hover:underline text-sm">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="hidden"
                        />
                        Change Photo
                    </label>
                </div>

                <div className="mt-4 md:mt-0 text-center md:text-left">
                    <h3 className="text-xl font-semibold">
                        {form.firstName} {form.lastName}
                    </h3>
                    <p className="text-gray-500">{form.email}</p>
                    <p className="text-sm text-gray-600 capitalize mt-1">
                        Role: {user.role}
                    </p>
                </div>
            </div>

            {/* Editable Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
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

                <div className="grid md:grid-cols-2 gap-4">
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
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        type="text"
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        placeholder="Gender"
                        className="border rounded-lg p-2 w-full"
                    />
                    <input
                        type="text"
                        name="preferredGender"
                        value={form.preferredGender}
                        onChange={handleChange}
                        placeholder="Preferred Gender"
                        className="border rounded-lg p-2 w-full"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                        name="activities"
                        value={form.activities}
                        onChange={handleChange}
                        placeholder="Activities / Lifestyle"
                        className="border rounded-lg p-2 w-full"
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
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
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                >
                    {loading ? "Updating..." : "Update Profile"}
                </button>
            </form>
        </div>
    );
}
