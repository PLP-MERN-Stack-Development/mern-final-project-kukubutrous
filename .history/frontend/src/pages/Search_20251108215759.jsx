import React, { useState, useEffect } from "react";
import api from "../utils/api";
import UserCard from "../components/UserCard";

export default function Search() {
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ location: "", gender: "", hobbies: "" });

    useEffect(() => {
        const fetchUsers = async () => {
            const res = await api.get("/users/search", { params: filters });
            setUsers(res.data);
        };
        fetchUsers();
    }, [filters]);

    const handleChange = (e) => setFilters({ ...filters, [e.target.name]: e.target.value });

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Find Roommates</h1>
            <div className="flex gap-2 mb-4">
                <input name="location" placeholder="Location" className="border rounded px-2 py-1" value={filters.location} onChange={handleChange} />
                <input name="gender" placeholder="Preferred Gender" className="border rounded px-2 py-1" value={filters.gender} onChange={handleChange} />
                <input name="hobbies" placeholder="Hobbies/Activities" className="border rounded px-2 py-1" value={filters.hobbies} onChange={handleChange} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.map((user) => <UserCard key={user.id} user={user} />)}
            </div>
        </div>
    );
}
