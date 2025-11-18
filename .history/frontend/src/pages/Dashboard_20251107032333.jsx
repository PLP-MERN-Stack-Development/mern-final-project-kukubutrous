import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../App";
import api from "../utils/api";
import UserCard from "../components/UserCard";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get("/users");
        setUsers(res.data.users);
      } catch (err) {
        console.error(err);
      }
    }
    load();
  }, []);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-600">Welcome, {user?.firstName}</div>
      </div>

      <div className="grid gap-4">
        {users.map(u => (<UserCard key={u.id} user={u} />))}
      </div>
    </div>
  );
}
