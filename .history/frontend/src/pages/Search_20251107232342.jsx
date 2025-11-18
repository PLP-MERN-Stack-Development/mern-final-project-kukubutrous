// frontend/src/pages/Search.jsx
import React, { useEffect, useState } from "react";
import api from "../utils/api";
import UserCard from "../components/UserCard";

export default function Search() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/users");
        setUsers(res.data);
        setFilteredUsers(res.data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const lower = search.toLowerCase();
    const filtered = users.filter(
      (u) =>
        u.firstName.toLowerCase().includes(lower) ||
        u.location?.toLowerCase().includes(lower) ||
        u.hobbies?.toLowerCase().includes(lower)
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-green-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-500 to-green-500 bg-clip-text text-transparent">
          Search for Roommates 🏡
        </h1>

        <div className="flex justify-center mb-6">
          <input
            type="text"
            placeholder="Search by name, location, or hobby..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-lg border rounded-full px-5 py-2 focus:ring-2 focus:ring-green-400 outline-none"
          />
        </div>

        {filteredUsers.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <UserCard key={user._id} user={user} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 font-medium">
            No users found. Try adjusting your search.
          </p>
        )}
      </div>
    </div>
  );
}
