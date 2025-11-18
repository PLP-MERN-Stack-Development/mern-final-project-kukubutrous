// src/pages/Search.jsx
import { useState, useEffect } from "react";
import API from "../utils/api";
import UserCard from "../components/UserCard";
import ChatWindow from "../components/ChatWindow";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Search() {
    const [query, setQuery] = useState({
        location: "",
        roomType: "",
        hobbies: [],
        budgetMin: "",
        budgetMax: "",
        genders: [],
    });

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [hobbiesOpen, setHobbiesOpen] = useState(false);
    const [gendersOpen, setGendersOpen] = useState(false);

    // ✅ Multi Chat Manager
    const [openChats, setOpenChats] = useState([]);

    const hobbyOptions = ["Reading", "Sports", "Music", "Gaming", "Traveling"];
    const genderOptions = ["Male", "Female", "Other"];

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "hobbies" || name === "genders") {
            setQuery((prev) => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], value]
                    : prev[name].filter((v) => v !== value),
            }));
        } else {
            setQuery((prev) => ({ ...prev, [name]: value }));
        }
    };

    // ✅ Live Search (Debounced)
    const handleSearch = async (searchQuery) => {
        setLoading(true);
        setError("");

        try {
            const finalQuery = Object.fromEntries(
                Object.entries(searchQuery).filter(
                    ([_, value]) =>
                        (Array.isArray(value) && value.length > 0) ||
                        (!Array.isArray(value) && value.trim() !== "")
                )
            );

            const res = await API.get("/users", { params: finalQuery });
            setResults(res.data.users || []);
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => handleSearch(query), 350);
        return () => clearTimeout(timer);
    }, [query]);

    const handleReset = () => {
        setQuery({
            location: "",
            roomType: "",
            hobbies: [],
            budgetMin: "",
            budgetMax: "",
            genders: [],
        });
        setResults([]);
        setError("");
    };

    // ✅ Open chat window
    const handleOpenChat = (user) => {
        setOpenChats((prev) => {
            const existing = prev.find((c) => c.user.id === user.id);
            if (existing)
                return prev.map((c) =>
                    c.user.id === user.id ? { ...c, minimized: false } : c
                );

            return [...prev, { user, minimized: false }];
        });
    };

    const handleToggleMinimize = (userId) => {
        setOpenChats((prev) =>
            prev.map((c) =>
                c.user.id === userId ? { ...c, minimized: !c.minimized } : c
            )
        );
    };

    const handleCloseChat = (userId) => {
        setOpenChats((prev) => prev.filter((c) => c.user.id !== userId));
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-brightGreen mb-6">
                🔍 Find Your Perfect Roommate
            </h1>

            {/* ✅ Search */}
            <form className="space-y-4 mb-6">
                <input
                    name="location"
                    type="text"
                    placeholder="Location"
                    className="w-full input"
                    onChange={handleChange}
                    value={query.location}
                />

                <input
                    name="roomType"
                    type="text"
                    placeholder="Room Type"
                    className="w-full input"
                    onChange={handleChange}
                    value={query.roomType}
                />

                {/* ✅ Hobbies */}
                <div className="box">
                    <button
                        type="button"
                        onClick={() => setHobbiesOpen(!hobbiesOpen)}
                        className="collapse-btn"
                    >
                        Hobbies {hobbiesOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {hobbiesOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex flex-wrap gap-3 mt-2"
                        >
                            {hobbyOptions.map((hobby) => (
                                <label key={hobby} className="option">
                                    <input
                                        type="checkbox"
                                        name="hobbies"
                                        value={hobby}
                                        checked={query.hobbies.includes(hobby)}
                                        onChange={handleChange}
                                    />
                                    {hobby}
                                </label>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* ✅ Budget */}
                <div className="flex gap-4">
                    <input
                        name="budgetMin"
                        type="number"
                        placeholder="Min Budget"
                        className="w-1/2 input"
                        onChange={handleChange}
                        value={query.budgetMin}
                    />

                    <input
                        name="budgetMax"
                        type="number"
                        placeholder="Max Budget"
                        className="w-1/2 input"
                        onChange={handleChange}
                        value={query.budgetMax}
                    />
                </div>

                {/* ✅ Gender */}
                <div className="box">
                    <button
                        type="button"
                        onClick={() => setGendersOpen(!gendersOpen)}
                        className="collapse-btn"
                    >
                        Preferred Gender{" "}
                        {gendersOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>

                    {gendersOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            className="flex flex-wrap gap-3 mt-2"
                        >
                            {genderOptions.map((gender) => (
                                <label key={gender} className="option">
                                    <input
                                        type="checkbox"
                                        name="genders"
                                        value={gender}
                                        checked={query.genders.includes(gender)}
                                        onChange={handleChange}
                                    />
                                    {gender}
                                </label>
                            ))}
                        </motion.div>
                    )}
                </div>

                {/* ✅ Buttons */}
                <div className="flex gap-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="btn-gray"
                    >
                        Reset Filters
                    </button>

                    <button
                        type="button"
                        onClick={() => handleSearch(query)}
                        className="btn-pink"
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* ✅ Results */}
            {loading && <p className="loading">Searching...</p>}
            {error && <p className="error">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.length > 0 ? (
                    results.map((user) => (
                        <UserCard
                            key={user.id}
                            user={user}
                            onClick={() => handleOpenChat(user)}
                        />
                    ))
                ) : (
                    !loading && (
                        <p className="text-center text-gray-500 col-span-full">
                            No results found
                        </p>
                    )
                )}
            </div>

            {/* ✅ Draggable Chat Windows */}
            <div className="fixed bottom-0 right-0 flex flex-col items-end gap-2 p-4 z-50">
                {openChats
                    .filter((c) => c.minimized)
                    .map((c) => (
                        <div
                            key={c.user.id}
                            className="minimized-chat"
                            onClick={() => handleToggleMinimize(c.user.id)}
                        >
                            {c.user.firstName} {c.user.lastName}
                        </div>
                    ))}

                {openChats
                    .filter((c) => !c.minimized)
                    .map((c) => (
                        <ChatWindow
                            key={c.user.id}
                            user={c.user}
                            onClose={() => handleCloseChat(c.user.id)}
                            onMinimize={() => handleToggleMinimize(c.user.id)}
                        />
                    ))}
            </div>
        </div>
    );
}
