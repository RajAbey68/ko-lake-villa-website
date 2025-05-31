import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading spinner while auth is being determined
  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    window.location.href = "/admin/login";
    return null;
  }

  return <>{children}</>;
}

export default ProtectedRoute;