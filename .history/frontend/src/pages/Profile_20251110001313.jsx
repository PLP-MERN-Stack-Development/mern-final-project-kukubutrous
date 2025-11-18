
import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";

export default function Profile() {
    const { user, token } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/${user.id}`);
                setProfile(res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchProfile();
    }, [user.id]);

    if (!profile) return <p>Loading profile...</p>;

    return (
        <div className="p-6 max-w-lg mx-auto border rounded shadow">
            <h1 className="text-2xl font-bold mb-4">{profile.name}'s Profile</h1>
            <ul className="space-y-2">
                <li><strong>Email:</strong> {profile.email}</li>
                <li><strong>Phone:</strong> {profile.phone}</li>
                <li><strong>Gender:</strong> {profile.gender}</li>
                <li><strong>Location:</strong> {profile.location}</li>
                <li><strong>Budget:</strong> {profile.budget}</li>
                <li><strong>Room Type:</strong> {profile.roomType}</li>
                <li><strong>Hobbies/Activities:</strong> {profile.hobbies.join(", ")}</li>
            </ul>
        </div>
    );
}
