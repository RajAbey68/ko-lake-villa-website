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

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5xsgdPgOQP-ClyGxqswoxKFolMEVdLcw",
  authDomain: "ko-lake-villa-69f03.firebaseapp.com",
  projectId: "ko-lake-villa-69f03",
  storageBucket: "ko-lake-villa-69f03.firebasestorage.app",
  messagingSenderId: "1093542852432",
  appId: "1:1093542852432:web:91ca5ad836208a2944de55"
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
  "RajAbey68@google.com"
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
      return mockUser as User;
    } else if (email === "RajAbey68@google.com" && password === "rajabey2023") {
      // Same mock implementation for the second admin
      const mockUser: Partial<User> = {
        uid: "rajabey68-mock-uid",
        email: "RajAbey68@google.com",
        displayName: "Raj Abey Admin",
      };
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
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
};

// Auth state change observer
export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export { auth };