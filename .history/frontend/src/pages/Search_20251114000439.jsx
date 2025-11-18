// frontend/src/pages/Search.jsx
import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import UserCard from "../components/UserCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function Search() {
    const { user } = useAuth();
    const [filters, setFilters] = useState({
        query: "",
        hobbies: "",
        gender: "",
        activities: "",
        location: "",
        roomType: "",
        budgetMin: "",
        budgetMax: "",
    });
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // 🧠 Handle filter changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    // 🕓 Debounced live search
    useEffect(() => {
        const delay = setTimeout(() => {
            fetchUsers();
        }, 400);

        return () => clearTimeout(delay);
        // eslint-disable-next-line
    }, [filters]);

    // 📡 Fetch users from backend (with filtering)
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();

            // Append all non-empty filters
            Object.entries(filters).forEach(([key, val]) => {
                if (val.trim() !== "") params.append(key, val);
            });

            const res = await api.get(`/users`, { params });

            // 🚫 Filter out admins & self
            const filtered = res.data.filter(
                (u) => u.role !== "admin" && u.role !== "superAdmin" && u.id !== user.id
            );

            setResults(filtered);
        } catch (err) {
            console.error("Search failed:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-sm">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                🔍 Find Your Perfect Roommate
            </h2>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                <input
                    type="text"
                    name="query"
                    placeholder="Search by name..."
                    value={filters.query}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    <option value="">Any Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    name="hobbies"
                    placeholder="Hobbies (e.g. music, sports)"
                    value={filters.hobbies}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    type="text"
                    name="activities"
                    placeholder="Activities (e.g. studying, cooking)"
                    value={filters.activities}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <select
                    name="roomType"
                    value={filters.roomType}
                    onChange={handleChange}
                    className="border p-2 rounded"
                >
                    <option value="">Room Type</option>
                    <option value="shared">Shared</option>
                    <option value="single">Single</option>
                    <option value="ensuite">Ensuite</option>
                </select>

                <input
                    type="number"
                    name="budgetMin"
                    placeholder="Min Budget"
                    value={filters.budgetMin}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />

                <input
                    type="number"
                    name="budgetMax"
                    placeholder="Max Budget"
                    value={filters.budgetMax}
                    onChange={handleChange}
                    className="border p-2 rounded"
                />
            </div>

            {/* Results */}
            {loading ? (
                <div className="text-center text-gray-500">Searching...</div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {results.map((u) => (
                        <UserCard key={u.id} user={u} />
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">
                    {filters.query || filters.location
                        ? "No roommates found. Try adjusting your filters."
                        : "Start typing to find potential roommates."}
                </p>
            )}
        </div>
    );
}
