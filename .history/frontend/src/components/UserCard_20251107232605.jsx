// frontend/src/components/UserCard.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function UserCard({ user }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 hover:shadow-2xl transition">
      <h3 className="text-xl font-semibold text-green-500">
        {user.firstName} {user.lastName}
      </h3>
      <p className="text-gray-600 mb-2">{user.location || "No location set"}</p>
      <p className="text-sm text-pink-500 mb-3">
        Room Type: {user.roomType || "N/A"}
      </p>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        Hobbies: {user.hobbies || "No hobbies listed"}
      </p>
      <Link
        to={`/chat?with=${user._id}`}
        className="bg-gradient-to-r from-green-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:opacity-90 transition"
      >
        Chat Now
      </Link>
    </div>
  );
}
