"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

export default function GalleryError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Gallery error:", error)
  }, [error])

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <Card className="text-center">
          <CardContent className="p-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">Gallery Loading Error</h2>

            <p className="text-gray-600 mb-6">
              We're having trouble loading the gallery. This might be a temporary issue.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={reset} className="bg-orange-500 hover:bg-orange-600 text-white">
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>

              <Button variant="outline" onClick={() => (window.location.href = "/")}>
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>

            {error.digest && <p className="text-xs text-gray-400 mt-4">Error ID: {error.digest}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
