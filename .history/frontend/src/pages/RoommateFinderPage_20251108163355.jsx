import { useState, useEffect } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL.replace('/api', ''), {
    auth: { token: localStorage.getItem("token") },
});

export default function RoommateFinderPage() {
    const [filters, setFilters] = useState({
        location: "",
        roomType: "",
        budgetMin: "",
        budgetMax: "",
        hobby: "",
        gender: "",
    });

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    // { chatId: { userId, messages: [] } }
    const [openChats, setOpenChats] = useState({});

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const params = {};
                Object.keys(filters).forEach((key) => {
                    if (filters[key]) params[key] = filters[key];
                });
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, { params });
                setUsers(res.data.users);
            } catch (err) {
                console.error("Search error:", err);
            }
            setLoading(false);
        };

        fetchUsers();
    }, [filters]);

    useEffect(() => {
        socket.on("new_message", ({ chatId, message }) => {
            setOpenChats((prev) => {
                if (!prev[chatId]) return prev;
                return {
                    ...prev,
                    [chatId]: { ...prev[chatId], messages: [...prev[chatId].messages, message] },
                };
            });
        });

        return () => {
            socket.off("new_message");
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const openChatWith = async (user) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_URL}/chats/send`, { recipientId: user.id, text: "" });
            const chatId = res.data.data.chatId || res.data.data.id || res.data.data?.chatId;

            // fetch existing messages
            const messagesRes = await axios.get(`${import.meta.env.VITE_API_URL}/chats/${chatId}/messages`);

            setOpenChats((prev) => ({
                ...prev,
                [chatId]: {
                    userId: user.id,
                    userName: `${user.firstName} ${user.lastName}`,
                    messages: messagesRes.data.messages || [],
                },
            }));

            socket.emit("join_chat", chatId);
        } catch (err) {
            console.error("Chat start error:", err);
        }
    };

    const sendMessage = (chatId, text) => {
        if (!chatId || !text) return;
        socket.emit("send_message", { chatId, text });
        setOpenChats((prev) => ({
            ...prev,
            [chatId]: {
                ...prev[chatId],
                messages: [...prev[chatId].messages, { id: Date.now(), text, senderId: localStorage.getItem("userId") }],
            },
        }));
    };

    const closeChat = (chatId) => {
        setOpenChats((prev) => {
            const copy = { ...prev };
            delete copy[chatId];
            return copy;
        });
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full">
            {/* Filters */}
            <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3 transition-colors duration-300">
                <h2 className="font-bold text-lg mb-2">Filters</h2>
                <input type="text" name="location" placeholder="Location" value={filters.location} onChange={handleChange} className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white" />
                <select name="roomType" value={filters.roomType} onChange={handleChange} className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                    <option value="">Room Type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="studio">Studio</option>
                </select>
                <div className="flex gap-2">
                    <input type="number" name="budgetMin" placeholder="Min Budget" value={filters.budgetMin} onChange={handleChange} className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white" />
                    <input type="number" name="budgetMax" placeholder="Max Budget" value={filters.budgetMax} onChange={handleChange} className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white" />
                </div>
                <input type="text" name="hobby" placeholder="Hobby" value={filters.hobby} onChange={handleChange} className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white" />
                <select name="gender" value={filters.gender} onChange={handleChange} className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white">
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            {/* Results */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
                {loading ? <p>Loading...</p> :
                    users.length === 0 ? <p>No roommates found</p> :
                        users.map((user) => (
                            <div key={user.id} className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-200">
                                <h3 className="font-bold text-lg">{user.firstName} {user.lastName}</h3>
                                <p><strong>Location:</strong> {user.location || 'N/A'}</p>
                                <p><strong>Room Type:</strong> {user.roomType || 'N/A'}</p>
                                <p><strong>Budget:</strong> ${user.budgetMin || 0} - ${user.budgetMax || 0}</p>
                                <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
                                <p><strong>Hobbies:</strong> {user.hobbies || 'N/A'}</p>
                                <button
                                    onClick={() => openChatWith(user)}
                                    className="mt-2 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded transition-colors duration-200"
                                >
                                    Message
                                </button>
                            </div>
                        ))
                }
            </div>

            {/* Multi Chat Windows */}
            {Object.entries(openChats).map(([chatId, chat], idx) => (
                <ChatWindow
                    key={chatId}
                    chatId={chatId}
                    userName={chat.userName}
                    messages={chat.messages}
                    sendMessage={sendMessage}
                    closeChat={closeChat}
                    positionIndex={idx}
                />
            ))}
        </div>
    );
}

// Floating Chat Window component
function ChatWindow({ chatId, userName, messages, sendMessage, closeChat, positionIndex }) {
    const [text, setText] = useState("");
    const handleSend = () => {
        if (text.trim()) {
            sendMessage(chatId, text.trim());
            setText("");
        }
    };

    return (
        <div
            className="fixed bottom-0 w-80 h-96 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded shadow flex flex-col z-50"
            style={{ right: `${positionIndex * 20 + 10}px` }}
        >
            <div className="flex justify-between items-center p-2 bg-green-500 text-white font-bold rounded-t">
                <span>{userName}</span>
                <button onClick={() => closeChat(chatId)} className="font-bold">×</button>
            </div>
            <div className="flex-1 p-2 overflow-y-auto space-y-2">
                {messages.map((m) => (
                    <div key={m.id} className={`p-1 rounded max-w-[75%] ${m.senderId === localStorage.getItem("userId") ? "bg-green-100 dark:bg-green-700 self-end" : "bg-gray-200 dark:bg-gray-700 self-start"}`}>
                        {m.text}
                    </div>
                ))}
            </div>
            <div className="p-2 flex gap-2 border-t border-gray-300 dark:border-gray-700">
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type..." className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white" />
                <button onClick={handleSend} className="bg-green-500 hover:bg-green-600 text-white px-4 rounded">Send</button>
            </div>
        </div>
    );
}
