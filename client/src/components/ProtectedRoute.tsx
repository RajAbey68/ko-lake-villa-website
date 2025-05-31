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
    // Only redirect if authentication check is complete
    if (!isLoading) {
      if (!currentUser) {
        // Store the attempted URL for redirection after login
        sessionStorage.setItem('redirectAfterLogin', location);
        // Redirect to login
        window.location.href = '/admin/login';
        return;
      }
      
      if (requireAdmin && !isAdmin) {
        // User is authenticated but not admin - show error instead of redirect loop
        console.warn('User authenticated but not admin:', currentUser?.email);
        // Don't redirect, let the error state show
        return;
      }
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