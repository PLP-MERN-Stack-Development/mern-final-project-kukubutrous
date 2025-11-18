import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute(){
  const { ready, user } = useAuth();
  if (!ready) return <div>Loading...</div>;
  return user ? <Outlet/> : <Navigate to="/login" replace />;
}
