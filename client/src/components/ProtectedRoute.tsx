import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show loading spinner while auth is being determined
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF6EE]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF914D]"></div>
          <p className="mt-4 text-lg text-[#8B5E3C]">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    window.location.href = "/admin/login";
    return null;
  }

  // Check if user is admin
  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF6EE]">
        <div className="text-center">
          <p className="text-lg text-red-600">Access denied. Admin privileges required.</p>
          <a href="/" className="text-[#FF914D] hover:underline mt-4 inline-block">Return to homepage</a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;