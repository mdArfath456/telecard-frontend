import React, { useEffect, useState } from "react";
import { userApi } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { apiError } from "../utils/helpers";
export default function Profile() {
  const { setUser } = useAuth();
  const [u, setU] = useState(null),
    [f, setF] = useState({ name: "", phone: "" }),
    [pw, setPw] = useState({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }),
    [msg, setMsg] = useState(""),
    [err, setErr] = useState("");
  useEffect(() => {
    let mounted = true;
    const fetchProfile = async () => {
      try {
        const r = await userApi.profile();
        if (mounted) {
          setU(r.data);
          setF({ name: r.data.name, phone: r.data.phone });
        }
      } catch (e) {
        if (mounted) setErr(apiError(e));
      }
    };
    fetchProfile();
    return () => {
      mounted = false;
    };
  }, []);
  const save = async (e) => {
    e.preventDefault();
    try {
      const r = await userApi.update(f);
      setU(r.data);
      setUser(r.data);
      setMsg("Profile updated");
      setErr("");
    } catch (e) {
      setErr(apiError(e));
    }
  };
  const change = async (e) => {
    e.preventDefault();
    try {
      await userApi.password(pw);
      setPw({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setMsg("Password changed");
      setErr("");
    } catch (e) {
      setErr(apiError(e));
    }
  };
  if (!u)
    return (
      <div className="screen-loader">
        <div className="spinner" />
      </div>
    );
  return (
    <div className="page-wrap">
      <div className="page-hero compact">
        <span className="eyebrow">Account settings</span>
        <h1>Your profile</h1>
        <p>Keep your account details and security settings up to date.</p>
      </div>
      {(msg || err) && (
        <div className={err ? "form-error" : "inline-note"}>{err || msg}</div>
      )}
      <div className="profile-grid">
        <form className="checkout-panel form" onSubmit={save}>
          <h2>Personal details</h2>
          <label>
            Name
            <input
              value={f.name}
              onChange={(e) => setF({ ...f, name: e.target.value })}
            />
          </label>
          <label>
            Email
            <input value={u.email} disabled />
          </label>
          <label>
            Phone
            <input
              value={f.phone}
              onChange={(e) => setF({ ...f, phone: e.target.value })}
            />
          </label>
          <button className="primary-btn">Save changes</button>
        </form>
        <form className="checkout-panel form" onSubmit={change}>
          <h2>Change password</h2>
          <label>
            Current password
            <input
              type="password"
              value={pw.currentPassword}
              onChange={(e) =>
                setPw({ ...pw, currentPassword: e.target.value })
              }
            />
          </label>
          <label>
            New password
            <input
              type="password"
              value={pw.newPassword}
              onChange={(e) => setPw({ ...pw, newPassword: e.target.value })}
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={pw.confirmPassword}
              onChange={(e) =>
                setPw({ ...pw, confirmPassword: e.target.value })
              }
            />
          </label>
          <button className="secondary-btn">Update password</button>
        </form>
      </div>
    </div>
  );
}
