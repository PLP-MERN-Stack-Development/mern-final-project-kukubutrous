import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
    const { user, setUser } = useAuth();
    const [form, setForm] = useState({});

    useEffect(() => {
        if (user) setForm(user);
    }, [user]);

    const submit = async e => {
        e.preventDefault();
        try {
            const res = await api.put('/users/profile', form);
            setUser(res.data.user || res.data);
            alert('Saved');
        } catch (err) {
            alert('Error');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h2 className="text-xl mb-4">Profile</h2>
            <form onSubmit={submit} className="space-y-2">
                <input className="w-full border p-2" value={form.firstName || ''} onChange={e => setForm({ ...form, firstName: e.target.value })} />
                <input className="w-full border p-2" value={form.lastName || ''} onChange={e => setForm({ ...form, lastName: e.target.value })} />
                <input className="w-full border p-2" value={form.phoneNumber || ''} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
                <input className="w-full border p-2" value={form.location || ''} onChange={e => setForm({ ...form, location: e.target.value })} />
                <button className="bg-indigo-600 text-white px-3 py-1 rounded">Save</button>
            </form>
        </div>
    )
}
