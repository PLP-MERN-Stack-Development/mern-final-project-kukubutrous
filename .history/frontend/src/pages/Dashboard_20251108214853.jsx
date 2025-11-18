import React from "react";
import { Link } from "react-router-dom";

export default function Dashboard() {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Link to="/search" className="p-4 bg-green-100 rounded shadow text-center">
                    Find Roommates
                </Link>
                <Link to="/inbox" className="p-4 bg-blue-100 rounded shadow text-center">
                    Inbox
                </Link>
                <Link to="/profile" className="p-4 bg-pink-100 rounded shadow text-center">
                    Profile
                </Link>
            </div>
        </div>
    );
}
