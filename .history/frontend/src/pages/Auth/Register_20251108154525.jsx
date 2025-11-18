import React, { useState } from "react";
import { registerUser } from "../../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      await registerUser(form);
      alert("Registration successful! Please verify your email.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <form
        className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-full max-w-sm"
        onSubmit={handleRegister}
      >
        <h2 className="text-xl font-bold mb-4 text-center">Register</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <input
          placeholder="First Name"
          value={form.firstName}
          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <input
          placeholder="Last Name"
          value={form.lastName}
          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <input
          placeholder="Phone Number"
          value={form.phoneNumber}
          onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <input
          placeholder="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          className="border p-2 rounded w-full mb-2"
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 text-center">
          Already have an account?{" "}
          <Link className="text-blue-500 hover:underline" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
