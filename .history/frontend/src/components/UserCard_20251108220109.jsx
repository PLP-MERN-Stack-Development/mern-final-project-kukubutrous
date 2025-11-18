import React from "react";
import { useNavigate } from "react-router-dom";

export default function UserCard({ user }) {
    const navigate = useNavigate();

    const openProfile = () => {
        navigate(`/profile/${user.id}`);
    };

    return (
        <div
            className="border rounded p-4 shadow cursor-pointer hover:bg-gray-100"
            onClick={openProfile}
        >
            <h2 className="font-bold text-lg">{user.name}</h2>
            <p><strong>Location:</strong> {user.location}</p>
            <p><strong>Gender:</strong> {user.gender}</p>
            <p><strong>Hobbies:</strong> {user.hobbies.join(", ")}</p>
        </div>
    );
}
