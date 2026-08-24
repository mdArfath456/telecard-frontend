import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import { initials } from "../utils/helpers";
const links = [
  ["/admin", "Overview", "grid"],
  ["/admin/cards", "Cards", "credit"],
  ["/admin/categories", "Categories", "grid"],
  ["/admin/orders", "Orders", "box"],
  ["/admin/payments", "Payments", "credit"],
  ["/admin/users", "Users", "user"],
];
export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="admin-shell">
      <aside className={`sidebar ${open ? "open" : ""}`}>
        <div className="brand side-brand">
          <span className="brand-mark">
            <Icon name="credit" size={22} />
          </span>
          <span>
            Tele<span>Card</span>
          </span>
        </div>
        <div className="admin-profile">
          <div className="avatar large">{initials(user?.name)}</div>
          <div>
            <strong>{user?.name}</strong>
            <small>Administrator</small>
          </div>
        </div>
        <div className="side-label">Workspace</div>
        <nav>
          {links.map(([to, label, icon]) => (
            <NavLink
              key={to}
              end={to === "/admin"}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? "active" : "")}
              to={to}
            >
              <Icon name={icon} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          className="logout-side"
          onClick={async () => {
            await logout();
            nav("/");
          }}
        >
          <Icon name="logout" /> Sign out
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <button className="menu-btn" onClick={() => setOpen(!open)}>
            <Icon name="menu" />
          </button>
          <div>
            <strong>Admin Console</strong>
            <span>Manage your TeleCard marketplace</span>
          </div>
          <div className="admin-top-user">
            <span>{user?.email}</span>
            <div className="avatar">{initials(user?.name)}</div>
          </div>
        </header>
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}
