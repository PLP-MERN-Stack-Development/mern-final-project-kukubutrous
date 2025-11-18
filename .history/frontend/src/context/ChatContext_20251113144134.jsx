// frontend/src/context/ChatContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext.jsx";
import api from "../utils/api.js";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export function ChatProvider({ children }) {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]); // IDs array
  const [chats, setChats] = useState([]); // user's chats (from /api/chats)
  const [openChats, setOpenChats] = useState([]); // { chatId, recipient, minimized, unreadCount }

  // Initialize socket after token available
  useEffect(() => {
    if (!token) return;
    const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:4000";
    const s = io(SOCKET_URL, { auth: { token }, transports: ["websocket"] });
    setSocket(s);

    s.on("connect", () => console.log("Socket connected:", s.id));
    s.on("online_users", (arr) => setOnlineUsers(arr || []));
    s.on("new_message", (msg) => {
      // bump unread if chat not focused/open
      setOpenChats((prev) => {
        const i = prev.findIndex((c) => String(c.chatId) === String(msg.chatId));
        if (i >= 0) {
          const next = [...prev];
          // if minimized or not focused, increment unread
          next[i] = { ...next[i], unreadCount: (next[i].unreadCount || 0) + 1 };
          return next;
        }
        // create lightweight entry if not present
        return [{ chatId: msg.chatId, recipient: null, minimized: false, unreadCount: 1 }, ...prev];
      });
      // optionally, update chats list last message preview
      setChats((prev) => {
        return prev.map((c) => (String(c.id) === String(msg.chatId) ? { ...c, latestMessage: msg } : c));
      });
    });

    s.on("disconnect", (reason) => console.log("Socket disconnected:", reason));
    return () => {
      s.disconnect();
      setSocket(null);
    };
    // eslint-disable-next-line
  }, [token]);

  // Load user chats
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await api.get("/chats");
        // server returns array of chats with user1 and user2 and latestMessage
        setChats(Array.isArray(res.data) ? res.data : res.data.chats || []);
      } catch (err) {
        console.error("Failed to fetch chats:", err);
      }
    })();
  }, [token]);

  // Helpers
  const openChatWindow = async (recipient) => {
    // recipient = { id, firstName, lastName, avatar? }
    if (!recipient) return;
    // call init to get or create chat id
    try {
      const res = await api.post("/chats/init", { recipientId: recipient.id });
      const chatId = res.data.chatId ?? res.data?.id ?? res.data;
      // join server room
      socket?.emit("join_chat", chatId);
      // ensure openChats contains chatId
      setOpenChats((prev) => {
        const idx = prev.findIndex((c) => String(c.chatId) === String(chatId));
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], minimized: false, unreadCount: 0, recipient };
          return next;
        }
        return [{ chatId, recipient, minimized: false, unreadCount: 0 }, ...prev];
      });
      // refresh chats list (to include new chat)
      const chatsRes = await api.get("/chats");
      setChats(Array.isArray(chatsRes.data) ? chatsRes.data : chatsRes.data.chats || []);
      return chatId;
    } catch (err) {
      console.error("Failed to init/open chat:", err);
    }
  };

  const closeChatWindow = (chatId) => {
    setOpenChats((prev) => prev.filter((c) => String(c.chatId) !== String(chatId)));
    socket?.emit("leave_chat", chatId);
  };

  const toggleMinimize = (chatId) => {
    setOpenChats((prev) => prev.map((c) => (String(c.chatId) === String(chatId) ? { ...c, minimized: !c.minimized } : c)));
  };

  const resetUnread = (chatId) => {
    setOpenChats((prev) => prev.map((c) => (String(c.chatId) === String(chatId) ? { ...c, unreadCount: 0 } : c)));
  };

  const value = useMemo(() => ({
    socket,
    onlineUsers,
    chats,
    openChats,
    openChatWindow,
    closeChatWindow,
    toggleMinimize,
    resetUnread,
    setChats,
    setOpenChats,
  }), [socket, onlineUsers, chats, openChats]);

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}
export default ChatContext;








