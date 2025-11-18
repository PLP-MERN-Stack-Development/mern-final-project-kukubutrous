// frontend/src/components/UserCard.jsx
import React from "react";
import { motion } from "framer-motion";
import { FaUser } from "react-icons/fa";

export default function UserCard({ user, onClick }) {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onClick(user)}
            className="cursor-pointer bg-gradient-to-r from-green-400 to-green-600 dark:from-green-800 dark:to-green-900 
                 text-white rounded-xl p-4 shadow-lg flex items-center gap-4 transition-transform duration-200"
        >
            <div className="w-12 h-12 bg-green-200 dark:bg-green-700 rounded-full flex items-center justify-center text-green-800 dark:text-green-100">
                <FaUser size={24} />
            </div>
            <div className="flex flex-col">
                <span className="font-bold text-lg">{user.firstName} {user.lastName}</span>
                <span className="text-sm opacity-80">{user.email}</span>
                {user.location && <span className="text-sm opacity-70">{user.location}</span>}
            </div>
        </motion.div>
    );
}





/*
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
*/