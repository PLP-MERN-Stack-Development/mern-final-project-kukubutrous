// frontend/src/App.jsx
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

import AdminDashboard from "./pages/AdminDashboard.jsx";
import ManageRoles from "./pages/ManageRoles.jsx";
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
    <div className="min-h-screen bg-gray-100">
      {/* Show Navbar only if user is logged in */}
      {user && <Navbar />}

      <Routes>
        {/* --- Public Routes --- */}
        {!user && (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </>
        )}

        {/* Redirect logged-in users away from auth pages */}
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
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}







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