import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GuestLayout() {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" />;
  return <div style={{ background: '#0a0a0a', minHeight: '100vh' }}><Outlet /></div>;
}
