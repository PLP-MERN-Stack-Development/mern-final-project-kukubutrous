// src/pages/Dashboard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await API.get("/users/me"); // Assuming your backend has /users/me
                setUser(res.data.user);
            } catch (err) {
                console.error(err);
            }
        };
        fetchUser();
    }, []);

    return (
        <div className="p-8 max-w-3xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-brightGreen mb-6">
                Welcome {user ? `${user.firstName} ${user.lastName}` : "User"}!
            </h1>

            <p className="text-gray-700 mb-6">
                Find your ideal roommate by searching based on location, budget, hobbies, and more.
            </p>

            <button
                onClick={() => navigate("/search")}
                className="bg-brightPink text-white py-3 px-6 rounded hover:bg-pink-600 transition text-lg"
            >
                Search Roommates
            </button>

            {/* Optional: Quick info */}
            {user && (
                <div className="mt-8 text-left border-t pt-4">
                    <h2 className="text-xl font-semibold text-brightGreen mb-2">Your Info:</h2>
                    <p>Email: {user.email}</p>
                    <p>Location: {user.location || "Not set"}</p>
                    <p>Budget: ${user.budgetMin || "-"} - ${user.budgetMax || "-"}</p>
                    <p>Hobbies: {user.hobbies && user.hobbies.length ? user.hobbies.join(", ") : "None"}</p>
                    <p>Room Type: {user.roomType || "Not set"}</p>
                </div>
            )}
        </div>
    );
}
