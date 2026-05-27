import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const auth = useAuth();

  const token = auth?.token || localStorage.getItem("token");

  if (!token) return <Navigate to="/login" replace />;

  return children;
}