import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatDock from "./components/ChatDock.jsx";

import Dashboard from "./pages/Dashboard.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileView from "./pages/ProfileView.jsx";
import Search from "./pages/Search.jsx";
import Inbox from "./pages/Inbox.jsx";

import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { ManageRoles } from "./pages/ManageRoles.jsx";

import { AuthProvider } from "./context/AuthContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user, loading } = useAuth ? useAuth() : { user:null, loading:false };

  if (loading) {
    return <div className="center" style={{ height:"100vh" }}><div>Loading...</div></div>;
  }

  return (
    <div className="app-shell">
      {user && <Navbar />}

      <Routes>
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </>
        )}

        {user && (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </>
        )}

        <Route path="/" element={<ProtectedRoute allowedRoles={["user","admin","superAdmin"]}><Dashboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute allowedRoles={["user","admin","superAdmin"]}><Profile /></ProtectedRoute>} />
        <Route path="/profile/:id" element={<ProtectedRoute allowedRoles={["user","admin","superAdmin"]}><ProfileView /></ProtectedRoute>} />
        <Route path="/search" element={<ProtectedRoute allowedRoles={["user","admin","superAdmin"]}><Search /></ProtectedRoute>} />
        <Route path="/inbox" element={<ProtectedRoute allowedRoles={["user","admin","superAdmin"]}><Inbox /></ProtectedRoute>} />

        <Route path="/chat" element={<ProtectedRoute allowedRoles={["user","admin","superAdmin"]}><ChatPage /></ProtectedRoute>}>
          <Route index element={<div className="card small">Select a chat to start messaging</div>} />
          <Route path=":chatId" element={<ChatPage />} />
        </Route>

        <Route path="/admin" element={<ProtectedRoute allowedRoles={["admin","superAdmin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/roles" element={<ProtectedRoute allowedRoles={["superAdmin"]}><ManageRoles /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>

      <ChatDock />
    </div>
  );
}
