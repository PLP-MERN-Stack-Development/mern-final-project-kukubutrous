import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    return (
        <nav className="bg-white p-4 shadow">
            <div className="max-w-6xl mx-auto flex justify-between items-center">
                <Link to="/" className="font-bold">Roommate Finder</Link>
                <div className="flex gap-4 items-center">
                    {user ? (
                        <>
                            <Link to="/search">Find</Link>
                            <Link to="/inbox">Inbox</Link>
                            <Link to="/profile">Profile</Link>
                            {(user.role === 'admin' || user.role === 'superAdmin') && <Link to="/admin">Admin</Link>}
                            <button onClick={logout} className="text-sm">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
