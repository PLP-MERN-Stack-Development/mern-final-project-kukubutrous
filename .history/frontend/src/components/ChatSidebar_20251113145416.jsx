// frontend/src/components/ChatSidebar.jsx
import React from "react";
import { useChat } from "../context/ChatContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ChatSidebar() {
  const { chats, openChatWindow, onlineUsers } = useChat();
  const { user } = useAuth();

  const otherUser = (chat) => {
    // pick other participant object from included user1/user2
    if (chat.user1 && chat.user2) {
      return String(chat.user1.id) === String(user.id) ? chat.user2 : chat.user1;
    }
    // fallback if backend returns differently
    return chat.participant || null;
  };

  return (
    <div className="w-80 border-r bg-white h-full overflow-y-auto">
      <h2 className="p-4 font-semibold border-b">Messages</h2>

      <ul>
        {Array.isArray(chats) && chats.map((c) => {
          const other = otherUser(c);
          return (
            <li key={c.id} className="p-3 hover:bg-gray-50 cursor-pointer flex items-center gap-3" onClick={() => openChatWindow({ id: other.id, firstName: other.firstName, lastName: other.lastName })}>
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">{other.firstName?.[0]}</div>
              <div className="flex-1">
                <div className="font-medium">{other.firstName} {other.lastName}</div>
                <div className="text-sm text-gray-500 truncate">{c.latestMessage?.content ?? c.latestMessage?.text ?? "No messages yet"}</div>
              </div>
              <div className="text-xs text-gray-400">
                {c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                {onlineUsers?.includes(other.id) && <div className="w-2 h-2 bg-green-500 rounded-full inline-block ml-2" />}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}






/*
// frontend/src/components/ChatSidebar.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ChatContext } from "../context/ChatContext";

export default function ChatSidebar() {
    const [users, setUsers] = useState([]);
    const [chats, setChats] = useState([]);
    const { onlineUsers } = useContext(ChatContext); // track online users
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all users
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                // If your backend returns { users: [...] }, adjust here
                const fetchedUsers = Array.isArray(res.data) ? res.data : res.data.users || [];
                setUsers(fetchedUsers);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };

        // Fetch recent chats with last message and unread count
        const fetchChats = async () => {
            try {
                const res = await api.get("/chats");
                const fetchedChats = Array.isArray(res.data) ? res.data : res.data.chats || [];
                setChats(fetchedChats);
            } catch (err) {
                console.error("Error fetching chats:", err);
            }
        };

        fetchUsers();
        fetchChats();
    }, []);

    const handleClick = (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    return (
        <div className="w-80 border-r overflow-y-auto bg-white">
            {/* Recent Chats *}
            <h2 className="font-semibold p-4 border-b">Recent Chats</h2>
            <ul>
                {Array.isArray(chats) && chats.map((c) => (
                    <li
                        key={c.id}
                        onClick={() => handleClick(c.id)}
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-100 transition"
                    >
                        <div className="flex items-center gap-3">
                            {c.avatar ? (
                                <img
                                    src={c.avatar}
                                    alt={c.name}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                    {c.name[0]}
                                </div>
                            )}
                            <div className="flex flex-col">
                                <span className="font-medium">{c.name}</span>
                                <span className="text-sm text-gray-500 truncate w-40">
                                    {c.lastMessage || "No messages yet"}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end">
                            {c.unreadCount > 0 && (
                                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {c.unreadCount}
                                </span>
                            )}
                            <span className="text-xs text-gray-400">
                                {c.updatedAt ? new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                            </span>
                        </div>
                    </li>
                ))}
            </ul>

            {/* All Users *}
            <h2 className="font-semibold p-4 border-t border-b">All Users</h2>
            <ul>
                {Array.isArray(users) && users.map((u) => (
                    <li
                        key={u.id}
                        onClick={() => handleClick(u.id)}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition"
                    >
                        {u.avatar ? (
                            <img
                                src={u.avatar}
                                alt={u.firstName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                {u.firstName[0]}
                            </div>
                        )}
                        <span className="font-medium">{u.firstName} {u.lastName}</span>
                        {onlineUsers?.includes(u.id) && (
                            <span className="ml-auto w-2 h-2 bg-green-500 rounded-full"></span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
*/