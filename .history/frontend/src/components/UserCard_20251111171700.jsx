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
      {/* Profile Info */}
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

      {/* Chat & Actions */}
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

      {/*Inside UserCard.jsx */}
      <button
        onClick={() => navigate(`/profile/${user.id}`)}
        className="text-green-600 hover:underline font-medium text-sm"
      >
        View Profile
      </button>


      {/* Chat Window */}
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







/*
//frontend/src/components/UserCard.jsx
import React, { useState } from "react";
import ChatWindow from "./ChatWindow.jsx";

export default function UserCard({ user }) {
    const [chatOpen, setChatOpen] = useState(false);
    const [chatMinimized, setChatMinimized] = useState(false);

    if (user.role === "admin" || user.role === "superAdmin") return null;

    const handleChatToggle = () => {
        if (chatOpen && chatMinimized) setChatMinimized(false);
        else if (!chatOpen) setChatOpen(true);
        else setChatMinimized(true);
    };

    return (
        <div className="border rounded p-4 shadow-md bg-white flex flex-col space-y-2">
            <div className="font-bold text-lg">{user.firstName} {user.lastName}</div>
            <div className="text-gray-600">Gender: {user.gender}</div>
            <div className="text-gray-600">Location: {user.location}</div>
            <div className="text-gray-600">Hobbies: {user.hobbies?.join(", ")}</div>
            <div className="text-gray-600">Room type: {user.roomType}</div>
            <div className="text-gray-600">Budget: ${user.budget}</div>

            <button
                onClick={handleChatToggle}
                className="mt-2 bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
            >
                {chatOpen && !chatMinimized ? "Minimize Chat" : "Start Chat"}
            </button>

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