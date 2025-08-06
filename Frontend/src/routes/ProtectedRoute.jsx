import { Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function ProtectedRoute({ children }) {
  const user = useAuthStore((state) => state.user);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const loading = useAuthStore((state) => state.loading);

  useEffect(() => {
    fetchUser();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
