import React, { useState } from "react";
import { searchUsers } from "../api/users";

export default function Search() {
    const [filters, setFilters] = useState({});
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        const users = await searchUsers(filters);
        setResults(users);
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Search Roommates</h2>
            <div className="flex flex-wrap gap-2 mb-4">
                <input
                    placeholder="Location"
                    className="border p-1 rounded"
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
                <input
                    placeholder="Room Type"
                    className="border p-1 rounded"
                    onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                />
                <input
                    placeholder="Budget Min"
                    className="border p-1 rounded"
                    type="number"
                    onChange={(e) => setFilters({ ...filters, budgetMin: e.target.value })}
                />
                <input
                    placeholder="Budget Max"
                    className="border p-1 rounded"
                    type="number"
                    onChange={(e) => setFilters({ ...filters, budgetMax: e.target.value })}
                />
                <input
                    placeholder="Hobby"
                    className="border p-1 rounded"
                    onChange={(e) => setFilters({ ...filters, hobby: e.target.value })}
                />
                <input
                    placeholder="Gender"
                    className="border p-1 rounded"
                    onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
                />
                <button
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((u) => (
                    <div key={u.id} className="p-3 border rounded bg-gray-50 dark:bg-gray-700">
                        <h3 className="font-bold">{u.firstName} {u.lastName}</h3>
                        <p>Location: {u.location}</p>
                        <p>Room Type: {u.roomType}</p>
                        <p>Budget: {u.budgetMin} - {u.budgetMax}</p>
                        <p>Hobbies: {u.hobbies}</p>
                        <p>Gender: {u.gender}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
