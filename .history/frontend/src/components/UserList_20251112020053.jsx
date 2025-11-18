// frontend/src/components/UserList.jsx
import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { ChatContext } from "../context/ChatContext";

export default function UserList() {
    const [users, setUsers] = useState([]);
    const { openChat } = useContext(ChatContext);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await api.get("/users");
                setUsers(res.data.users || []);
            } catch (err) {
                console.error("Error fetching users:", err);
            }
        };
        fetchUsers();
    }, []);

    return (
        <div className="p-4 border-r w-64 h-full overflow-y-auto">
            <h2 className="font-bold mb-2">Contacts</h2>
            {users.map((u) => (
                <div
                    key={u.id}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                    onClick={() => openChat({ id: u.id, firstName: u.firstName, lastName: u.lastName })}
                >
                    {u.firstName} {u.lastName}
                </div>
            ))}
        </div>
    );
}
*/