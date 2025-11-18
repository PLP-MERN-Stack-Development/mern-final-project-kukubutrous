
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";
import  ChatContext  from "../context/ChatContext.jsx";
import UserCard from "../components/UserCard.jsx";
import api from "../utils/api.js";

export default function Dashboard() {
    const { user } = useContext(AuthContext);
    const { openChats } = useContext(ChatContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                setUsers(res.data.users || res.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {users.map((u) => (
                <UserCard key={u.id} user={u} />
            ))}
            {openChats.map((c) => (
                <div key={c.chatId} className="fixed bottom-2 right-2">
                    {/* ChatWindow instances are handled inside UserCard */}
                </div>
            ))}
        </div>
    );
}
