import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const userRole = localStorage.getItem("userRole");

  if (!userRole) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return (
      <Navigate to={userRole === "admin" ? "/admin" : "/booking"} replace />
    );
  }

  return children;
}
