import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';

export function withAuth(Component: React.ComponentType) {
  return function AuthWrapper(props: any) {
    const [, setLocation] = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Check authentication status
      const checkAuth = async () => {
        try {
          const response = await fetch('/api/auth/check');
          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            setLocation('/admin/login');
          }
        } catch (error) {
          setLocation('/admin/login');
        } finally {
          setIsLoading(false);
        }
      };

      checkAuth();
    }, [setLocation]);

    if (isLoading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return null; // Will redirect to login
    }

    return <Component {...props} />;
  };
}