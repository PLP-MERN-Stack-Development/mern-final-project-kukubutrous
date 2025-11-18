import React, { useState } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", email: "", password: "" });
    const [msg, setMsg] = useState("");

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async e => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/register", form);
            setMsg(res.data.message || "Check your email for verification link.");
        } catch (err) {
            setMsg(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input className="form-control mb-2" name="firstName" placeholder="First Name" onChange={handleChange} />
                <input className="form-control mb-2" name="lastName" placeholder="Last Name" onChange={handleChange} />
                <input className="form-control mb-2" name="phone" placeholder="Phone Number" onChange={handleChange} />
                <input className="form-control mb-2" name="email" placeholder="Email" type="email" onChange={handleChange} />
                <input className="form-control mb-2" name="password" placeholder="Password" type="password" onChange={handleChange} />
                <button className="btn btn-primary w-100">Register</button>
            </form>
            {msg && <div className="alert alert-info mt-3">{msg}</div>}
            <p className="mt-3">Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}
