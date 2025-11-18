import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Search from "./pages/Search";
import Chat from "./pages/Chat";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
    return (
        <Router>
            <Navbar />
            <div className="p-4 min-h-screen bg-gray-100">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                    <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                    <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
                    <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
