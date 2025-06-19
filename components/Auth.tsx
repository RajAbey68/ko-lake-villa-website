import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface AuthProps {
  onAuthSuccess?: () => void;
}

export default function Auth({ onAuthSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const queryClient = useQueryClient();

  const authMutation = useMutation({
    mutationFn: async (credentials: { email: string; password: string; isLogin: boolean }) => {
      const endpoint = credentials.isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: credentials.email, password: credentials.password })
      });
      
      if (!response.ok) {
        throw new Error('Authentication failed');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/user'] });
      onAuthSuccess?.();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authMutation.mutate({ email, password, isLogin });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">
        {isLogin ? 'Admin Login' : 'Create Account'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          disabled={authMutation.isPending}
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {authMutation.isPending ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
        </button>
      </form>
      
      <p className="mt-4 text-center">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="ml-2 text-blue-600 hover:underline"
        >
          {isLogin ? 'Register' : 'Login'}
        </button>
      </p>
    </div>
  );
}