import { Navigate } from "react-router-dom";
import { useUser } from "@/contexts/UserContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: 'student' | 'staff' | 'any';
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole !== 'any' && user.role !== requiredRole) {
    return <Navigate to={`/dashboard/${user.role}`} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