/*
// frontend/src/context/ChatContext.jsx
import React, { createContext, useState, useEffect, useContext } from "react";
import { AuthContext } from "./AuthContext";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const { token, user } = useContext(AuthContext);
    const [openChats, setOpenChats] = useState([]);
    const [socket, setSocket] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]); // <-- track online user IDs

    useEffect(() => {
        if (!token) return;

        const base = (import.meta.env.VITE_API_URL || "http://localhost:4000").replace("/api", "");
        const s = io(base, { auth: { token } });

        s.on("connect", () => console.log("Socket connected:", s.id));
        s.on("disconnect", () => console.log("Socket disconnected"));

        // Handle new message
        s.on("new_message", (msg) => {
            setOpenChats((prev) =>
                prev.map((c) => {
                    if (c.chatId === msg.chatId) {
                        const isMinimized = c.minimized;
                        return { ...c, unreadCount: isMinimized ? (c.unreadCount || 0) + 1 : 0 };
                    }
                    return c;
                })
            );
        });

        // Track online users
        s.on("online_users", (users) => setOnlineUsers(users)); // array of online user IDs

        setSocket(s);
        return () => s.disconnect();
    }, [token]);

    const openChat = (recipient) => {
        setOpenChats((prev) => {
            const exists = prev.find((c) => c.recipient.id === recipient.id);
            if (exists) return prev;
            return [...prev, { chatId: recipient.id, recipient, minimized: false, unreadCount: 0 }];
        });
    };

    const closeChat = (chatId) => setOpenChats((prev) => prev.filter((c) => c.chatId !== chatId));
    const toggleMinimize = (chatId) => setOpenChats((prev) =>
        prev.map((c) => c.chatId === chatId ? { ...c, minimized: !c.minimized } : c)
    );
    const resetUnread = (chatId) => setOpenChats((prev) =>
        prev.map((c) => c.chatId === chatId ? { ...c, unreadCount: 0 } : c)
    );

    return (
        <ChatContext.Provider
            value={{ openChats, openChat, closeChat, toggleMinimize, resetUnread, socket, onlineUsers }}
        >
            {children}
        </ChatContext.Provider>
    );
};

*/




/*

// frontend/src/context/ChatContext.jsx
import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [openChats, setOpenChats] = useState([]);

    const openChat = (chatId) => {
        setOpenChats((prev) => {
            if (prev.find((c) => c.chatId === chatId)) return prev;
            return [...prev, { chatId, minimized: false }];
        });
    };

    const closeChat = (chatId) => {
        setOpenChats((prev) => prev.filter((c) => c.chatId !== chatId));
    };

    const toggleMinimize = (chatId) => {
        setOpenChats((prev) =>
            prev.map((c) =>
                c.chatId === chatId ? { ...c, minimized: !c.minimized } : c
            )
        );
    };

    return (
        <ChatContext.Provider
            value={{ openChats, openChat, closeChat, toggleMinimize }}
        >
            {children}
        </ChatContext.Provider>
    );
};

*/



/*
import React, { createContext, useState } from "react";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [openChats, setOpenChats] = useState([]);

    // Open a new chat or bring it to front
    const openChat = (chatId) => {
        setOpenChats((prev) => {
            if (prev.find((c) => c.chatId === chatId)) return prev;
            return [...prev, { chatId, minimized: false }];
        });
    };

    // Close a chat window
    const closeChat = (chatId) => {
        setOpenChats((prev) => prev.filter((c) => c.chatId !== chatId));
    };

    // Minimize or restore a chat window
    const toggleMinimize = (chatId) => {
        setOpenChats((prev) =>
            prev.map((c) =>
                c.chatId === chatId ? { ...c, minimized: !c.minimized } : c
            )
        );
    };

    return (
        <ChatContext.Provider
            value={{ openChats, openChat, closeChat, toggleMinimize }}
        >
            {children}
        </ChatContext.Provider>
    );
};

*/