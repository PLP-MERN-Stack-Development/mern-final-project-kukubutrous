import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import api from "./utils/api";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

/* Pages */
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Admin from "./pages/Admin";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Inbox from "./pages/Inbox";

/* styles */
import "./styles/index.css";

export const AuthContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  async function loadUser() {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoadingUser(false);
      return;
    }
    try {
      const res = await api.get("/users/me");
      setUser(res.data.user);
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  }

  useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loadingUser }}>
      <BrowserRouter>
        <div className="app-shell">
          <div className="nav">
            <Navbar />
          </div>
          <div className="content">
            <Routes>
              <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify" element={<VerifyEmail />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/search" element={<Search />} />
                <Route path="/admin" element={<Admin />} />
              </Route>

              <Route path="*" element={<div className="card">Page not found</div>} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
