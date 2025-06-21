import { initializeApp, getApps } from "firebase/app";
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
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-key",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-project",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef"
};

// Initialize Firebase with error handling
let app = null;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  }
} catch (error) {
  console.warn("Firebase initialization failed");
  app = null;
}

// Export services with null checks
export const auth = app ? getAuth(app) : null;
export const storage = app ? getStorage(app) : null;
export const analytics = app ? getAnalytics(app) : null;

const googleProvider = new GoogleAuthProvider();

// Authorized admin emails
const AUTHORIZED_EMAILS: string[] = [
  "contact@KoLakeHouse.com",
  "RajAbey68@gmail.com"
];

export const signInWithGoogle = async (): Promise<User | null> => {
  if (!auth) return null;
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error("Google sign-in error:", error);
    return null;
  }
};

export const signInWithEmail = async (email: string, password: string): Promise<User | null> => {
  if (!auth) return null;
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Email sign-in error:", error);
    return null;
  }
};

export const signOutUser = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
    clearStoredAuthUser();
  }
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  if (auth) {
    return onAuthStateChanged(auth, callback);
  }
  return () => {};
};

export const isAuthorizedAdmin = (user: User | null): boolean => {
  return user ? AUTHORIZED_EMAILS.includes(user.email || '') : false;
};

// User storage utilities for persistence
export const storeAuthUser = (user: User): void => {
  try {
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };
    localStorage.setItem('authUser', JSON.stringify(userData));
  } catch (error) {
    console.warn('Failed to store user data:', error);
  }
};

export const getStoredAuthUser = (): User | null => {
  try {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      // Return a user-like object that matches the User interface
      return userData as User;
    }
  } catch (error) {
    console.warn('Failed to retrieve stored user:', error);
  }
  return null;
};

export const clearStoredAuthUser = (): void => {
  try {
    localStorage.removeItem('authUser');
  } catch (error) {
    console.warn('Failed to clear stored user:', error);
  }
};

export { type User };