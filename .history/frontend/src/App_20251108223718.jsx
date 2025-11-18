import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import Profile from "./pages/Profile";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";
import Inbox from "./pages/Inbox";

function App() {
    return (
        <AuthProvider>
            <ChatProvider>
                <Router>
                    <Routes>
                        {/* Public routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/verify-email/:token" element={<VerifyEmail />} />

                        {/* Protected routes */}
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
                            path="/chat/:chatId"
                            element={
                                <ProtectedRoute>
                                    <Chat />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/inbox"
                            element={
                                <ProtectedRoute>
                                    <Inbox />
                                </ProtectedRoute>
                            }
                        />

                        {/* Admin routes */}
                        <Route
                            path="/admin"
                            element={
                                <ProtectedRoute roles={["admin", "superAdmin"]}>
                                    <Admin />
                                </ProtectedRoute>
                            }
                        />

                        {/* Fallback route */}
                        <Route path="*" element={<Dashboard />} />
                    </Routes>
                </Router>
            </ChatProvider>
        </AuthProvider>
    );
}

export default App;
