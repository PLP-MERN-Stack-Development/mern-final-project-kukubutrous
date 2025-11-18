import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Inbox from "./pages/Inbox";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";

export default function App() {
    return (
        <AuthProvider>
            <ChatProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/verify" element={<VerifyEmail />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />

                        {/* Protected User Routes */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute roles={["user", "admin", "superAdmin"]}>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute roles={["user", "admin", "superAdmin"]}>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/inbox"
                            element={
                                <ProtectedRoute roles={["user", "admin", "superAdmin"]}>
                                    <Inbox />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/chat/:chatId"
                            element={
                                <ProtectedRoute roles={["user", "admin", "superAdmin"]}>
                                    <Chat />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin / SuperAdmin Route */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute roles={["admin", "superAdmin"]}>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback */}
                        <Route
                            path="*"
                            element={
                                <ProtectedRoute roles={["user", "admin", "superAdmin"]}>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </Router>
            </ChatProvider>
        </AuthProvider>
    );
}
