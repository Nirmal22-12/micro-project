import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * 
 * requireAuth  = true  → must be logged in (any role)
 * adminOnly    = true  → must be admin
 * 
 * If not authenticated → redirects to /login with return path stored in state.
 */
export default function ProtectedRoute({ children, requireAuth = true, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f9fafb" }}>
        <div className="text-center">
          <div className="text-5xl mb-4" style={{ animation: "pulse 1.5s ease-in-out infinite" }}>🩸</div>
          <p className="text-gray-400 text-sm font-medium">Loading HemoLife…</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && user?.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
