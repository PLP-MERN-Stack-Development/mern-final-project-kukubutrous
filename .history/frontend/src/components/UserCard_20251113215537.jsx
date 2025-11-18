// frontend/src/components/UserCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useChat } from "../context/ChatContext.jsx";

export default function UserCard({ user }) {
  const navigate = useNavigate();
  const { openChatWindow } = useChat();

  if (!user || user.role === "admin" || user.role === "superAdmin") return null;

  return (
    <div className="border rounded-2xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <img src={user.profileImage || "/default-avatar.png"} alt={`${user.firstName}`} className="w-12 h-12 rounded-full object-cover" />
          <div>
            <h3 className="font-semibold text-lg">{user.firstName} {user.lastName}</h3>
            <p className="text-sm text-gray-500">{user.gender}</p>
          </div>
        </div>
        <div className="text-sm text-gray-700 space-y-1">
          <div>📍 {user.location || "N/A"}</div>
          <div>🎯 {Array.isArray(user.hobbies) ? user.hobbies.join(", ") : user.hobbies || "N/A"}</div>
        </div>
      </div>

      <div className="mt-3 flex justify-between items-center">
        <button onClick={() => openChatWindow({ id: user.id, firstName: user.firstName, lastName: user.lastName })} className="bg-green-500 text-white px-3 py-1.5 rounded">Message</button>
        <button onClick={() => navigate(`/profile/${user.id}`)} className="text-green-600">View Profile</button>
      </div>
    </div>
  );
}
