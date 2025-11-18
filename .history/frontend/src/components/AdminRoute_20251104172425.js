import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'


export default function AdminRoute(){
const { user, ready } = useAuth()
if (!ready) return <div>Loading...</div>
return user && (user.role === 'admin' || user.role === 'superAdmin') ? <Outlet /> : <Navigate to="/dashboard" replace />
}