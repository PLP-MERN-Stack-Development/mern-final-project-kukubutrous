





/*
//frontend/src/pages/Searc
import React, { useState, useEffect } from "react";
import api from "../utils/api.js";
import UserCard from "../components/UserCard.jsx";

export default function Search() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim() === "") {
                setResults([]);
                return;
            }
            api.get(`/users/search?q=${query}`).then(res => setResults(res.data));
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    return (
        <div className="p-4 max-w-4xl mx-auto">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search roommates..."
                className="w-full border p-2 rounded mb-4"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {results.map(u => <UserCard key={u.id} user={u} />)}
                {results.length === 0 && query && <p>No results found.</p>}
            </div>
        </div>
    );
}

*/