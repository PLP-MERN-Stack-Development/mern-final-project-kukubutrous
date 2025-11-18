import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import apiClient from '../utils/apiClient';

export default function Profile() {
  const { user, setUser } = useContext(AuthContext);
  const [form, setForm] = useState(user || {});
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => setForm(user || {}), [user]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await apiClient.put('/users/me', form);
      setUser(res.data.user);
      setSuccess('Profile updated successfully!');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
      setSuccess('');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow max-w-lg">
        {success && <p className="text-green-500 mb-2">{success}</p>}
        {error && <p className="text-red-500 mb-2">{error}</p>}

        <input name="firstName" value={form.firstName || ''} onChange={handleChange} placeholder="First Name" className="w-full p-2 border rounded mb-2" />
        <input name="lastName" value={form.lastName || ''} onChange={handleChange} placeholder="Last Name" className="w-full p-2 border rounded mb-2" />
        <input name="phoneNumber" value={form.phoneNumber || ''} onChange={handleChange} placeholder="Phone Number" className="w-full p-2 border rounded mb-2" />
        <input name="location" value={form.location || ''} onChange={handleChange} placeholder="Location" className="w-full p-2 border rounded mb-2" />
        <input name="roomType" value={form.roomType || ''} onChange={handleChange} placeholder="Room Type" className="w-full p-2 border rounded mb-2" />
        <input name="budgetMin" value={form.budgetMin || ''} onChange={handleChange} placeholder="Min Budget" type="number" className="w-full p-2 border rounded mb-2" />
        <input name="budgetMax" value={form.budgetMax || ''} onChange={handleChange} placeholder="Max Budget" type="number" className="w-full p-2 border rounded mb-2" />
        <input name="hobbies" value={form.hobbies || ''} onChange={handleChange} placeholder="Hobbies (comma separated)" className="w-full p-2 border rounded mb-2" />
        <select name="gender" value={form.gender || ''} onChange={handleChange} className="w-full p-2 border rounded mb-2">
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select name="preferredGender" value={form.preferredGender || ''} onChange={handleChange} className="w-full p-2 border rounded mb-2">
          <option value="">Preferred Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="any">Any</option>
        </select>

        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Save Changes</button>
      </form>
    </div>
  );
}
