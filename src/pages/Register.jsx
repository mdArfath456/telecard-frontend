import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../utils/helpers";
import Icon from "../components/Icon";
export default function Register() {
  const [f, setF] = useState({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    }),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const { register } = useAuth();
  const nav = useNavigate();
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (f.password !== f.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setBusy(true);
    try {
      await register(f);
      nav("/cards", { replace: true });
    } catch (e) {
      setError(apiError(e));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="auth-page">
      <div className="auth-card wide">
        <div className="auth-intro">
          <span className="brand-mark">
            <Icon name="credit" size={24} />
          </span>
          <span className="eyebrow">Start your journey</span>
          <h1>Create your TeleCard account.</h1>
          <p>Save cards, manage orders and track secure payment reviews.</p>
        </div>
        <form onSubmit={submit} className="form two">
          <label>
            Full name
            <input value={f.name} onChange={set("name")} required />
          </label>
          <label>
            Phone
            <input value={f.phone} onChange={set("phone")} required />
          </label>
          <label>
            Email
            <input
              type="email"
              value={f.email}
              onChange={set("email")}
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={f.password}
              onChange={set("password")}
              minLength="8"
              required
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={f.confirmPassword}
              onChange={set("confirmPassword")}
              minLength="8"
              required
            />
          </label>
          <div></div>
          {error && <div className="form-error span-2">{error}</div>}
          <button className="primary-btn full span-2" disabled={busy}>
            {busy ? "Creating account…" : "Create account"}
            <Icon name="arrow" size={17} />
          </button>
        </form>
        <p className="auth-switch">
          Already registered? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
