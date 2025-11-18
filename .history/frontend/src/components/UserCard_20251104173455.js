import React from 'react'
import { Link } from 'react-router-dom'


export default function UserCard({ user }) {
    return (
        <div className="bg-white p-4 rounded shadow">
            <div className="font-semibold">{user.firstName} {user.lastName}</div>
            <div className="text-sm">{user.location}</div>
            <div className="text-sm">Budget: {user.budgetMin}-{user.budgetMax}</div>
            <Link to={`/conversations/${user.id}`} className="text-indigo-600 text-sm">Message</Link>
        </div>
    )
}