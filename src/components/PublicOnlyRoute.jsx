import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
export default function PublicOnlyRoute({ children }) {
  const { user, booting } = useAuth();
  const loc = useLocation();
  if (booting)
    return (
      <div className="screen-loader">
        <div className="spinner" />
        <span>Loading TeleCard…</span>
      </div>
    );
  if (user) {
    const destination =
      user.role === "ADMIN" ? "/admin" : loc.state?.from || "/cards";
    return <Navigate to={destination} replace />;
  }
  return children;
}
