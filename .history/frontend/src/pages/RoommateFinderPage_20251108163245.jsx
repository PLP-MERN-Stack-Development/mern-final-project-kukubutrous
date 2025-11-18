import { useState, useEffect } from "react";
import axios from "axios";

export default function RoommateFinderPage() {
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

    // fetch users when filters change
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const params = {};
                Object.keys(filters).forEach((key) => {
                    if (filters[key]) params[key] = filters[key];
                });
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/users`, { params });
                setUsers(res.data.users);
            } catch (err) {
                console.error("Search error:", err);
            }
            setLoading(false);
        };

        fetchUsers();
    }, [filters]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="flex flex-col md:flex-row gap-4 h-full">
            {/* Filters Panel */}
            <div className="w-full md:w-1/4 bg-white dark:bg-gray-800 p-4 rounded shadow space-y-3 transition-colors duration-300">
                <h2 className="font-bold text-lg mb-2">Filters</h2>

                <input
                    type="text"
                    name="location"
                    placeholder="Location"
                    value={filters.location}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />

                <select
                    name="roomType"
                    value={filters.roomType}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Room Type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="studio">Studio</option>
                </select>

                <div className="flex gap-2">
                    <input
                        type="number"
                        name="budgetMin"
                        placeholder="Min Budget"
                        value={filters.budgetMin}
                        onChange={handleChange}
                        className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    />
                    <input
                        type="number"
                        name="budgetMax"
                        placeholder="Max Budget"
                        value={filters.budgetMax}
                        onChange={handleChange}
                        className="flex-1 p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                    />
                </div>

                <input
                    type="text"
                    name="hobby"
                    placeholder="Hobby"
                    value={filters.hobby}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                />

                <select
                    name="gender"
                    value={filters.gender}
                    onChange={handleChange}
                    className="w-full p-2 rounded border border-gray-300 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                >
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </select>
            </div>

            {/* Results Panel */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto">
                {loading ? (
                    <p>Loading...</p>
                ) : users.length === 0 ? (
                    <p>No roommates found</p>
                ) : (
                    users.map((user) => (
                        <div
                            key={user.id}
                            className="p-4 bg-white dark:bg-gray-800 rounded shadow hover:shadow-lg transition-transform transform hover:-translate-y-1 duration-200"
                        >
                            <h3 className="font-bold text-lg">{user.firstName} {user.lastName}</h3>
                            <p><strong>Location:</strong> {user.location || 'N/A'}</p>
                            <p><strong>Room Type:</strong> {user.roomType || 'N/A'}</p>
                            <p><strong>Budget:</strong> ${user.budgetMin || 0} - ${user.budgetMax || 0}</p>
                            <p><strong>Gender:</strong> {user.gender || 'N/A'}</p>
                            <p><strong>Hobbies:</strong> {user.hobbies || 'N/A'}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
