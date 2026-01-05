import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, permission }) => {
  const { permissions, loading } = useAuth();

  if (loading) return null;

  const allowed =
    permissions.includes("*") ||
    (permission && permissions.includes(permission));

  if (!allowed) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;
