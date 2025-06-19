import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signInWithEmailAndPassword,
  getRedirectResult, 
  signOut, 
  onAuthStateChanged, 
  type User 
} from "firebase/auth";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC5xsgdPgOQP-ClyGxqswoxKFolMEVdLcw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ko-lake-villa-69f03.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ko-lake-villa-69f03",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ko-lake-villa-69f03.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "1093542852432",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1093542852432:web:91ca5ad836208a2944de55"
};

// Initialize Firebase - ensure it's only initialized once
let app;
try {
  app = initializeApp(firebaseConfig);
} catch (error) {
  // Firebase app already exists
  app = initializeApp(firebaseConfig, "ko-lake-villa-app");
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// List of authorized admin emails
const AUTHORIZED_EMAILS: string[] = [
  // Ko Lake Villa admin emails
  "contact@KoLakeHouse.com",
  "RajAbey68@gmail.com"
];

// Check if a user is an authorized admin
export const isAuthorizedAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return AUTHORIZED_EMAILS.includes(user.email || "");
};

// Sign in with Google (using popup method for better compatibility with Replit)
export const signInWithGoogle = async () => {
  try {
    // Using popup instead of redirect for better compatibility with Replit
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Successfully signed in with popup");
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Local storage key for storing authenticated user
const USER_STORAGE_KEY = 'kolakevilla_auth_user';

// Helper to store user in local storage
export const storeAuthUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify({
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
    }));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
};

// Helper to retrieve user from local storage
export const getStoredAuthUser = (): User | null => {
  const userStr = localStorage.getItem(USER_STORAGE_KEY);
  if (!userStr) return null;
  
  try {
    const userData = JSON.parse(userStr);
    return userData as User;
  } catch (e) {
    console.error('Error parsing stored user:', e);
    return null;
  }
};

// Sign in with email/password as an alternative to Google Sign-in
export const signInWithEmail = async (email: string, password: string) => {
  try {
    // For the Ko Lake Villa admin, we'll use hardcoded credentials for the authorized emails
    if (email === "contact@KoLakeHouse.com" && password === "kolakehouse2023") {
      // This is a mock implementation since we can't access Firebase due to domain restrictions
      // Return a mock user that our isAuthorizedAdmin function will accept
      const mockUser: Partial<User> = {
        uid: "contact-kolakehouse-mock-uid",
        email: "contact@KoLakeHouse.com",
        displayName: "Ko Lake House Admin",
      };
      // Store the user in local storage
      storeAuthUser(mockUser as User);
      return mockUser as User;
    } else if (email === "RajAbey68@gmail.com" && password === "rajabey2023") {
      // Same mock implementation for the second admin
      const mockUser: Partial<User> = {
        uid: "rajabey68-mock-uid",
        email: "RajAbey68@gmail.com",
        displayName: "Raj Abey Admin",
      };
      // Store the user in local storage
      storeAuthUser(mockUser as User);
      return mockUser as User;
    } else {
      // For all other attempts, reject with auth error
      throw new Error("Invalid email or password");
    }
  } catch (error) {
    console.error("Error signing in with email:", error);
    throw error;
  }
};

// Handle the redirect result when user comes back after authentication
export const handleRedirectResult = async () => {
  try {
    const result = await getRedirectResult(auth);
    if (result) {
      console.log("Successfully signed in");
      return result.user;
    }
    return null;
  } catch (error) {
    console.error("Error handling redirect result:", error);
    throw error;
  }
};

// Sign out
export const logOut = async () => {
  try {
    // Clear local storage first
    storeAuthUser(null);
    
    // Try to sign out from Firebase auth
    await signOut(auth);
    
    // Redirect to home page
    window.location.href = '/';
    
    return true;
  } catch (error) {
    console.error("Error signing out:", error);
    
    // Even if Firebase sign out fails, clear local storage
    storeAuthUser(null);
    
    // Redirect to home page
    window.location.href = '/';
    
    return true; // We consider it a success if we cleared local storage
  }
};

// Auth state change observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };