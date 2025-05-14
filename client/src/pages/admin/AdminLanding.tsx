import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { LockIcon, HomeIcon, KeyIcon } from 'lucide-react';
import { signInWithEmail } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../hooks/use-toast';

export default function AdminLanding() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // If already logged in, redirect to dashboard
  if (currentUser) {
    setLocation('/admin/dashboard');
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Required Fields",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      await signInWithEmail(email, password);
      // Redirect will happen via auth context
      toast({
        title: "Login Successful",
        description: "Welcome to Ko Lake Villa Admin",
      });
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDF6EE] p-4">
      <div className="w-full max-w-md">
        <Link href="/">
          <Button variant="ghost" className="absolute top-4 left-4 flex items-center gap-2 text-[#8B5E3C]">
            <HomeIcon className="h-4 w-4" />
            Return to Website
          </Button>
        </Link>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#8B5E3C]">Ko Lake Villa</h1>
          <p className="text-[#8B5E3C] mt-2">Administration Portal</p>
        </div>
        
        <Card className="border-[#A0B985] shadow-lg">
          <CardHeader className="bg-[#8B5E3C] text-white rounded-t-lg">
            <div className="flex justify-center mb-2">
              <div className="p-3 bg-white rounded-full">
                <LockIcon className="h-6 w-6 text-[#8B5E3C]" />
              </div>
            </div>
            <CardTitle className="text-center">Admin Login</CardTitle>
            <CardDescription className="text-gray-200 text-center">
              Enter your credentials to access the dashboard
            </CardDescription>
          </CardHeader>
          
          <form onSubmit={handleLogin}>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-[#8B5E3C]">
                    Email
                  </label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@kolakevilla.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 border-[#A0B985]"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        className="h-5 w-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-[#8B5E3C]">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type="password"
                      placeholder="•••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 border-[#A0B985]"
                      disabled={isLoading}
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <KeyIcon className="h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button
                type="submit"
                className="w-full bg-[#FF914D] hover:bg-[#e67e3d]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
              
              <p className="text-center text-sm text-gray-500">
                Authorized personnel only. All access attempts are logged.
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}