// Complete Firebase configuration with authentication functions
import { initializeApp } from "firebase/app"
import { getAuth, type User } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Authentication storage functions
export const storeAuthUser = (user: User | null): void => {
  if (typeof window !== "undefined") {
    if (user) {
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      }
      localStorage.setItem("authUser", JSON.stringify(userData))
    } else {
      localStorage.removeItem("authUser")
    }
  }
}

export const getStoredAuthUser = (): User | null => {
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("authUser")
      if (storedUser) {
        return JSON.parse(storedUser) as User
      }
    } catch (error) {
      console.error("Error parsing stored auth user:", error)
      localStorage.removeItem("authUser")
    }
  }
  return null
}

export const clearStoredAuthUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authUser")
  }
}

// Auth state management
export const getCurrentUser = (): Promise<User | null> => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe()
      resolve(user)
    })
  })
}

export default app
