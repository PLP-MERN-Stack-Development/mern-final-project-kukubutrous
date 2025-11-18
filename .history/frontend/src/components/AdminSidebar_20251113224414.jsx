//frontend/src/
import React from "react";
import { Link, NavLink } from "react-router-dom";


export function AdminSidebar() {
    const active = "bg-sky-100 text-sky-700 rounded px-3 py-2";
    const inactive = "text-slate-700 px-3 py-2 hover:bg-slate-50 rounded";


    return (
        <aside className="w-64 bg-white border-r h-screen p-4 sticky top-0">
            <div className="mb-6">
                <Link to="/admin" className="text-xl font-bold">Admin Panel</Link>
            </div>


            <nav className="space-y-2">
                <NavLink end to="/admin" className={({ isActive }) => isActive ? active : inactive}>
                    Dashboard
                </NavLink>
                <NavLink to="/admin/manage-roles" className={({ isActive }) => isActive ? active : inactive}>
                    Manage Roles
                </NavLink>
                <NavLink to="/admin/users" className={({ isActive }) => isActive ? active : inactive}>
                    Users
                </NavLink>
            </nav>
        </aside>
    );
}