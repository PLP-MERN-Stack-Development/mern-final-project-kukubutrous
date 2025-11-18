//


import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.js";
import Register from "./pages/Register.js";
import VerifyEmail from "./pages/VerifyEmail.js";
import Dashboard from "./pages/Dashboard.js";
import Admin from "./pages/Admin.js";
import Chat from "./pages/Chat.js";
import { useAuth } from "./context/AuthContext.js";

const App = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify" element={<VerifyEmail />} />
            <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
            <Route path="/chat/:id" element={user ? <Chat /> : <Navigate to="/" />} />
            <Route path="/admin" element={user?.role === "admin" || user?.role === "superAdmin" ? <Admin /> : <Navigate to="/" />} />
        </Routes>
    );
};

export default App;
