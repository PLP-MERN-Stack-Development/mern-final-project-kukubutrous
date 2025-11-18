import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Auth/Login'
import Register from './pages/Auth/Register'
import Verify from './pages/Auth/Verify'
import ForgotPassword from './pages/Auth/ForgotPassword'
import ResetPassword from './pages/Auth/ResetPassword'
import Dashboard from './pages/Dashboard/Dashboard'
import Profile from './pages/Profile/Profile'
import Search from './pages/Search/Search'
import Inbox from './pages/Chat/Inbox'
import Conversation from './pages/Chat/Conversation'
import AdminDashboard from './pages/Admin/AdminDashboard'
import { useAuth } from './context/AuthContext'
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