






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