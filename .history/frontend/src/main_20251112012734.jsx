

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import UserList from "./components/UserList";
import ChatList from "./components/ChatList";
import "./styles/index.css"; // Tailwind CSS import

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <AuthProvider>
            <ChatProvider>
                <Router>
                    <App />
                    <Toaster position="top-right" reverseOrder={false} />
                </Router>

                <div className="flex h-screen">
                    <UserList />
                    <div className="flex-1 relative bg-gray-50">
                        <ChatList />
                    </div>
                </div>
            </ChatProvider>
        </AuthProvider>
    </React.StrictMode>
);
