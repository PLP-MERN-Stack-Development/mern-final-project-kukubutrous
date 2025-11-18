import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageSquare, Users, Smile } from "lucide-react";
import api from "../utils/api";
import { getSocket, initSocket } from "../utils/socket";
import { useAuth } from "../context/AuthContext";

const Chat = () => {
  const { user, token } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [activeConv, setActiveConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMsg, setNewMsg] = useState("");
  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);

  // --- Initialize socket connection ---
  useEffect(() => {
    const socket = initSocket(token);
    socketRef.current = socket;

    socket.on("connect", () => console.log("🟢 Connected to chat socket"));
    socket.on("private_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, [token]);

  // --- Fetch conversations ---
  useEffect(() => {
    const loadConversations = async () => {
      try {
        const res = await api.get("/chats");
        setConversations(res.data || []);
      } catch (err) {
        console.error("Error loading conversations:", err);
      }
    };
    loadConversations();
  }, []);

  // --- Fetch messages for selected conversation ---
  const openConversation = async (conv) => {
    setActiveConv(conv);
    try {
      const res = await api.get(`/chats/${conv.id}/messages`);
      setMessages(res.data || []);
    } catch (err) {
      console.error("Error loading messages:", err);
    }
  };

  // --- Auto-scroll to bottom on new messages ---
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- Send message ---
  const sendMessage = async () => {
    if (!newMsg.trim()) return;
    try {
      const res = await api.post(`/chats/${activeConv.id}/messages`, { text: newMsg });
      const sent = res.data;
      socketRef.current.emit("private_message", sent);
      setMessages((prev) => [...prev, sent]);
      setNewMsg("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-green-950 text-gray-900 dark:text-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-1/4 bg-white/70 dark:bg-gray-800/70 border-r border-green-200 dark:border-green-800 backdrop-blur-lg p-4 hidden md:flex flex-col"
      >
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-green-600" /> Conversations
        </h2>
        <div className="flex-1 overflow-y-auto space-y-3">
          {conversations.map((conv) => (
            <motion.div
              key={conv.id}
              whileHover={{ scale: 1.03 }}
              className={`cursor-pointer rounded-xl p-3 transition-all shadow-sm ${
                activeConv?.id === conv.id
                  ? "bg-gradient-to-r from-green-500 to-green-600 text-white"
                  : "bg-white dark:bg-gray-900 hover:bg-green-50 dark:hover:bg-green-800/30"
              }`}
              onClick={() => openConversation(conv)}
            >
              <p className="font-semibold">{conv.otherUserName}</p>
              <p className="text-sm opacity-70 truncate">{conv.lastMessage}</p>
            </motion.div>
          ))}
        </div>
      </motion.aside>

      {/* Chat Window */}
      <div className="flex-1 flex flex-col">
        {activeConv ? (
          <>
            <motion.header
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="p-4 bg-white/70 dark:bg-gray-800/70 border-b border-green-200 dark:border-green-800 flex items-center justify-between"
            >
              <h2 className="text-lg font-bold flex items-center gap-2">
                <MessageSquare className="text-green-600" />
                Chat with {activeConv.otherUserName}
              </h2>
            </motion.header>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-lg p-3 rounded-xl shadow-md ${
                    msg.senderId === user.id
                      ? "self-end bg-green-500 text-white ml-auto"
                      : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {msg.text}
                </motion.div>
              ))}
              <div ref={messagesEndRef}></div>
            </div>

            {/* Input */}
            <div className="border-t border-green-200 dark:border-green-800 p-4 flex items-center gap-3 bg-white/70 dark:bg-gray-800/70">
              <input
                type="text"
                value={newMsg}
                onChange={(e) => setNewMsg(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-transparent outline-none p-2 border border-green-300 dark:border-green-700 rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <button
                onClick={sendMessage}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all"
              >
                <Send className="w-4 h-4" /> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1">
            <Smile className="w-12 h-12 text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              Select a conversation to start chatting!
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;






/*
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import api from "../utils/api";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [active, setActive] = useState(null);

    useEffect(() => {
        async function load() {
            try {
                const res = await api.get("/chats");
                setConversations(res.data.chats || []);
            } catch (err) {
                console.error(err);
            }
        }
        load();
    }, []);

    return (
        <div className="grid grid-cols-3 gap-4 h-[80vh]">
            <div className="col-span-1 card overflow-auto">
                <h3 className="font-semibold mb-3">Conversations</h3>
                <div className="space-y-2">
                    {conversations.map(c => (
                        <div key={c.id} onClick={() => setActive(c.id)} className="p-2 rounded hover:bg-brand-50 cursor-pointer">
                            <div className="font-medium">{c.user1?.id === user.id ? c.user2?.firstName : c.user1?.firstName}</div>
                            <div className="text-xs text-gray-500">{c.latestMessage?.text}</div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="col-span-2 card">
                {active ? <ChatWindow conversationId={active} currentUser={user} /> : <div className="text-gray-600">Select a conversation</div>}
            </div>
        </div>
    );
}

*/