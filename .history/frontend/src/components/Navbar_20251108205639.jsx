import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
    const { user, logout } = useAuth()
    const nav = useNavigate()

    return (
        <header className="bg-white shadow">
            <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                <Link to="/" className="font-bold text-xl text-brandGreen">Roommate Finder</Link>

                <nav className="space-x-3">
                    <Link to="/search" className="px-3 py-1 rounded-md hover:bg-gray-100">Search</Link>
                    {user && <Link to="/inbox" className="px-3 py-1 rounded-md hover:bg-gray-100">Inbox</Link>}
                    {user?.role === 'admin' || user?.role === 'superAdmin' ? (
                        <Link to="/admin" className="px-3 py-1 rounded-md text-sm bg-brandPink text-white">Admin</Link>
                    ) : null}

                    {!user ? (
                        <>
                            <Link to="/login" className="px-3 py-1 rounded-md">Login</Link>
                            <Link to="/register" className="px-3 py-1 rounded-md text-white bg-brandGreen">Sign up</Link>
                        </>
                    ) : (
                        <button onClick={() => { logout(); nav('/login') }} className="px-3 py-1 rounded-md">Logout</button>
                    )}
                </nav>
            </div>
        </header>
    )
}