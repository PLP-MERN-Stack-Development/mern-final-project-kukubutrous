import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import Navbar from "./components/Navbar";

export default function App() {
    return (
        <AuthProvider>
            <SocketProvider>
                <BrowserRouter>
                    <Navbar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        <Route
                            path="/profile"
                            element={<PrivateRoute><Profile /></PrivateRoute>}
                        />
                        <Route
                            path="/search"
                            element={<PrivateRoute><Search /></PrivateRoute>}
                        />
                        <Route
                            path="/chat"
                            element={<PrivateRoute><Chat /></PrivateRoute>}
                        />
                        <Route
                            path="/admin"
                            element={<PrivateRoute adminOnly><AdminDashboard /></PrivateRoute>}
                        />
                    </Routes>
                </BrowserRouter>
            </SocketProvider>
        </AuthProvider>
    );
}
