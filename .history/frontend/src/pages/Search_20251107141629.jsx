// src/pages/Search.jsx
import { useState } from "react";
import API from "../utils/api";
import UserCard from "../components/UserCard";

export default function Search() {
    const [query, setQuery] = useState({});
    const [results, setResults] = useState([]);

    const handleChange = (e) => setQuery({ ...query, [e.target.name]: e.target.value });

    const handleSearch = async (e) => {
        e.preventDefault();
        try {
            const res = await API.get("/users", { params: query });
            setResults(res.data.users);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-brightGreen mb-4">Search Roommates</h1>
            <form onSubmit={handleSearch} className="space-y-4 mb-6">
                <input name="location" placeholder="Location" className="w-full p-3 border rounded" onChange={handleChange} />
                <input name="roomType" placeholder="Room Type" className="w-full p-3 border rounded" onChange={handleChange} />
                <input name="hobby" placeholder="Hobby" className="w-full p-3 border rounded" onChange={handleChange} />
                <div className="flex gap-4">
                    <input name="budgetMin" type="number" placeholder="Min Budget" className="w-1/2 p-3 border rounded" onChange={handleChange} />
                    <input name="budgetMax" type="number" placeholder="Max Budget" className="w-1/2 p-3 border rounded" onChange={handleChange} />
                </div>
                <input name="gender" placeholder="Gender" className="w-full p-3 border rounded" onChange={handleChange} />
                <button className="w-full bg-brightPink text-white py-3 rounded hover:bg-pink-600 transition">Search</button>
            </form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map(user => <UserCard key={user.id} user={user} />)}
            </div>
        </div>
    );
}
