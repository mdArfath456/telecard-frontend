import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function ProtectedRoute({ children, role }) {
  const { user, booting } = useAuth();
  const loc = useLocation();
  if (booting)
    return (
      <div className="screen-loader">
        <div className="spinner" />
        <span>Loading TeleCard…</span>
      </div>
    );
  if (!user)
    return <Navigate to="/login" state={{ from: loc.pathname }} replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === "ADMIN" ? "/admin" : "/"} replace />;
  }
  return children;
}
