import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthChange, isAuthorizedAdmin } from "../lib/firebase";
import type { User } from "firebase/auth";

// Define the context type
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAdmin: boolean;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  isAdmin: false,
});

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Subscribe to auth state changes
    const unsubscribe = onAuthChange((user: User | null) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    
    // Cleanup subscription on unmount
    return unsubscribe;
  }, []);
  
  // Compute if the current user is an admin
  const isAdmin = isAuthorizedAdmin(currentUser);
  
  const value = {
    currentUser,
    isLoading,
    isAdmin,
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}