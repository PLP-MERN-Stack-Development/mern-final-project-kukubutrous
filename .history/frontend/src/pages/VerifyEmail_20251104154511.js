// src/pages/VerifyEmail.js
import React, { useEffect, useState } from "react";
import api from "../api";
import { useLocation, Link } from "react-router-dom";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function VerifyEmail() {
  const q = useQuery();
  const token = q.get("token");
  const [msg, setMsg] = useState("Verifying...");

  useEffect(() => {
    if (!token) return setMsg("No token provided");
    api.get(`/auth/verify?token=${encodeURIComponent(token)}`)
      .then(res => setMsg(res.data.message || "Email verified"))
      .catch(() => setMsg("Invalid or expired verification link"));
  }, [token]);

  return (
    <div className="page center">
      <div className="card">
        <h3>Email verification</h3>
        <p>{msg}</p>
        <p className="muted"><Link to="/login">Go to login</Link></p>
      </div>
    </div>
  );
}
