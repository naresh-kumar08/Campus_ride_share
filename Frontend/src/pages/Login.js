import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const loggedIn = await login(form);
      const defaultRedirect = loggedIn?.role === "admin" ? "/admin" : "/dashboard";
      const redirect = location.state?.from?.pathname || defaultRedirect;
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Unable to login");
    }
  };

  return (
    <main className="container form-page">
      <section className="card supporting-panel">
        <p className="eyebrow">Welcome back</p>
        <h1 className="page-title">Sign-In To Continue</h1>
        {/* <p className="section-subtitle">
          Access your personalised dashboard, view bookings and manage rider complaints with a single secure login.
        </p> */}
        <ul className="list-clean">
            {/* <li>Protected routes powered by JWT</li> */}
          {/* <li>Admin console monitored 24*7</li> */}
          {/* <li>One tap access to your ride history</li> */}
        </ul>
      </section>

      <form className="card form-panel grid" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
        </label>
        {error && <p className="text-error">{error}</p>}
        <button className="btn" disabled={loading}>
          {loading ? "Signing in..." : "Login"}
        </button>
        <div className="form-links">
          <Link to="/reset-password">Reset Password?</Link>
          <Link to="/register">Sign-Up?</Link>
        </div>
      </form>
    </main>
  );
};

export default Login;


