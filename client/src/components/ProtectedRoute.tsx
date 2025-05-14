import { useEffect } from 'react';
import { useLocation, useRoute } from 'wouter';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from './ui/spinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ children, requireAdmin = true }: ProtectedRouteProps) {
  const { currentUser, isLoading, isAdmin } = useAuth();
  const [location] = useLocation();

  useEffect(() => {
    // If not loading and either not authenticated or not admin (when required)
    if (!isLoading && (!currentUser || (requireAdmin && !isAdmin))) {
      // Store the attempted URL for redirection after login
      sessionStorage.setItem('redirectAfterLogin', location);
      // Redirect to login
      window.location.href = '/admin/login';
    }
  }, [currentUser, isLoading, isAdmin, requireAdmin, location]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  // If authenticated (and admin if required), render children
  if (currentUser && (!requireAdmin || isAdmin)) {
    return <>{children}</>;
  }

  // This should not be visible because of the redirect, but as a fallback
  return null;
}