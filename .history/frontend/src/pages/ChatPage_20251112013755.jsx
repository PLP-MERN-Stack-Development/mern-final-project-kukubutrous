// frontend/src/pages/ChatPage.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import UserList from "../components/UserList";
import ChatList from "../components/ChatList";

export default function ChatPage() {
    return (
        <div className="flex h-screen bg-gray-50">
            {/* Left sidebar with all users/chats */}
            <UserList />

            {/* Right side – either ChatList or an active Chat */}
            <div className="flex-1 relative">
                <Outlet /> {/* This is where <Chat /> or <ChatList /> will render */}
            </div>
        </div>
    );
}
