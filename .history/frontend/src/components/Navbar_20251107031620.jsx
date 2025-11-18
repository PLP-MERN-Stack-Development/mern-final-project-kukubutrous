import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

export default function Navbar() {
    const { user, setUser } = useContext(AuthContext);
    const navigate = useNavigate();

    function logout() {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/login");
    }

    return (
        <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center text-white font-bold shadow">
                    RF
                </div>
                <div>
                    <div className="font-bold text-lg text-brand-700">Roommate Finder</div>
                    <div className="text-sm text-gray-600">Find your perfect roomie</div>
                </div>
            </div>

            <nav className="flex flex-col gap-2">
                <Link to="/dashboard" className="px-3 py-2 rounded hover:bg-brand-50">Dashboard</Link>
                <Link to="/chat" className="px-3 py-2 rounded hover:bg-brand-50">Chat</Link>
                <Link to="/inbox" className="px-3 py-2 rounded hover:bg-brand-50">Inbox</Link>
                <Link to="/search" className="px-3 py-2 rounded hover:bg-brand-50">Search</Link>
                <Link to="/profile" className="px-3 py-2 rounded hover:bg-brand-50">Profile</Link>
                <Link to="/admin" className="px-3 py-2 rounded hover:bg-brand-50">Admin</Link>

                <div className="mt-4 border-t pt-4">
                    {user ? (
                        <div>
                            <div className="text-sm text-gray-700 mb-2">Signed in as</div>
                            <div className="font-semibold">{user.firstName} {user.lastName}</div>
                            <button onClick={logout} className="mt-3 btn-brand w-full">Logout</button>
                        </div>
                    ) : (
                        <div>
                            <Link to="/login" className="btn-brand w-full text-center">Sign in</Link>
                        </div>
                    )}
                </div>
            </nav>
        </div>
    );
}
