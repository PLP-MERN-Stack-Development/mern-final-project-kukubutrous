import React from "react";

export default function UserCard({ user }) {
    return (
        <div className="card flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center text-white font-bold">
                {user.firstName?.[0] || "U"}
            </div>
            <div>
                <div className="font-semibold">{user.firstName} {user.lastName}</div>
                <div className="text-sm text-gray-600">{user.location || "Unknown location"}</div>
                <div className="text-xs text-gray-500 mt-1">Budget: {user.budgetMin}-{user.budgetMax}</div>
            </div>
        </div>
    );
}
