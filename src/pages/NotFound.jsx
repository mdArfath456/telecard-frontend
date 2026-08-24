import React from "react";
import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="empty full-screen">
      <h1>404</h1>
      <h3>Page not found</h3>
      <Link className="primary-btn" to="/">
        Go home
      </Link>
    </div>
  );
}
