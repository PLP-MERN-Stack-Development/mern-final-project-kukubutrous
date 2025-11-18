

// frontend/src/pages/ChatPage.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import ChatSidebar from "../components/ChatSidebar.jsx";

export default function ChatPage() {
    return (
        <div className="flex h-screen">
            <ChatSidebar />
            <div className="flex-1 relative bg-gray-50">
                <Outlet />
            </div>
        </div>
    );
}
*/