// src/pages/Search.jsx
import { useState, useEffect } from "react";
import API from "../utils/api";
import UserCard from "../components/UserCard";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

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

    // Collapsible state
    const [hobbiesOpen, setHobbiesOpen] = useState(false);
    const [gendersOpen, setGendersOpen] = useState(false);

    const hobbyOptions = ["Reading", "Sports", "Music", "Gaming", "Traveling"];
    const genderOptions = ["Male", "Female", "Other"];

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "hobbies" || name === "genders") {
            setQuery((prev) => {
                const newArr = checked
                    ? [...prev[name], value]
                    : prev[name].filter((v) => v !== value);
                return { ...prev, [name]: newArr };
            });
        } else {
            setQuery({ ...query, [name]: value });
        }
    };

    const handleSearch = async (searchQuery) => {
        setLoading(true);
        setError("");
        try {
            const filteredQuery = Object.fromEntries(
                Object.entries(searchQuery).filter(
                    ([_, value]) =>
                        (Array.isArray(value) && value.length > 0) ||
                        (!Array.isArray(value) && value !== "")
                )
            );

            const res = await API.get("/users", { params: filteredQuery });
            setResults(res.data.users || []);
        } catch (err) {
            console.error(err);
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Live search with debounce
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            handleSearch(query);
        }, 500);

        return () => clearTimeout(delayDebounce);
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
        setHobbiesOpen(false);
        setGendersOpen(false);
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-brightGreen mb-4">Search Roommates</h1>

            <form className="space-y-4 mb-6">
                <input
                    name="location"
                    type="text"
                    placeholder="Location"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-brightGreen"
                    onChange={handleChange}
                    value={query.location}
                />

                <input
                    name="roomType"
                    type="text"
                    placeholder="Room Type"
                    className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-brightGreen"
                    onChange={handleChange}
                    value={query.roomType}
                />

                {/* Hobbies Collapsible */}
                <div className="border rounded p-3">
                    <button
                        type="button"
                        className="flex items-center justify-between w-full font-semibold text-gray-700 mb-2 focus:outline-none"
                        onClick={() => setHobbiesOpen(!hobbiesOpen)}
                    >
                        Hobbies
                        {hobbiesOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {hobbiesOpen && (
                        <div className="flex flex-wrap gap-4">
                            {hobbyOptions.map((hobby) => (
                                <label key={hobby} className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        name="hobbies"
                                        value={hobby}
                                        checked={query.hobbies.includes(hobby)}
                                        onChange={handleChange}
                                        className="accent-brightGreen"
                                    />
                                    {hobby}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4">
                    <input
                        name="budgetMin"
                        type="number"
                        placeholder="Min Budget"
                        className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-brightGreen"
                        onChange={handleChange}
                        value={query.budgetMin}
                    />
                    <input
                        name="budgetMax"
                        type="number"
                        placeholder="Max Budget"
                        className="w-1/2 p-3 border rounded focus:outline-none focus:ring-2 focus:ring-brightGreen"
                        onChange={handleChange}
                        value={query.budgetMax}
                    />
                </div>

                {/* Gender Collapsible */}
                <div className="border rounded p-3">
                    <button
                        type="button"
                        className="flex items-center justify-between w-full font-semibold text-gray-700 mb-2 focus:outline-none"
                        onClick={() => setGendersOpen(!gendersOpen)}
                    >
                        Preferred Gender
                        {gendersOpen ? <FaChevronUp /> : <FaChevronDown />}
                    </button>
                    {gendersOpen && (
                        <div className="flex flex-wrap gap-4">
                            {genderOptions.map((gender) => (
                                <label key={gender} className="flex items-center gap-1">
                                    <input
                                        type="checkbox"
                                        name="genders"
                                        value={gender}
                                        checked={query.genders.includes(gender)}
                                        onChange={handleChange}
                                        className="accent-brightPink"
                                    />
                                    {gender}
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="button"
                        onClick={handleReset}
                        className="w-1/2 bg-gray-300 text-gray-700 py-3 rounded hover:bg-gray-400 transition"
                    >
                        Reset Filters
                    </button>
                    <button
                        type="button"
                        onClick={() => handleSearch(query)}
                        className="w-1/2 bg-brightPink text-white py-3 rounded hover:bg-pink-600 transition"
                    >
                        Search
                    </button>
                </div>
            </form>

            {loading && <p className="text-center text-gray-500 mb-4">Searching...</p>}
            {error && <p className="text-center text-red-500 mb-4">{error}</p>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.length > 0 ? (
                    results.map((user) => <UserCard key={user.id} user={user} />)
                ) : (
                    !loading && <p className="col-span-full text-center text-gray-500">No results found</p>
                )}
            </div>
        </div>
    );
}
