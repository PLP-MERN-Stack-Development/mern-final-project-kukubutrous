import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-brightGreen text-white p-4 flex justify-between items-center">
            <Link to="/" className="text-xl font-bold">Roommate Finder</Link>
            <div className="space-x-4">
                <Link to="/search" className="hover:text-brightPink">Search</Link>
                <Link to="/chat" className="hover:text-brightPink">Chat</Link>
                <Link to="/profile" className="hover:text-brightPink">Profile</Link>
                <button onClick={logout} className="bg-brightPink px-3 py-1 rounded hover:bg-pink-600">Logout</button>
            </div>
        </nav>
    );
}
