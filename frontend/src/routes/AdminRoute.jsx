import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
  const { token, role } = useAuth();

  if (!token) return <Navigate to="/login" />;
  if (role !== "admin") return <Navigate to="/" />;

  return children;
}