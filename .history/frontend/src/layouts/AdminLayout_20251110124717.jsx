// Admin Layout (frontend/src/layouts/AdminLayout.jsx)
// -----------------------------
import React from "react";


export function AdminLayout({ children }) {
    return (
        <div className="min-h-screen bg-slate-50 flex">
            <div className="hidden md:block">
                {/* Sidebar placed by parent route or include AdminSidebar here */}
            </div>
            <main className="flex-1 p-6">{children}</main>
        </div>
    );
}