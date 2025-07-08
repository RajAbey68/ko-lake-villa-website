"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [email, setEmail] = useState("kolakevilla@gmail.com")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Verbose logging for debugging
    console.log("=== LOGIN ATTEMPT START ===")
    console.log("Raw email input:", JSON.stringify(email))
    console.log("Raw password input:", JSON.stringify(password))
    
    const emailProcessed = email.toLowerCase().trim()
    const passwordProcessed = password.trim()
    
    console.log("Processed email:", JSON.stringify(emailProcessed))
    console.log("Processed password:", JSON.stringify(passwordProcessed))
    console.log("Expected email:", JSON.stringify("contact@kolakehouse.com"))
    console.log("Expected password:", JSON.stringify("admin123"))
    
    // Use Replit admin credentials
    const emailMatch = (emailProcessed === "kolakevilla@gmail.com" || emailProcessed === "rajiv.abey@gmail.com")
    const passwordMatch = (
      (emailProcessed === "kolakevilla@gmail.com" && passwordProcessed === "admin123") ||
      (emailProcessed === "rajiv.abey@gmail.com" && passwordProcessed === "admin456")
    )
    
    console.log("Email match result:", emailMatch)
    console.log("Password match result:", passwordMatch)
    console.log("Overall auth result:", emailMatch && passwordMatch)

    // Simple authentication with exact credentials
    if (emailMatch && passwordMatch) {
      console.log("✅ AUTHENTICATION SUCCESS")
      
      // Set localStorage for dashboard
      localStorage.setItem("adminAuth", "true")
      console.log("✅ localStorage set")
      
      // Set cookie for middleware (secure cookie for production)
      document.cookie = "authToken=admin-authenticated; path=/; max-age=86400"
      console.log("✅ Cookie set")
      
      // Redirect to dashboard
      console.log("✅ Redirecting to /admin/dashboard")
      router.push("/admin/dashboard")
    } else {
      console.log("❌ AUTHENTICATION FAILED")
      console.log("Email mismatch details:", {
        input: emailProcessed,
        expected: "contact@kolakehouse.com",
        match: emailMatch
      })
      console.log("Password mismatch details:", {
        input: passwordProcessed,
        expected: "admin123", 
        match: passwordMatch
      })
      setError(`Invalid credentials. Got email: "${emailProcessed}" password: "${passwordProcessed}"`)
    }
    
    console.log("=== LOGIN ATTEMPT END ===")
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center space-y-2 mb-6">
          <h1 className="text-2xl font-bold text-amber-800">Ko Lake Villa Admin</h1>
          <p className="text-amber-700">Sign in to access the admin dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
            <p className="text-red-800 text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleEmailLogin} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-amber-800 font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-amber-200 rounded focus:border-orange-400 focus:outline-none"
              placeholder="contact@kolakehouse.com"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-amber-800 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-amber-200 rounded focus:border-orange-400 focus:outline-none"
              placeholder="admin123"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50" 
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

                  <div className="text-center text-sm text-amber-600 mt-4 p-3 bg-amber-50 rounded">
            <p><strong>Admin Credentials:</strong></p>
            <p>Email: kolakevilla@gmail.com</p>
            <p>Password: admin123</p>
            <p className="text-xs mt-1">Or: rajiv.abey@gmail.com / admin456</p>
          </div>
      </div>
    </div>
  )
}
