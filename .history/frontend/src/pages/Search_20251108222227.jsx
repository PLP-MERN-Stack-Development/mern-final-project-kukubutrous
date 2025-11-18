import React, { useState, useEffect } from "react";
import axios from "../utils/api";
import UserCard from "../components/UserCard";

export default function Search() {
    const [filters, setFilters] = useState({
        location: "",
        roomType: "",
        budgetMin: "",
        budgetMax: "",
        hobby: "",
        gender: "",
    });
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const query = new URLSearchParams(filters).toString();
            const res = await axios.get(`/users?${query}`);
            setUsers(res.data.users);
        } catch (err) {
            console.error("Search error:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Optionally, fetch all users initially
        handleSearch(new Event("load"));
    }, []);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Search Roommates</h1>

            <form
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded shadow"
                onSubmit={handleSearch}
            >
                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="roomType"
                    placeholder="Room Type"
                    value={filters.roomType}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="budgetMin"
                    placeholder="Min Budget"
                    value={filters.budgetMin}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <input
                    type="number"
                    name="budgetMax"
                    placeholder="Max Budget"
                    value={filters.budgetMax}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <input
                    type="text"
                    name="hobby"
                    placeholder="Hobby/Activity"
                    value={filters.hobby}
                    onChange={handleChange}
                    className="p-2 border rounded"
                />
                <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleChange}
                    className="p-2 border rounded"
                >
                    <option value="">Any Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
                <button
                    type="submit"
                    className="col-span-full md:col-span-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
                >
                    Search
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {loading && <div className="col-span-full text-center">Loading...</div>}
                {!loading && users.length === 0 && (
                    <div className="col-span-full text-center text-gray-500">
                        No users found
                    </div>
                )}
                {!loading &&
                    users.map((u) => <UserCard key={u.id} user={u} />)}
            </div>
        </div>
    );
}
