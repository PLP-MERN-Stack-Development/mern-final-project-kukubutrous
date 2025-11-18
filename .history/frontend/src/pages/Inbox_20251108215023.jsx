import React, { useState, useEffect, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Inbox() {
  const { user } = useContext(AuthContext);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      const res = await api.get("/chats");
      setChats(res.data);
    };
    fetchChats();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Inbox</h1>
      {chats.length === 0 && <p>No active chats yet.</p>}
      <ul className="space-y-2">
        {chats.map((chat) => (
          <li key={chat.id} className="p-2 border rounded flex justify-between items-center">
            <span>{chat.name}</span>
            <Link
              to={`/chat/${chat.id}`}
              className="bg-green-500 text-white px-3 py-1 rounded"
            >
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
