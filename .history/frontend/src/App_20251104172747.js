import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Verify from './pages/Auth/Verify.'
import ForgotPassword from './pages/Auth/ForgotPassword.js'
import ResetPassword from './pages/Auth/ResetPassword.js'
import Dashboard from './pages/Dashboard/Dashboard.js'
import Profile from './pages/Profile/Profile.js'
import Search from './pages/Search/Search.js'
import Inbox from './pages/Chat/Inbox.js'
import Conversation from './pages/Chat/Conversation.js'
import AdminDashboard from './pages/Admin/AdminDashboard.js'
import { useAuth } from './context/AuthContext.js'
import ProtectedRoute from './components/ProtectedRoute.js'
import AdminRoute from './components/AdminRoute.js'


export default function App() {
  const { ready } = useAuth()
  if (!ready) return <div className="p-4">Loading...</div>


  return (
    <div>
      <Navbar />
      <main className="p-4">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/search" element={<Search />} />
            <Route path="/inbox" element={<Inbox />} />
            <Route path="/conversations/:id" element={<Conversation />} />
          </Route>


          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>


        </Routes>
      </main>
    </div>
  )
}