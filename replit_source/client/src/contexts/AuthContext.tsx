import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChange, isAuthorizedAdmin, getStoredAuthUser, storeAuthUser } from "../lib/firebase";
import type { User } from "firebase/auth";

// Define the context type
interface AuthContextType {
  currentUser: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  setCurrentUser: (user: User | null) => void;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType>({
  currentUser: null,
  isLoading: true,
  isAdmin: false,
  setCurrentUser: () => {},
});

// Create a provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  // Initialize state with stored user if available
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    return getStoredAuthUser();
  });
  const [isLoading, setIsLoading] = useState(true);
  
  // Effect to handle storing user in local storage when it changes
  useEffect(() => {
    if (currentUser) {
      storeAuthUser(currentUser);
    }
  }, [currentUser]);
  
  useEffect(() => {
    // Check local storage first for stored user
    const storedUser = getStoredAuthUser();
    if (storedUser) {
      setCurrentUser(storedUser);
      setIsLoading(false);
      return () => {};
    }
    
    // If no stored user, subscribe to auth state changes
    const unsubscribe = onAuthStateChange((user: User | null) => {
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
    setCurrentUser,
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