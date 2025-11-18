// frontend/src/components/UserCard.jsx
import React from "react";

export default function UserCard({ user, isActive }) {
    return (
        <div
            className={`flex items-center p-3 mb-2 rounded-xl cursor-pointer transition-all ${isActive
                    ? "bg-green-500 text-white"
                    : "hover:bg-pink-100 bg-gray-50 text-gray-700"
                }`}
        >
            <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-white font-semibold mr-3">
                {user?.firstName?.[0]?.toUpperCase()}
            </div>
            <div>
                <p className="font-semibold">
                    {user?.firstName} {user?.lastName}
                </p>
                <p className="text-sm text-gray-500">
                    {isActive ? "Active now" : user?.email}
                </p>
            </div>
        </div>
    );
}
