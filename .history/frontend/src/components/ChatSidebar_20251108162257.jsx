import { useContext, useEffect } from 'react';
import { ChatContext } from '../context/ChatContext';

export default function ChatSidebar() {
    const { chats, activeChat, setActiveChat, fetchChats } = useContext(ChatContext);

    useEffect(() => {
        fetchChats();
    }, []);

    return (
        <div className="w-64 bg-white shadow h-screen p-4 overflow-y-auto">
            <h3 className="font-bold mb-4 text-lg">Chats</h3>
            {chats.length === 0 && <p>No chats yet.</p>}
            <ul>
                {chats.map(chat => {
                    const otherUser = chat.user1.id === chat.activeUser?.id ? chat.user2 : chat.user1;
                    return (
                        <li
                            key={chat.id}
                            onClick={() => setActiveChat(chat)}
                            className={`p-2 cursor-pointer rounded hover:bg-green-100 ${activeChat?.id === chat.id ? 'bg-green-200' : ''
                                }`}
                        >
                            {otherUser.firstName} {otherUser.lastName}
                            {chat.latestMessage && (
                                <p className="text-xs text-gray-500 truncate">{chat.latestMessage.text}</p>
                            )}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
