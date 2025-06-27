"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [email, setEmail] = useState("contact@KoLakeHouse.com")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authentication
    setTimeout(() => {
      if (email === "contact@KoLakeHouse.com" && password === "admin123") {
        localStorage.setItem("adminAuth", "true")
        router.push("/admin/dashboard")
      } else {
        alert("Invalid credentials")
      }
      setIsLoading(false)
    }, 1000)
  }

  const handleGoogleLogin = () => {
    // Simulate Google login
    alert("Google login would be implemented here")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardHeader className="text-center space-y-2">
          <CardTitle className="text-2xl font-bold text-amber-800">Admin Login</CardTitle>
          <CardDescription className="text-amber-700">
            Sign in to access the Ko Lake Villa admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertDescription className="text-yellow-800 text-sm">
              <strong>Authentication domain not authorized</strong>
              <br />
              Please use Email login with your admin credentials.
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
            >
              Sign in with Google
            </Button>
            <Button variant="default" className="bg-orange-500 hover:bg-orange-600 text-white">
              Sign in with Email
            </Button>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-amber-800">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-amber-200 focus:border-orange-400"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-amber-800">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-amber-200 focus:border-orange-400"
                required
              />
            </div>

            <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={isLoading}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Button>
          </form>

          <p className="text-center text-sm text-amber-600 mt-4">
            Only authorized administrators can access this area.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
