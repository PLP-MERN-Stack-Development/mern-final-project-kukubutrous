




/
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/api";
import { AuthContext } from "../App";

export default function Login() {
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [err, setErr] = useState(null);
    const navigate = useNavigate();

    async function handle(e) {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            setUser(res.data.user);
            navigate("/dashboard");
        } catch (error) {
            setErr(error?.response?.data?.message || "Login failed");
        }
    }

    return (
        <div className="max-w-md mx-auto card">
            <h2 className="text-2xl font-bold mb-4">Sign in</h2>
            {err && <div className="text-sm text-red-600 mb-2">{err}</div>}
            <form onSubmit={handle} className="space-y-3">
                <input className="w-full px-4 py-2 border rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                <input className="w-full px-4 py-2 border rounded" placeholder="Password" value={password} type="password" onChange={e => setPassword(e.target.value)} />
                <button className="btn-brand w-full">Login</button>
            </form>
            <div className="mt-3 flex justify-between text-sm">
                <Link to="/register" className="text-brand-600">Register</Link>
                <Link to="/forgot-password" className="text-gray-600">Forgot?</Link>
            </div>
        </div>
    );
}
*/