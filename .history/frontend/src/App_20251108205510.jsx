import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Search from './pages/Search'
import Profile from './pages/Profile'
import Chat from './pages/Chat'
import Inbox from './pages/Inbox'
import Dashboard from './pages/Dashboard'
import Admin from './pages/Admin'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import ChatWindow from './components/ChatWindow'

export default function App() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="p-4 max-w-6xl mx-auto">
        <Routes>
          <Route path="/" element={<Navigate to="/search" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword/>} />
          <Route path="/reset-password" element={<ResetPassword/>} />

          <Route path="/search" element={<ProtectedRoute><Search/></ProtectedRoute>} />
          <Route path="/profile/:id" element={<ProtectedRoute><Profile/></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat/></ProtectedRoute>} />
          <Route path="/inbox" element={<ProtectedRoute><Inbox/></ProtectedRoute>} />

          <Route path="/dashboard" element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute><Admin/></ProtectedRoute>} />
        </Routes>
      </main>

      {/* Floating chat windows from ChatContext */}
      <ChatWindow />
    </div>
  )
}