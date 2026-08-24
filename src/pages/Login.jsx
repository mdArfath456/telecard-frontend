import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../utils/helpers";
import Icon from "../components/Icon";
export default function Login() {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const u = await login({ email, password });
      nav(u.role === "ADMIN" ? "/admin" : loc.state?.from || "/cards", {
        replace: true,
      });
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-intro">
          <span className="brand-mark">
            <Icon name="credit" size={24} />
          </span>
          <span className="eyebrow">Welcome back</span>
          <h1>Sign in to TeleCard.</h1>
          <p>Manage your cards, orders and secure payments from one place.</p>
        </div>
        <form onSubmit={submit} className="form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </label>
          {error && <div className="form-error">{error}</div>}
          <button className="primary-btn full" disabled={busy}>
            {busy ? "Signing in…" : "Sign in"}
            <Icon name="arrow" size={17} />
          </button>
        </form>
        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one</Link>
        </p>
      </div>
    </div>
  );
}
