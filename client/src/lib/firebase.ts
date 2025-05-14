import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, type User } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyC5xsgdPgOQP-ClyGxqswoxKFolMEVdLcw",
  authDomain: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "ko-lake-villa-69f03"}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ko-lake-villa-69f03",
  storageBucket: `${import.meta.env.VITE_FIREBASE_PROJECT_ID || "ko-lake-villa-69f03"}.firebaseestorage.app`,
  messagingSenderId: "1093542852432",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:1093542852432:web:91ca5ad836208a2944de55"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// List of authorized admin emails
const AUTHORIZED_EMAILS = [
  // Add admin emails here, e.g., "admin@kolakevilla.com"
];

// Check if a user is an authorized admin
export const isAuthorizedAdmin = (user: User | null): boolean => {
  if (!user) return false;
  return AUTHORIZED_EMAILS.includes(user.email || "");
};

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
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