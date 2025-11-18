import React, { useState } from "react";
import api from "../utils/api";
import UserCard from "../components/UserCard";

export default function Search() {
    const [q, setQ] = useState({ location: "", hobby: "" });
    const [results, setResults] = useState([]);

    async function doSearch(e) {
        e?.preventDefault();
        try {
            const params = new URLSearchParams();
            if (q.location) params.append('location', q.location);
            if (q.hobby) params.append('hobby', q.hobby);
            const res = await api.get(`/users?${params.toString()}`);
            setResults(res.data.users || []);
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <form onSubmit={doSearch} className="mb-4 flex gap-2">
                <input value={q.location} onChange={e => setQ({ ...q, location: e.target.value })} placeholder="Location" className="px-3 py-2 border rounded" />
                <input value={q.hobby} onChange={e => setQ({ ...q, hobby: e.target.value })} placeholder="Hobby" className="px-3 py-2 border rounded" />
                <button className="btn-brand">Search</button>
            </form>

            <div className="grid gap-3">
                {results.map(r => <UserCard key={r.id} user={r} />)}
            </div>
        </div>
    );
}
