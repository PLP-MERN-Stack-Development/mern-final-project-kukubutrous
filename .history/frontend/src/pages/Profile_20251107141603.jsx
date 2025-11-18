// src/pages/Profile.jsx
import { useEffect, useState } from "react";
import API from "../utils/api";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({});
    const [message, setMessage] = useState("");

    useEffect(() => {
        API.get("/users/me")
            .then(res => {
                setUser(res.data.user);
                setForm(res.data.user);
            })
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await API.put("/users/me", form);
            setUser(res.data.user);
            setMessage("✅ Profile updated successfully!");
        } catch (err) {
            console.error(err);
            setMessage("Failed to update profile");
        }
    };

    if (!user) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8 max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-brightGreen mb-4">Edit Profile</h1>
            {message && <p className="text-brightGreen mb-4">{message}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <input name="firstName" value={form.firstName || ""} onChange={handleChange} placeholder="First Name" className="w-full p-3 border rounded" />
                <input name="lastName" value={form.lastName || ""} onChange={handleChange} placeholder="Last Name" className="w-full p-3 border rounded" />
                <input name="phoneNumber" value={form.phoneNumber || ""} onChange={handleChange} placeholder="Phone Number" className="w-full p-3 border rounded" />
                <input name="location" value={form.location || ""} onChange={handleChange} placeholder="Location" className="w-full p-3 border rounded" />
                <input name="roomType" value={form.roomType || ""} onChange={handleChange} placeholder="Room Type" className="w-full p-3 border rounded" />
                <div className="flex gap-4">
                    <input type="number" name="budgetMin" value={form.budgetMin || ""} onChange={handleChange} placeholder="Min Budget" className="w-1/2 p-3 border rounded" />
                    <input type="number" name="budgetMax" value={form.budgetMax || ""} onChange={handleChange} placeholder="Max Budget" className="w-1/2 p-3 border rounded" />
                </div>
                <input name="hobbies" value={form.hobbies || ""} onChange={handleChange} placeholder="Hobbies (comma separated)" className="w-full p-3 border rounded" />
                <input name="gender" value={form.gender || ""} onChange={handleChange} placeholder="Gender" className="w-full p-3 border rounded" />
                <input name="preferredGender" value={form.preferredGender || ""} onChange={handleChange} placeholder="Preferred Gender" className="w-full p-3 border rounded" />
                <button className="w-full bg-brightPink text-white py-3 rounded hover:bg-pink-600 transition">Save Changes</button>
            </form>
        </div>
    );
}
