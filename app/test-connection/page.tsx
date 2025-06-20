"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api-client"
import { CheckCircle, XCircle, Loader2, RefreshCw } from "lucide-react"

export default function TestConnectionPage() {
  const [testResults, setTestResults] = useState<any>({})
  const [testing, setTesting] = useState(false)

  const runTests = async () => {
    setTesting(true)
    const results: any = {}

    // Test 1: Health Check
    try {
      const health = await apiClient.healthCheck()
      results.health = { success: health, message: health ? "Backend is online" : "Backend is offline" }
    } catch (error) {
      results.health = { success: false, message: `Health check failed: ${error}` }
    }

    // Test 2: Gallery API
    try {
      const gallery = await apiClient.getGalleryImages()
      results.gallery = { success: true, message: `Found ${gallery.length} images` }
    } catch (error) {
      results.gallery = { success: false, message: `Gallery API failed: ${error}` }
    }

    // Test 3: Categories API
    try {
      const categories = await apiClient.getGalleryCategories()
      results.categories = { success: true, message: `Found ${categories.length} categories` }
    } catch (error) {
      results.categories = { success: false, message: `Categories API failed: ${error}` }
    }

    // Test 4: Dashboard API
    try {
      const dashboard = await apiClient.getDashboardData()
      results.dashboard = { success: true, message: "Dashboard data loaded successfully" }
    } catch (error) {
      results.dashboard = { success: false, message: `Dashboard API failed: ${error}` }
    }

    setTestResults(results)
    setTesting(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Backend Connection Test</h1>
          <p className="text-gray-600">Test connectivity to your Replit backend</p>
          <Badge className="mt-2">Target: https://skill-bridge-rajabey68.replit.app/api</Badge>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Connection Tests
              <Button onClick={runTests} disabled={testing} className="bg-amber-600 hover:bg-amber-700">
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run Tests
                  </>
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(testResults).map(([test, result]: [string, any]) => (
                <div key={test} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    {result.success ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-semibold capitalize">{test} API</p>
                      <p className="text-sm text-gray-600">{result.message}</p>
                    </div>
                  </div>
                  <Badge className={result.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                    {result.success ? "Pass" : "Fail"}
                  </Badge>
                </div>
              ))}

              {Object.keys(testResults).length === 0 && !testing && (
                <div className="text-center py-8 text-gray-500">
                  <p>Click "Run Tests" to check backend connectivity</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Checklist</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="backend" className="rounded" />
                <label htmlFor="backend">Backend deployed and running</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="env" className="rounded" />
                <label htmlFor="env">Environment variables configured</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="cors" className="rounded" />
                <label htmlFor="cors">CORS configured for frontend domain</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="db" className="rounded" />
                <label htmlFor="db">Database connected and seeded</label>
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="auth" className="rounded" />
                <label htmlFor="auth">Firebase authentication configured</label>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
