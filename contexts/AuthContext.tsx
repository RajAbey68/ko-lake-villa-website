"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

interface MockUser {
  uid: string
  email: string
  displayName: string | null
  photoURL: string | null
  emailVerified: boolean
}

interface AuthContextType {
  user: MockUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = getStoredAuthUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock authentication - for demo purposes
      if (email === "admin@kolakevilla.com" && password === "admin123") {
        const mockUser: MockUser = {
          uid: "mock-user-id",
          email: email,
          displayName: "Admin User",
          photoURL: null,
          emailVerified: true,
        }
        setUser(mockUser)
        storeAuthUser(mockUser)
      } else {
        throw new Error("Invalid credentials")
      }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    try {
      // Mock signup - for demo purposes
      const mockUser: MockUser = {
        uid: "mock-user-id-" + Date.now(),
        email: email,
        displayName: null,
        photoURL: null,
        emailVerified: false,
      }
      setUser(mockUser)
      storeAuthUser(mockUser)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    setLoading(true)
    try {
      clearStoredAuthUser()
      setUser(null)
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    signIn,
    signUp,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Mock storage functions
const storeAuthUser = (user: MockUser | null): void => {
  if (typeof window !== "undefined") {
    if (user) {
      localStorage.setItem("authUser", JSON.stringify(user))
    } else {
      localStorage.removeItem("authUser")
    }
  }
}

const getStoredAuthUser = (): MockUser | null => {
  if (typeof window !== "undefined") {
    try {
      const storedUser = localStorage.getItem("authUser")
      if (storedUser) {
        return JSON.parse(storedUser) as MockUser
      }
    } catch (error) {
      console.error("Error parsing stored auth user:", error)
      localStorage.removeItem("authUser")
    }
  }
  return null
}

const clearStoredAuthUser = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authUser")
  }
}
