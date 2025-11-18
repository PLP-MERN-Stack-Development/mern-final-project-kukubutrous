




/*

// frontend/src/App.jsx
import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.jsx";

// Pages
import Dashboard from "./pages/Dashboard.jsx";
import Chat from "./pages/Chat.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import Search from "./pages/Search.jsx";
import Admin from "./pages/Admin.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";
import VerifyEmail from "./pages/VerifyEmail.jsx";

// Components
import Navbar from "./components/Navbar.jsx";

// Protected Route Wrapper
const ProtectedRoute = ({ children, roles }) => {
    const { user, loading } = useContext(AuthContext);

    if (loading) return <div className="p-6 text-center">Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

    return children;
};

export default function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify/:token" element={<VerifyEmail />} />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
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
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute roles={["admin", "superAdmin"]}>
                            <Admin />
                        </ProtectedRoute>
                    }
                />

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}
*/