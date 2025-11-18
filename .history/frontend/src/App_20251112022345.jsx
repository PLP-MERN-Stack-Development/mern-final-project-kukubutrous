/*

// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Chat from "./pages/Chat.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";
import Search from "./pages/Search.jsx";
import ChatList from "./components/ChatList.jsx";
import UserList from "./components/UserList.jsx";

import ProfileView from "./pages/ProfileView.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { ManageRoles } from "./pages/ManageRoles.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user, loading } = useAuth();

  // Optional: show a loader while auth is initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100">
      {/* Show Navbar only if user is logged in *}
      {user && <Navbar />}

      <Routes>
        {/* --- Public Routes --- *}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </>
        )}

        {/* Redirect logged-in users away from auth pages *}
        {user && (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* --- Protected User Routes --- *}
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

        {/* --- Chat System --- *}
        <Route
          path="/chats"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <ChatList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* Optional direct link to all users (for starting new chats, etc.) *}
        <Route
          path="/users"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <UserList />
            </ProtectedRoute>
          }
        />

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

        {/* Inside App.jsx*/}
        <Route
          path="/chat"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <ChatPage />
            </ProtectedRoute>
          }
        >
          <Route index element={<div className="p-4 text-gray-500">Select a chat to start messaging</div>} />
          <Route path=":chatId" element={<Chat />} />
        </Route>


        {/* --- SuperAdmin Only --- */}
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <ManageRoles />
            </ProtectedRoute>
          }
        />

        {/* --- Fallback --- */}
        <Route path="*" element={<Navigate to="/chats" replace />} />
      </Routes>
    </div>
  );
}
*/







/*
// frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Chat from "./pages/Chat.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import Profile from "./pages/Profile.jsx";
import Search from "./pages/Search.jsx";
import ChatPage from "./pages/ChatPage.jsx";
//import Chat from "./pages/Chat.jsx";
import ChatList from "./components/ChatList.jsx";



import ProfileView from "./pages/ProfileView.jsx";
import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { ManageRoles } from "./pages/ManageRoles.jsx";
import AdminUsers from "./pages/admin/AdminUsers.jsx";
import { useAuth } from "./context/AuthContext.jsx";

export default function App() {
  const { user, loading } = useAuth();

  // Optional: show a loader until auth state is ready
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-semibold text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-green-100">
      {/* Show Navbar only if user is logged in *}
      {user && <Navbar />}

      <Routes>
        {/* --- Public Routes --- *}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </>
        )}

        {/* Redirect logged-in users away from auth pages *}
        {user && (
          <>
            <Route path="/login" element={<Navigate to="/" replace />} />
            <Route path="/register" element={<Navigate to="/" replace />} />
          </>
        )}

        {/* --- Protected User Routes --- *}
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
          element={<ProtectedRoute><ProfileView /></ProtectedRoute>}
        />
        <Route
          path="/search"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <Search />
            </ProtectedRoute>
          }
        />

        <Route
          path="/chat/:chatId"
          element={
            <ProtectedRoute allowedRoles={["user", "admin", "superAdmin"]}>
              <Chat />
            </ProtectedRoute>
          }
        />

        {/* --- Admin Routes --- *}
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

        {/* --- SuperAdmin Only --- *}
        <Route
          path="/admin/roles"
          element={
            <ProtectedRoute allowedRoles={["superAdmin"]}>
              <ManageRoles />
            </ProtectedRoute>
          }
        />

        {/* --- Fallback --- *}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}
*/






/*
//frontend/src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Chat from "./pages/Chat.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Search from "./pages/Search.jsx";

import { AdminDashboard } from "./pages/AdminDashboard.jsx";
import { ManageRoles } from "./pages/ManageRoles.jsx";
import  AdminUsers  from "./pages/admin/AdminUsers.jsx";

export default function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />

            <Routes>
                {/* Public Routes *}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Protected Routes *}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/search"
                    element={
                        <ProtectedRoute>
                            <Search />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/chat/:chatId"
                    element={
                        <ProtectedRoute>
                            <Chat />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Protected Routes *}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute roles={["admin", "superAdmin"]}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/roles"
                    element={
                        <ProtectedRoute roles={["superAdmin"]}>
                            <ManageRoles />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <ProtectedRoute roles={["admin", "superAdmin"]}>
                            <AdminUsers />
                        </ProtectedRoute>
                    }
                />

                {/* Handle Unknown Routes *}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}
*/