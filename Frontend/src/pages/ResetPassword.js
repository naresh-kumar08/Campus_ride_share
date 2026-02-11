import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", code: "", password: "", confirmPassword: "" });
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const sendCode = async () => {
    setStatus("");
    if (!form.email) {
      setStatus("Please enter your email first.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/auth/forgot-password", { email: form.email });
      setStatus("Code sent to your email. Check your inbox or spam.");
      setCodeSent(true);
    } catch (err) {
      setStatus(err.response?.data?.message || "Unable to send reset code");
    } finally {
      setSubmitting(false);
    }
  };

  const submitReset = async (e) => {
    e.preventDefault();
    setStatus("");
    if (!codeSent) {
      await sendCode();
      return;
    }
    if (!form.code || !form.password || !form.confirmPassword) {
      setStatus("Please fill in the code and both password fields.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setStatus("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/auth/reset-password", {
        email: form.email,
        code: form.code,
        password: form.password,
      });
      setStatus("Password updated. Redirecting to login...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setStatus(err.response?.data?.message || "Unable to reset password");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container form-page">
      <section className="card supporting-panel">
        <p className="eyebrow">Account Recovery</p>
        <h1 className="page-title">Reset your Password</h1>
        {/* <p className="section-subtitle">
          We will send a secure OTP to your inbox. Validate it and set a new password in under a minute.
        </p>
        <ul className="list-clean">
          <li>OTP expires in 10 minutes</li>
          <li>Reuse of old passwords is blocked</li>
          <li>For assistance reach the helpline</li>
        </ul> */}
      </section>

      <form className="card form-panel grid" onSubmit={submitReset}>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>

        {!codeSent && (
          <button type="button" className="btn" onClick={sendCode} disabled={submitting}>
            {submitting ? "Sending..." : "Send OTP"}
          </button>
        )}

        {codeSent && (
          <>
            <label>
              Reset code
              <input name="code" value={form.code} onChange={handleChange} required />
            </label>
            <label>
              New password
              <input type="password" name="password" value={form.password} onChange={handleChange} required />
            </label>
            <label>
              Confirm password
              <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} required />
            </label>
            <button className="btn" disabled={submitting}>
              {submitting ? "Updating..." : "Change password"}
            </button>
          </>
        )}

        {status && <small>{status}</small>}
        <Link to="/login">Back to Login</Link>
      </form>
    </main>
  );
};

export default ResetPassword;

