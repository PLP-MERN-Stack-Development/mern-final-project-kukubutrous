import React, { useState } from 'react'
import api from '../../api/axios.js'
import UserCard from '../../components/UserCard.js'


export default function Search() {
    const [filters, setFilters] = useState({ location: '', hobby: '', gender: '', budgetMin: '', budgetMax: '' })
    const [results, setResults] = useState([])
    const submit = async e => { e.preventDefault(); const res = await api.get('/users', { params: filters }); setResults(res.data.users) }
    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-xl mb-4">Find Roommates</h2>
            <form onSubmit={submit} className="grid grid-cols-2 gap-2 mb-4">
                <input placeholder="Location" value={filters.location} onChange={e => setFilters({ ...filters, location: e.target.value })} className="p-2 border" />
                <input placeholder="Hobby" value={filters.hobby} onChange={e => setFilters({ ...filters, hobby: e.target.value })} className="p-2 border" />
                <input placeholder="Gender" value={filters.gender} onChange={e => setFilters({ ...filters, gender: e.target.value })} className="p-2 border" />
                <input placeholder="Budget Max" value={filters.budgetMax} onChange={e => setFilters({ ...filters, budgetMax: e.target.value })} className="p-2 border" />
                <button className="col-span-2 bg-indigo-600 text-white p-2">Search</button>
            </form>
            <div className="grid grid-cols-3 gap-4">
                {results.map(u => <UserCard key={u.id} user={u} />)}
            </div>
        </div>
    )
}