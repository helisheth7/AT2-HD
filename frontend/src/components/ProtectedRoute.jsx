import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { token, role } = useAuth();

  // not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // role restriction (if provided)
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}