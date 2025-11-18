import { useState } from 'react';

export default function SearchFilters({ onSearch }) {
  const [filters, setFilters] = useState({
    location: '',
    roomType: '',
    budgetMin: '',
    budgetMax: '',
    hobby: '',
    gender: '',
  });

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow mb-4 flex flex-wrap gap-4">
      <input
        type="text"
        name="location"
        placeholder="Location"
        value={filters.location}
        onChange={handleChange}
        className="p-2 border rounded flex-1 min-w-[150px]"
      />
      <select name="roomType" value={filters.roomType} onChange={handleChange} className="p-2 border rounded">
        <option value="">Room Type</option>
        <option value="Single">Single</option>
        <option value="Shared">Shared</option>
      </select>
      <input
        type="number"
        name="budgetMin"
        placeholder="Budget Min"
        value={filters.budgetMin}
        onChange={handleChange}
        className="p-2 border rounded w-24"
      />
      <input
        type="number"
        name="budgetMax"
        placeholder="Budget Max"
        value={filters.budgetMax}
        onChange={handleChange}
        className="p-2 border rounded w-24"
      />
      <input
        type="text"
        name="hobby"
        placeholder="Hobby"
        value={filters.hobby}
        onChange={handleChange}
        className="p-2 border rounded w-32"
      />
      <select name="gender" value={filters.gender} onChange={handleChange} className="p-2 border rounded w-32">
        <option value="">Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
      <button type="submit" className="bg-green-500 text-white px-4 rounded">Search</button>
    </form>
  );
}
