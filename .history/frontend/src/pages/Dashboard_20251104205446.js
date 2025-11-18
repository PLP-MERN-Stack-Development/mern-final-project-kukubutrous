import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.js";
import api from "../utils/api.js";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { user, logout } = useAuth();
    const [roommates, setRoommates] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const { data } = await api.get("/users");
            setRoommates(data);
        };
        fetchUsers();
    }, []);

    return (
        <div className="p-5">
            <header className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-semibold">Welcome, {user?.firstName}</h1>
                <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded">
                    Logout
                </button>
            </header>

            <h2 className="text-lg font-semibold mb-3">Available Roommates</h2>
            <div className="grid md:grid-cols-2 gap-4">
                {roommates.map((r) => (
                    <div key={r.userId} className="p-4 bg-white shadow rounded">
                        <h3 className="font-semibold">{r.name}</h3>
                        <p className="text-gray-600">{r.email}</p>
                        <Link
                            to={`/chat/${r.userId}`}
                            className="text-blue-500 text-sm mt-2 inline-block"
                        >
                            Chat
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
