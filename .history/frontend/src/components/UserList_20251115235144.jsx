// frontend/src/components/UserList.jsx
import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/api";
import { ChatContext } from "../context/ChatContext";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const { user } = useContext(ChatContext); // optional if you track current user

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users"); // Adjust endpoint as needed
                setUsers(res.data || []);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

    const handleUserClick = (userId) => {
        navigate(`/chat/${userId}`); // navigate to the chat with this user
    };

    return (
        <div className="w-80 border-r overflow-y-auto bg-">
            <h2 className="font-semibold p-4 border-b">Chats / Users</h2>
            <ul>
                {users.map((u) => (
                    <li
                        key={u.id}
                        onClick={() => handleUserClick(u.id)}
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-100 transition"
                    >
                        {u.avatar ? (
                            <img
                                src={u.avatar}
                                alt={u.firstName}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white">
                                {u.firstName[0]}
                            </div>
                        )}
                        <span className="font-medium">{u.firstName} {u.lastName}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

