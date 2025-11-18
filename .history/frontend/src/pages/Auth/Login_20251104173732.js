import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/dashboard");
        } catch (err) {
            setMsg(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                <input className="form-control mb-2" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                <button className="btn btn-primary w-100">Login</button>
            </form>
            {msg && <div className="alert alert-info mt-3">{msg}</div>}
            <p className="mt-3">No account? <Link to="/register">Register</Link></p>
        </div>
    );
}
