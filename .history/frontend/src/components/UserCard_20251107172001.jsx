// src/components/UserCard.jsx
import { motion } from "framer-motion";

export default function UserCard({ user, onClick }) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className="p-4 border rounded-xl shadow hover:shadow-lg cursor-pointer flex flex-col gap-2 bg-white"
        >
            <img
                src={user.avatar || "/default-avatar.png"}
                alt="avatar"
                className="w-20 h-20 object-cover rounded-full mx-auto"
            />

            <div className="text-center">
                <h3 className="text-lg font-semibold">
                    {user.firstName} {user.lastName}
                </h3>
                <p className="text-gray-500 text-sm">{user.location}</p>
            </div>

            <div className="flex justify-center gap-2 mt-2">
                {user.hobbies?.slice(0, 3).map((h, i) => (
                    <span
                        key={i}
                        className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs"
                    >
                        {h}
                    </span>
                ))}
            </div>
        </motion.div>
    );
}
