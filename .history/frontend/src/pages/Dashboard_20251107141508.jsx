// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import API from "../utils/api";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/users/me")
      .then(res => setUser(res.data.user))
      .catch(err => console.error(err));
  }, []);

  if (!user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-brightGreen mb-4">Welcome, {user.firstName}!</h1>
      <p className="mb-4">Role: <span className="font-semibold">{user.role}</span></p>
      <p className="mb-4">Location: {user.location || 'N/A'}</p>
      <p className="mb-4">Room Type: {user.roomType || 'N/A'}</p>
      <p className="mb-4">Budget: {user.budgetMin || 0} - {user.budgetMax || 0}</p>
      <p className="mb-4">Hobbies: {user.hobbies || 'N/A'}</p>
      <Link
        to="/profile"
        className="inline-block mt-4 px-6 py-2 rounded bg-brightPink text-white hover:bg-pink-600 transition"
      >
        Edit Profile
      </Link>
    </div>
  );
}
