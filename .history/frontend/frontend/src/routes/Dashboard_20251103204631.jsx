import React, { useEffect, useState } from 'react';
</ul>
</div>
)}


{activeTab==='convos' && (
<div className="bg-white p-6 rounded shadow">Conversations (not fully implemented UI)</div>
)}


{activeTab==='admin' && (me?.role==='admin' || me?.role==='superAdmin') && (
<div className="bg-white p-6 rounded shadow">
<h2 className="text-lg font-semibold mb-4">Manage Users</h2>
<table className="w-full text-left">
<thead><tr><th className="p-2">Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
<tbody>
{users.map(u=> (
<tr key={u.id} className="border-t">
<td className="p-2">{u.firstName} {u.lastName}</td>
<td className="p-2">{u.email}</td>
<td className="p-2">{u.role}</td>
<td className="p-2 space-x-2">
{me?.role==='superAdmin' && (
<select defaultValue={u.role} onChange={e=>changeRole(u.id, e.target.value)} className="border p-1">
<option value="user">user</option>
<option value="admin">admin</option>
<option value="superAdmin">superAdmin</option>
</select>
)}
{(me?.role==='admin' || me?.role==='superAdmin') && (
<button onClick={()=>removeUser(u.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
)}
</td>
</tr>
))}
</tbody>
</table>
</div>
)}
</main>
</div>
</div>
</div>
);
}