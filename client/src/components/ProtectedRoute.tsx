import { useAuth } from '@/contexts/AuthContext';
import { useLocation } from 'wouter';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [location, navigate] = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Development bypass for admin access - remove in production
  const isDevelopment = import.meta.env.DEV;
  
  console.log('ProtectedRoute - Auth state:', { 
    currentUser: !!currentUser, 
    isLoading, 
    isAdmin, 
    mounted, 
    location,
    isDevelopment
  });

  // In development, allow direct admin access for testing
  if (isDevelopment) {
    console.log('ProtectedRoute - Development mode: bypassing auth');
    return <>{children}</>;
  }

  // Show loading spinner while auth is being determined
  if (!mounted || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF6EE]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF914D]"></div>
          <p className="mt-4 text-lg text-[#8B5E3C]">Loading admin panel...</p>
          <p className="mt-2 text-sm text-[#8B5E3C]/70">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser) {
    console.log('ProtectedRoute - Redirecting to login (no user)');
    navigate("/admin/login");
    return null;
  }

  // Check if user is admin
  if (!isAdmin) {
    console.log('ProtectedRoute - Access denied (not admin)');
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDF6EE]">
        <div className="text-center">
          <p className="text-lg text-red-600">Access denied. Admin privileges required.</p>
          <button 
            onClick={() => navigate("/")}
            className="text-[#FF914D] hover:underline mt-4 inline-block"
          >
            Return to homepage
          </button>
        </div>
      </div>
    );
  }

  console.log('ProtectedRoute - Access granted, rendering children');
  return <>{children}</>;
}

export default ProtectedRoute;