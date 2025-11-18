// frontend/src/pages/Inbox.jsx
import React from "react";
import ChatSidebar from "../components/ChatSidebar.jsx";

export default function Inbox() {
    return (
        <div className="flex h-screen">
            <ChatSidebar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold mb-4">Inbox</h1>
                <p>Select a conversation from the left to start chatting.</p>
            </div>
        </div>
    );
}

