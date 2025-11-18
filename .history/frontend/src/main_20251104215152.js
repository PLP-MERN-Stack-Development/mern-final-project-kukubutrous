//main.js

import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.js";
import "./styles/index.css";
import { AuthProvider } from "./context/AuthContext.js";
import { ChatProvider } from "./context/ChatContext.js";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <ChatProvider>
                    <App />
                </ChatProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
