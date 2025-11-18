// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import ChatDock from "./components/ChatDock.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Chat from "./pages/Chat.jsx";
import ChatPage from "./pages/ChatPage.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";
import ProfileView from "./pages/ProfileView.jsx";
import Search from "./pages/Search.jsx";
import Inbox from "./pages/Inbox.jsx";
// Admin Pages
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { ManageRoles } from "./pages/ManageRoles.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";

import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user, loading } = useAuth();

  // Show a loader while auth context initializes
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar visible only when logged in */}
      {user && <Navbar />}

      <Routes>
        {/* --- Public Routes --- */}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </>
        )}

        {/* --- Redirect logged-in users away from auth routes --- */}
        {user && (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* --- Protected User Routes --- */}
        <Route
          path="/"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <ProfileView />
            </ProtectedRoute>
          }
        />

        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <Search />
            </ProtectedRoute>
          }
        />

        {/* --- Inbox Page --- */}
        <Route
          path="/inbox"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <Inbox />
            </ProtectedRoute>
          }
        />

        {/* --- Chat System with Sidebar --- */}
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        >
          {/* Placeholder when no chat selected */}
          <Route
            index
            element={
              <div className="p-4 text-gray-500">
                Select a chat to start messaging
              </div>
            }
          />
          {/* Individual Chat Window */}
          <Route path=":chatId" element={<Chat />} />
        </Route>

        {/* --- Admin Routes --- */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={["admin", "superAdmin"]}>
              <AdminUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <ManageRoles />
            </ProtectedRoute>
          }
        />

        {/* --- Fallback --- */}
        <Route path="*" element={<Navigate to="/chat" replace />} />
      </Routes>

      {/* Global floating chat dock (active on all pages) */}
      <ChatDock />
    </div>
  );
}

