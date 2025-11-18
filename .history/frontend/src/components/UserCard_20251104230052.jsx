import React from 'react';
import { Link } from 'react-router-dom';

export default function UserCard({ u }){
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="font-semibold">{u.firstName} {u.lastName}</div>
      <div className="text-sm">{u.location}</div>
      <div className="text-sm">Budget: {u.budgetMin} - {u.budgetMax}</div>
      <Link to={`/conversations/${u.id}`} className="text-indigo-600 text-sm">Message</Link>
    </div>
  )
}
