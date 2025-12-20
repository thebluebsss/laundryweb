import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  // Log for debugging
  console.log(
    "ProtectedRoute - Token:",
    !!token,
    "Role:",
    userRole,
    "Required:",
    requiredRole
  );

  // If no token, redirect to login
  if (!token || !userRole) {
    console.log("No token/role - redirecting to login");
    return <Navigate to="/" replace />;
  }

  // Check if user has required role
  if (requiredRole) {
    // If requiredRole is an array, check if userRole is in the array
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        console.log("Role not in array - redirecting");
        // Redirect to appropriate page based on role
        return (
          <Navigate to={userRole === "admin" ? "/admin" : "/home"} replace />
        );
      }
    } else {
      // If requiredRole is a string, check exact match
      if (userRole !== requiredRole) {
        console.log("Role mismatch - redirecting");
        // Redirect to appropriate page based on role
        return (
          <Navigate to={userRole === "admin" ? "/admin" : "/home"} replace />
        );
      }
    }
  }

  console.log("Access granted");
  return children;
}
