import React from 'react'
import { useAuth } from '../../context/AuthContext'


export default function Dashboard(){
const { user } = useAuth()
return (
<div className="max-w-4xl mx-auto">
<h1 className="text-2xl font-bold">Welcome, {user.firstName}</h1>
<p className="mt-2">Role: {user.role}</p>
</div>
)
}




/*
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import api from "../api";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user, logout } = useContext(AuthContext);
    const [profiles, setProfiles] = useState([]);

    useEffect(() => {
        api.get("/users").then(res => setProfiles(res.data)).catch(console.error);
    }, []);

    return (
        <div className="container mt-4">
            <h3>Welcome, {user?.firstName}</h3>
            <button onClick={logout} className="btn btn-outline-danger mb-3 float-end">Logout</button>

            {user?.role === "admin" || user?.role === "superAdmin" ? (
                <>
                    <h4>Admin Panel</h4>
                    <table className="table table-striped">
                        <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
                        <tbody>
                            {profiles.map(u => (
                                <tr key={u.id}>
                                    <td>{u.firstName} {u.lastName}</td>
                                    <td>{u.email}</td>
                                    <td>{u.role}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            ) : (
                <>
                    <h4>Your Dashboard</h4>
                    <p><Link to={`/chat/${user.id}`} className="btn btn-success">Chat with Roommates</Link></p>
                </>
            )}
        </div>
    );
}
*/