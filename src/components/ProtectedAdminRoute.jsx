// src/components/ProtectedAdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Protect admin routes.
 * Expects:
 *  - localStorage.admin_token    (JWT string)
 *  - localStorage.admin_expiry   (timestamp in ms)
 */
export default function ProtectedAdminRoute({ children }) {
  try {
    const token = localStorage.getItem("admin_token");
    const expiry = parseInt(localStorage.getItem("admin_expiry"), 10);

    // No token -> redirect
    if (!token) {
      return <Navigate to="/login" replace />;
    }

    // Expired -> cleanup and redirect
    if (expiry && Date.now() > expiry) {
      localStorage.removeItem("admin_token");
      localStorage.removeItem("admin_expiry");
      localStorage.removeItem("admin_info");
      return <Navigate to="/login" replace />;
    }

    // ⭐ Auto-extend session by 5 hours (sliding expiry)
    const newExpiry = Date.now() + 5 * 60 * 60 * 1000;
    localStorage.setItem("admin_expiry", newExpiry);

    // Valid → allow access
    return children;
  } catch (err) {
    // Safe fallback
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_expiry");
    localStorage.removeItem("admin_info");
    return <Navigate to="/login" replace />;
  }
}
