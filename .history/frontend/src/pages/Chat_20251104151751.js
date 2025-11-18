import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

const socket = io("http://localhost:4000");

export default function Chat() {
  const { id: contactId } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const roomId = [user.id, contactId].sort().join("-");

  useEffect(() => {
    socket.emit("joinRoom", roomId);
    api.get(`/messages/${user.id}/${contactId}`).then((res) => setMessages(res.data));
  }, [contactId, user.id, roomId]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      if (data.roomId === roomId) {
        setMessages((prev) => [...prev, data]);
      }
    });
    return () => socket.off("receiveMessage");
  }, [roomId]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const msgData = {
      senderId: user.id,
      receiverId: contactId,
      message: input,
      roomId,
    };

    setMessages((prev) => [...prev, msgData]);
    socket.emit("sendMessage", msgData);
    await api.post("/messages", msgData);
    setInput("");
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="container mt-4">
      <h3>Chat with user #{contactId}</h3>
      <div className="border rounded p-3" style={{ height: "60vh", overflowY: "auto" }}>
        {messages.map((m, i) => (
          <div key={i} className={`mb-2 ${m.senderId === user.id ? "text-end" : "text-start"}`}>
            <div className={`d-inline-block px-3 py-2 rounded ${m.senderId === user.id ? "bg-primary text-white" : "bg-light"}`}>
              {m.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="mt-3 d-flex">
        <input
          className="form-control me-2"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary">Send</button>
      </form>
    </div>
  );
}
