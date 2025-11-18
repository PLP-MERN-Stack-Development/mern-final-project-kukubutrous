import React, { useEffect, useState, useContext } from "react";
import api from "../utils/api";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import UserCard from "../components/UserCard";
import ChatWindow from "../components/ChatWindow";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const { openChats, openChat, closeChat, toggleMinimize } = useContext(ChatContext);

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState({
    location: "",
    roomType: "",
    budgetMin: "",
    budgetMax: "",
    hobby: "",
    gender: "",
  });
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = { ...search };
      const res = await api.get("/users", { params });
      // Filter out admin/superAdmin
      const filtered = res.data.users.filter(
        (u) => u.role === "user" && u.id !== user.id
      );
      setUsers(filtered);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    await fetchUsers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Browse Roommates</h1>

      {/* Search Form */}
      <form className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6" onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Location"
          name="location"
          value={search.location}
          onChange={handleSearchChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Room Type"
          name="roomType"
          value={search.roomType}
          onChange={handleSearchChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Hobby"
          name="hobby"
          value={search.hobby}
          onChange={handleSearchChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Min Budget"
          name="budgetMin"
          value={search.budgetMin}
          onChange={handleSearchChange}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Budget"
          name="budgetMax"
          value={search.budgetMax}
          onChange={handleSearchChange}
          className="border p-2 rounded"
        />
        <select
          name="gender"
          value={search.gender}
          onChange={handleSearchChange}
          className="border p-2 rounded"
        >
          <option value="">Preferred Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="any">Any</option>
        </select>
        <button
          type="submit"
          className="col-span-2 md:col-span-1 bg-green-500 text-white p-2 rounded hover:bg-green-600"
        >
          Search
        </button>
      </form>

      {/* User Cards */}
      {loading ? (
        <p>Loading users...</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => (
            <UserCard key={u.id} user={u} onChat={() => openChat(u.id)} />
          ))}
        </div>
      )}

      {/* Chat Windows */}
      {openChats.map((chat) => (
        <ChatWindow
          key={chat.chatId}
          chatId={chat.chatId}
          minimized={chat.minimized}
          onClose={() => closeChat(chat.chatId)}
          onToggleMinimize={() => toggleMinimize(chat.chatId)}
        />
      ))}
    </div>
  );
}
