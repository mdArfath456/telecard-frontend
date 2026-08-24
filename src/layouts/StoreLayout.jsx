import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Icon from "../components/Icon";
import { initials } from "../utils/helpers";
export default function StoreLayout({ children }) {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  return (
    <div className="store-shell">
      <header className="topbar">
        <Link className="brand" to="/">
          <span className="brand-mark">
            <Icon name="credit" size={22} />
          </span>
          <span>
            Tele<span>Card</span>
          </span>
        </Link>
        <nav className="main-nav">
          <NavLink to="/cards">Cards</NavLink>
          <NavLink to="/orders">Orders</NavLink>
        </nav>
        <div className="top-actions">
          {user ? (
            <>
              <Link className="icon-btn" to="/cart" aria-label="Cart">
                <Icon name="cart" />
                <span className="cart-dot" />
              </Link>
              <Link
                className="avatar"
                to={user.role === "ADMIN" ? "/admin" : "/profile"}
              >
                {initials(user.name)}
              </Link>
              <button
                className="ghost-btn"
                onClick={async () => {
                  await logout();
                  nav("/");
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="ghost-btn" to="/login">
                Sign in
              </Link>
              <Link className="primary-btn small" to="/register">
                Get started
              </Link>
            </>
          )}
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div>
          <div className="brand">
            <span className="brand-mark">
              <Icon name="credit" size={18} />
            </span>
            <span>
              Tele<span>Card</span>
            </span>
          </div>
          <p>Premium cards, transparent choices, simple checkout.</p>
        </div>
        <span>© 2026 TeleCard</span>
      </footer>
    </div>
  );
}
