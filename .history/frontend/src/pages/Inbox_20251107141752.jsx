// src/pages/Inbox.jsx
import { useEffect, useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";

export default function Inbox() {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    API.get("/chats").then(res => setChats(res.data.chats));
  }, []);

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-brightGreen mb-4">Inbox</h1>
      {chats.length === 0 && <p>No chats yet.</p>}
      <div className="space-y-2">
        {chats.map(chat => {
          const otherUser = chat.user1.id === parseInt(localStorage.getItem("userId")) ? chat.user2 : chat.user1;
          return (
            <Link key={chat.id} to={`/chat/${chat.id}`} className="block p-4 border rounded hover:shadow-lg transition flex justify-between items-center">
              <div>
                <h2 className="font-bold text-brightGreen">{otherUser.firstName} {otherUser.lastName}</h2>
                <p className="text-sm">{chat.latestMessage ? chat.latestMessage.text : "No messages yet"}</p>
              </div>
              <small className="text-gray-500">{chat.latestMessage ? new Date(chat.latestMessage.createdAt).toLocaleTimeString() : ""}</small>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
