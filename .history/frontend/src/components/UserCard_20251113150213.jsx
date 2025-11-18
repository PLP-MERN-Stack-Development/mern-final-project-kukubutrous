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






/*

//frontend/src/components/UserCard.jsx
import { useNavigate } from "react-router-dom";

import React, { useState } from "react";
import ChatWindow from "./ChatWindow.jsx";
//const navigate = useNavigate();

export default function UserCard({ user }) {
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMinimized, setChatMinimized] = useState(false);

  // 🚫 Skip admin/superAdmin profiles
  if (!user || user.role === "admin" || user.role === "superAdmin") return null;

  const handleChatToggle = () => {
    if (chatOpen && chatMinimized) setChatMinimized(false);
    else if (!chatOpen) setChatOpen(true);
    else setChatMinimized(true);
  };

  return (
    <div className="border rounded-2xl p-4 shadow hover:shadow-lg transition bg-white flex flex-col justify-between">
      {/* Profile Info *}
      <div>
        <div className="flex items-center space-x-3 mb-2">
          <img
            src={user.profileImage || "/default-avatar.png"}
            alt={`${user.firstName}'s profile`}
            className="w-12 h-12 rounded-full object-cover border"
          />
          <div>
            <h3 className="font-semibold text-lg text-gray-800">
              {user.firstName} {user.lastName}
            </h3>
            <p className="text-sm text-gray-500 capitalize">{user.gender}</p>
          </div>
        </div>

        <div className="space-y-1 text-sm text-gray-700">
          {user.location && <p>📍 <span className="font-medium">Location:</span> {user.location}</p>}
          {user.hobbies?.length > 0 && (
            <p>🎯 <span className="font-medium">Hobbies:</span> {user.hobbies.join(", ")}</p>
          )}
          {user.activities && (
            <p>🏃 <span className="font-medium">Activities:</span> {user.activities}</p>
          )}
          {user.roomType && (
            <p>🏠 <span className="font-medium">Room Type:</span> {user.roomType}</p>
          )}
          {user.budget && (
            <p>💰 <span className="font-medium">Budget:</span> ${user.budget}</p>
          )}
        </div>
      </div>

      {/* Chat & Actions *}
      <div className="mt-3 flex justify-between items-center">
        <button
          onClick={handleChatToggle}
          className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-3 rounded-lg text-sm font-medium transition"
        >
          {chatOpen && !chatMinimized ? "Minimize Chat" : "Start Chat"}
        </button>

        <button
          onClick={() => alert(`Viewing profile of ${user.firstName}`)}
          className="text-green-600 hover:underline text-sm font-medium"
        >
          View Profile
        </button>
      </div>

      {/*Inside UserCard.jsx *}
      <button
        onClick={() => navigate(`/profile/${user.id}`)}
        className="text-green-600 hover:underline font-medium text-sm"
      >
        View Profile
      </button>


      {/* Chat Window *}
      {chatOpen && (
        <ChatWindow
          chatId={user.chatId || user.id}
          minimized={chatMinimized}
          onClose={() => setChatOpen(false)}
          onToggleMinimize={() => setChatMinimized((prev) => !prev)}
        />
      )}
    </div>
  );
}
*/