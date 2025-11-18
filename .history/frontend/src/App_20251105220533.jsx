//App.jsx
import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Dashboard from './pages/Dashboard'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Inbox from './pages/Inbox'
import Conversation from './pages/Conversation'
import Admin from './pages/Admin'
import Navbar from './components/Navbar'
import { useAuth } from './context/AuthContext'

export default function App() {
    const { ready, user } = useAuth()
    if (!ready) return <div className="p-4">Loading...</div>

    return (
        <div>
            <Navbar />
            <main className="p-4">
                <Routes>
                    <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/verify/:token" element={<VerifyEmail />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset/:token" element={<ResetPassword />} />

                    <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
                    <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
                    <Route path="/search" element={user ? <Search /> : <Navigate to="/login" />} />
                    <Route path="/inbox" element={user ? <Inbox /> : <Navigate to="/login" />} />
                    <Route path="/conversations/:id" element={user ? <Conversation /> : <Navigate to="/login" />} />

                    <Route path="/admin" element={user && (user.role === 'admin' || user.role === 'superAdmin') ? <Admin /> : <Navigate to="/dashboard" />} />
                </Routes>
            </main>
        </div>
    )
}
