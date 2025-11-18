import React, { useState } from 'react';
import api from '../utils/api';
import UserCard from '../components/UserCard';

export default function Search() {
    const [filters, setFilters] = useState({ location: '', hobby: '', gender: '', budgetMin: '', budgetMax: '' });
    const [results, setResults] = useState([]);

    const submit = async e => {
        e.preventDefault();
        try {
            const res = await api.get('/users', { params: filters });
            setResults(res.data);
        } catch (err) { /* ignore */ }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl">Find Roommates</h2>
            <form onSubmit={submit} className="grid grid-cols-2 gap-2 my-4">
                <input className="border p-2" placeholder="Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} />
                <input className="border p-2" placeholder="Hobby" value={filters.hobby} onChange={e => setFilters({ ...filters, hobby: e.target.value })} />
                <input className="border p-2" placeholder="Gender" value={filters.gender} onChange={e => setFilters({ ...filters, gender: e.target.value })} />
                <input className="border p-2" placeholder="Budget Max" value={filters.budgetMax} onChange={e => setFilters({ ...filters, budgetMax: e.target.value })} />
                <button className="col-span-2 bg-indigo-600 text-white p-2 rounded">Search</button>
            </form>

            <div className="grid md:grid-cols-3 gap-4">
                {results.map(u => <UserCard key={u.id} u={u} />)}
            </div>
        </div>
    )
}
