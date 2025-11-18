import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
    MessageCircle,
    Search,
    User,
    Shield,
    LogOut,
    Users,
    Bell,
} from "lucide-react";
import api from "../utils/api";

const Dashboard = ({ user }) => {
    const [totalUsers, setTotalUsers] = useState(0);
    const [unreadMessages, setUnreadMessages] = useState(0);

    useEffect(() => {
        // Fetch dashboard stats
        const fetchStats = async () => {
            try {
                const res = await api.get("/users/stats");
                setTotalUsers(res.data.totalUsers || 0);
                setUnreadMessages(res.data.unreadMessages || 0);
            } catch (err) {
                console.error("Error fetching dashboard stats:", err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-green-950 text-gray-800 dark:text-gray-100 p-6">
            {/* Header */}
            <motion.header
                className="mb-10 flex flex-col md:flex-row md:justify-between md:items-center gap-4"
                initial={{ opacity: 0, y: -40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <h1 className="text-4xl font-bold text-green-800 dark:text-green-400">
                    Welcome back, {user?.firstName || "Roomie"} 👋
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                    Find your perfect roommate, manage your chats, and explore profiles.
                </p>
            </motion.header>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <DashboardCard
                    title="Total Users"
                    value={totalUsers}
                    icon={<Users className="w-8 h-8" />}
                    gradient="from-green-400 to-green-600"
                />
                <DashboardCard
                    title="Unread Messages"
                    value={unreadMessages}
                    icon={<Bell className="w-8 h-8" />}
                    gradient="from-green-500 to-emerald-700"
                />
                <DashboardCard
                    title="Your Profile"
                    value={user?.role?.toUpperCase() || "USER"}
                    icon={<User className="w-8 h-8" />}
                    gradient="from-emerald-400 to-teal-600"
                />
            </div>

            {/* Quick Actions */}
            <motion.section
                className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
            >
                <QuickAction
                    to="/chat"
                    icon={<MessageCircle />}
                    title="Chat with Roomies"
                    desc="Connect instantly with your matches and friends."
                    color="bg-green-600 hover:bg-green-700"
                />
                <QuickAction
                    to="/search"
                    icon={<Search />}
                    title="Find Roommates"
                    desc="Discover ideal matches using smart filters."
                    color="bg-emerald-600 hover:bg-emerald-700"
                />
                {user?.role === "admin" || user?.role === "superAdmin" ? (
                    <QuickAction
                        to="/admin"
                        icon={<Shield />}
                        title="Admin Panel"
                        desc="Manage users, moderate reports, and system logs."
                        color="bg-green-800 hover:bg-green-900"
                    />
                ) : null}
            </motion.section>
        </div>
    );
};

// --- Dashboard Card Component ---
const DashboardCard = ({ title, value, icon, gradient }) => (
    <motion.div
        whileHover={{ scale: 1.05 }}
        className={`rounded-2xl p-6 bg-gradient-to-r ${gradient} text-white shadow-lg shadow-green-300/50 dark:shadow-green-900/50`}
    >
        <div className="flex justify-between items-center">
            <div>
                <h3 className="text-sm uppercase tracking-widest">{title}</h3>
                <p className="text-3xl font-bold mt-2">{value}</p>
            </div>
            <div className="p-3 bg-white/20 rounded-full">{icon}</div>
        </div>
    </motion.div>
);

// --- Quick Action Component ---
const QuickAction = ({ to, icon, title, desc, color }) => (
    <motion.div
        whileHover={{ scale: 1.03 }}
        className="rounded-xl overflow-hidden border border-green-200 dark:border-green-800 bg-white dark:bg-gray-900 shadow-md"
    >
        <div className="p-6 flex flex-col justify-between h-full">
            <div>
                <div className="text-green-600 dark:text-green-400 mb-3">{icon}</div>
                <h4 className="text-lg font-bold mb-2">{title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{desc}</p>
            </div>
            <Link
                to={to}
                className={`${color} mt-4 inline-block text-center text-white py-2 px-4 rounded-lg transition-all`}
            >
                Go
            </Link>
        </div>
    </motion.div>
);

export default Dashboard;





/*
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
*/