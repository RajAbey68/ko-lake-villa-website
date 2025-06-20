import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '../../contexts/AuthContext';
import { signInWithGoogle, signInWithEmail, handleRedirectResult } from '../../lib/firebase';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Spinner } from '../../components/ui/spinner';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { z } from 'zod';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';

export default function AdminLogin() {
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authDomainError, setAuthDomainError] = useState<boolean>(false);
  const { currentUser, isAdmin, setCurrentUser } = useAuth();
  const [location] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState<string>("email"); // Default to email login

  // Check if we're on a Replit domain
  useEffect(() => {
    const hostname = window.location.hostname;
    if (hostname.includes('replit') || hostname.includes('riker.repl')) {
      setAuthDomainError(true);
      // Force email login method as Google won't work on unauthorized domains
      setActiveTab('email');
    }
  }, []);

  // Handle Google Sign-in with popup
  const handleGoogleSignIn = async () => {
    try {
      // Show current location for debugging
      console.log("Current location:", window.location.href);
      console.log("Hostname:", window.location.hostname);
      console.log("Origin:", window.location.origin);
      
      setIsSigningIn(true);
      setError(null);
      const user = await signInWithGoogle();
      console.log("User signed in:", user?.email);
      // No redirect needed - the popup handles the flow
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(`Authentication domain not authorized. Please contact the administrator to add "${window.location.hostname}" to Firebase authorized domains.`);
      setIsSigningIn(false);
    }
  };

  // Handle Email/Password Sign-in
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSigningIn(true);
      setError(null);
      
      // Validate inputs
      if (!email || !password) {
        setError("Email and password are required");
        setIsSigningIn(false);
        return;
      }
      
      const user = await signInWithEmail(email, password);
      console.log("User signed in with email:", user?.email);
      
      // Manually set the current user in the auth context
      setCurrentUser(user);
      
      // Directly navigate to the dashboard after successful login
      window.location.href = '/admin/dashboard';
    } catch (err: any) {
      console.error('Login failed:', err);
      setError(err?.message || 'Invalid email or password');
      setIsSigningIn(false);
    }
  };

  // Redirect if already authenticated and is admin (only from login page)
  useEffect(() => {
    const currentPath = window.location.pathname;
    console.log('Auth state check:', { currentUser: !!currentUser, isAdmin, isSigningIn, currentPath });
    
    // Only redirect if we're on the login page and user is authenticated admin
    if (currentUser && isAdmin && !isSigningIn && currentPath === '/admin/login') {
      // Get redirectAfterLogin from sessionStorage or default to admin dashboard
      const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/admin/dashboard';
      // Clear the stored path
      sessionStorage.removeItem('redirectAfterLogin');
      console.log('Redirecting authenticated admin from login to:', redirectPath);
      // Navigate to the redirect path
      setTimeout(() => {
        window.location.href = redirectPath;
      }, 100);
    } else if (currentUser && !isAdmin && !isSigningIn && currentPath === '/admin/login') {
      // User is authenticated but not an admin
      setError('You do not have permission to access the admin area.');
    }
  }, [currentUser, isAdmin, isSigningIn]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#FDF6EE] p-4">
      <Card className="w-full max-w-md shadow-lg border border-[#A0B985]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-semibold text-[#8B5E3C]">Admin Login</CardTitle>
          <CardDescription>Sign in to access the Ko Lake Villa admin dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          {authDomainError && (
            <div className="bg-amber-100 border border-amber-400 text-amber-800 px-4 py-3 rounded mb-4">
              <p className="font-medium">Authentication domain not authorized</p>
              <p className="text-sm">Please use Email login with your admin credentials.</p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          
          <Tabs defaultValue="email" value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="google" disabled={authDomainError}>Sign in with Google</TabsTrigger>
              <TabsTrigger value="email">Sign in with Email</TabsTrigger>
            </TabsList>
            
            <TabsContent value="google" className="flex justify-center">
              <Button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="bg-[#FF914D] hover:bg-[#8B5E3C] text-white px-4 py-2 rounded"
              >
                {isSigningIn && activeTab === "google" ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 mr-2"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Sign in with Google
                  </>
                )}
              </Button>
            </TabsContent>
            
            <TabsContent value="email">
              <form onSubmit={handleEmailSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="contact@KoLakeHouse.com" 
                    className="border-[#A0B985]"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border-[#A0B985]"
                  />
                </div>
                <Button 
                  type="submit"
                  disabled={isSigningIn}
                  className="w-full bg-[#FF914D] hover:bg-[#8B5E3C] text-white"
                >
                  {isSigningIn && activeTab === "email" ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      Signing in...
                    </>
                  ) : "Sign In"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          <p>Only authorized administrators can access this area.</p>
        </CardFooter>
      </Card>
    </div>
  );
}