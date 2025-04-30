// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function ProtectedRoute({ children }) {
  const isAdmin = Cookies.get("adminLoggedIn") === "true";
  return isAdmin ? children : <Navigate to="/admin-login" replace />;
}
