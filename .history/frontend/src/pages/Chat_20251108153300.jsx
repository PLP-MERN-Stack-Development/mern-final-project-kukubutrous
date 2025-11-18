import React, { useEffect, useState } from "react";
import { getChats, sendMessage as sendMsgApi, getMessages } from "../api/chat";
import { useSocket } from "../context/SocketContext";
import ChatManager from "../components/Chat/ChatManager";

export default function Chat() {
    const [chats, setChats] = useState([]);
    const [chatMap, setChatMap] = useState({}); // store chat with messages
    const socket = useSocket();

    useEffect(() => {
        const loadChats = async () => {
            const data = await getChats();
            const map = {};
            data.forEach((chat) => {
                map[chat.id] = {
                    ...chat,
                    userName: chat.user1.id === chat.userId ? `${chat.user2.firstName}` : `${chat.user1.firstName}`,
                    messages: [],
                    userId: chat.user1.id === chat.userId ? chat.user2.id : chat.user1.id,
                };
            });
            setChats(data);
            setChatMap(map);
        };
        loadChats();
    }, []);

    // Listen for socket messages
    useEffect(() => {
        if (!socket) return;
        socket.on("new_message", ({ chatId, senderId, text, createdAt }) => {
            setChatMap((prev) => {
                const chat = prev[chatId];
                if (!chat) return prev;
                return {
                    ...prev,
                    [chatId]: {
                        ...chat,
                        messages: [...chat.messages, { id: Date.now(), senderId, text, createdAt }],
                    },
                };
            });
        });

        return () => socket.off("new_message");
    }, [socket]);

    const sendMessage = async (chatId, text) => {
        await sendMsgApi(chatId, text);
        socket.emit("send_message", { chatId, text });
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Chats</h2>
            <div className="flex flex-col gap-2">
                {chats.map((chat) => (
                    <button
                        key={chat.id}
                        className="p-2 bg-gray-200 dark:bg-gray-700 rounded hover:bg-gray-300"
                        onClick={() => {
                            if (!chatMap[chat.id].messages.length) {
                                getMessages(chat.id).then((msgs) =>
                                    setChatMap((prev) => ({
                                        ...prev,
                                        [chat.id]: { ...prev[chat.id], messages: msgs },
                                    }))
                                );
                            }
                        }}
                    >
                        {chat.user1.firstName} & {chat.user2.firstName}
                    </button>
                ))}
            </div>

            <ChatManager chats={Object.values(chatMap)} sendMessage={sendMessage} />
        </div>
    );
}
