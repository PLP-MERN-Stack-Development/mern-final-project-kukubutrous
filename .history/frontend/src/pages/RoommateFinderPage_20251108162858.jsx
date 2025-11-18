import { useState } from 'react';
import apiClient from '../utils/apiClient';
import SearchFilters from '../components/SearchFilters';
import RoommateCard from '../components/RoommateCard';

export default function RoommateFinderPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (filters) => {
        setLoading(true);
        try {
            const params = new URLSearchParams(filters);
            const res = await apiClient.get(`/users?${params.toString()}`);
            setUsers(res.data.users);
        } catch (err) {
            console.error('Search users error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Find Roommates</h2>
            <SearchFilters onSearch={handleSearch} />
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(user => (
                        <RoommateCard key={user.id} user={user} />
                    ))}
                    {users.length === 0 && <p>No roommates found. Try adjusting your filters.</p>}
                </div>
            )}
        </div>
    );
}

