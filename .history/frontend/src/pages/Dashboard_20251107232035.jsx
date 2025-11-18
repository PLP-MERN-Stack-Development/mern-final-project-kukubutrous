// frontend/src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Dashboard() {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-pink-50 p-6">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">
                <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-500 to-pink-500 bg-clip-text text-transparent">
                    Welcome, {user?.firstName || "User"} 🌸
                </h1>

                <div className="space-y-4 text-gray-700">
                    <p>
                        <span className="font-semibold text-green-600">Full Name:</span>{" "}
                        {user?.firstName} {user?.lastName}
                    </p>
                    <p>
                        <span className="font-semibold text-pink-600">Email:</span>{" "}
                        {user?.email}
                    </p>
                    <p>
                        <span className="font-semibold text-green-600">Phone Number:</span>{" "}
                        {user?.phoneNumber || "Not set"}
                    </p>
                    <p>
                        <span className="font-semibold text-pink-600">Location:</span>{" "}
                        {user?.location || "Not set"}
                    </p>
                    <p>
                        <span className="font-semibold text-green-600">
                            Preferred Room Type:
                        </span>{" "}
                        {user?.roomType || "Not set"}
                    </p>
                    <p>
                        <span className="font-semibold text-pink-600">Budget Range:</span>{" "}
                        {user?.budgetRange || "Not set"}
                    </p>
                    <p>
                        <span className="font-semibold text-green-600">Hobbies:</span>{" "}
                        {user?.hobbies || "Not specified"}
                    </p>
                    <p>
                        <span className="font-semibold text-pink-600">
                            Preferred Gender:
                        </span>{" "}
                        {user?.preferredGender || "Not specified"}
                    </p>
                </div>

                <div className="mt-8 flex justify-center gap-4">
                    <Link
                        to="/search"
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition"
                    >
                        Find Roommates
                    </Link>
                    <Link
                        to="/chat"
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full transition"
                    >
                        Go to Chat
                    </Link>
                </div>
            </div>
        </div>
    );
}
