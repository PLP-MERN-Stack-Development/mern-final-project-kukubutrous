import React from 'react'
import { Link } from 'react-router-dom'

export default function UserCard({ user }){
  // hide admin/super-admin from normal users is done server-side; still defensive here
  if (user.role === 'admin' || user.role === 'superAdmin') return null

  return (
    <div className="p-4 border rounded-md bg-white shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center">{(user.firstName||'U').charAt(0)}</div>
        <div>
          <div className="font-semibold">{user.firstName} {user.lastName}</div>
          <div className="text-sm text-gray-500">{user.location || 'Unknown'}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div cl