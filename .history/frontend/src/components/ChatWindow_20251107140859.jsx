import { useEffect, useState } from "react";
import API from "../utils/api";

export default function ChatWindow({ chatId, socket }) {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");

    useEffect(() => {
        if (!chatId) return;
        API.get(`/chats/${chatId}/messages`).then(res => setMessages(res.data.messages));

        if (socket) {
            socket.on("new_message", (msg) => {
                if (msg.chatId === chatId) setMessages(prev => [...prev, msg.message]);
            });
        }
    }, [chatId, socket]);

    const sendMessage = async () => {
        if (!text) return;
        await API.post("/chats/send", { recipientId: chatId, text });
        setText("");
    };

    return (
        <div className="flex flex-col h-full border p-4 rounded-lg bg-white">
            <div className="flex-1 overflow-y-auto mb-2">
                {messages.map(msg => (
                    <div key={msg.id} className={`mb-2 ${msg.senderId === chatId ? "text-left" : "text-right"}`}>
                        <p className="inline-block p-2 rounded-lg bg-brightGreen text-white">{msg.text}</p>
                    </div>
                ))}
            </div>
            <div className="flex">
                <input
                    type="text"
                    value={text}
                    onChange={e => setText(e.target.value)}
                    className="flex-1 border rounded-l-lg p-2"
                    placeholder="Type a message"
                />
                <button onClick={sendMessage} className="bg-brightPink px-4 rounded-r-lg text-white">Send</button>
            </div>
        </div>
    );
}
