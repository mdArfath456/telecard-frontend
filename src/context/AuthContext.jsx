import React, { createContext, useContext, useEffect, useState } from "react";
import { authApi, setAccessToken, userApi } from "../api/client";
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("telecard_user")) || null;
    } catch {
      return null;
    }
  });
  const [booting, setBooting] = useState(true);
  const save = (u) => {
    setUser(u);
    if (u) localStorage.setItem("telecard_user", JSON.stringify(u));
    else localStorage.removeItem("telecard_user");
  };
  useEffect(() => {
    let mounted = true;
    const restore = async () => {
      try {
        const r = await userApi.profile();
        if (mounted) save(r.data);
      } catch (e) {
        // The axios client attempts a refresh automatically for expired access tokens.
        // If both access and refresh authentication fail, clear the stale local session.
        if (mounted && e.response?.status === 401) save(null);
      } finally {
        if (mounted) setBooting(false);
      }
    };
    restore();
    return () => {
      mounted = false;
    };
  }, []);
  const login = async (d) => {
    const r = await authApi.login(d);
    setAccessToken(r.data.accessToken);
    save({
      id: r.data.userId,
      name: r.data.name,
      email: r.data.email,
      role: r.data.role,
    });
    return r.data;
  };
  const register = async (d) => {
    const r = await authApi.register(d);
    setAccessToken(r.data.accessToken);
    save({
      id: r.data.userId,
      name: r.data.name,
      email: r.data.email,
      role: r.data.role,
    });
    return r.data;
  };
  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setAccessToken(null);
      save(null);
    }
  };
  return (
    <AuthContext.Provider
      value={{ user, setUser: save, login, register, logout, booting }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);
