"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { apiClient } from "@/lib/api-client"
import { ApiDebugger } from "@/lib/api-debug"
import { Bug, RefreshCw, CheckCircle, XCircle, Copy, Download, Loader2 } from "lucide-react"

export default function DebugPage() {
  const [customUrl, setCustomUrl] = useState("https://skill-bridge-rajabey68.replit.app")
  const [diagnostics, setDiagnostics] = useState<any>(null)
  const [testing, setTesting] = useState(false)
  const [logs, setLogs] = useState<any[]>([])

  const runFullDiagnostics = async () => {
    setTesting(true)
    ApiDebugger.clearLogs()

    try {
      // Test with custom URL if provided
      if (customUrl !== apiClient["baseUrl"]) {
        apiClient.setBaseUrl(customUrl)
      }

      const results = await apiClient.runDiagnostics()
      setDiagnostics(results)
      setLogs(ApiDebugger.getLogs())
    } catch (error) {
      console.error("Diagnostics failed:", error)
    } finally {
      setTesting(false)
    }
  }

  const testSpecificEndpoint = async (endpoint: string) => {
    try {
      const response = await fetch(`${customUrl}${endpoint}`)
      const result = {
        endpoint,
        status: response.status,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        body: await response.text(),
      }

      ApiDebugger.log("response", result)
      setLogs([...ApiDebugger.getLogs()])
      return result
    } catch (error) {
      ApiDebugger.log("error", { endpoint, error: error instanceof Error ? error.message : "Unknown" })
      setLogs([...ApiDebugger.getLogs()])
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadLogs = () => {
    const logData = JSON.stringify(logs, null, 2)
    const blob = new Blob([logData], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ko-lake-villa-debug-${Date.now()}.json`
    a.click()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
            <Bug className="w-8 h-8 mr-3 text-amber-600" />
            API Debug Center
          </h1>
          <p className="text-gray-600">Comprehensive backend troubleshooting and diagnostics</p>
        </div>

        {/* URL Configuration */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Backend Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="backend-url">Backend URL</Label>
                <Input
                  id="backend-url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://skill-bridge-rajabey68.replit.app"
                />
              </div>
              <Button onClick={runFullDiagnostics} disabled={testing} className="bg-amber-600 hover:bg-amber-700">
                {testing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Run Full Diagnostics
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="ports">Port Tests</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="logs">Live Logs</TabsTrigger>
            <TabsTrigger value="manual">Manual Tests</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {diagnostics ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span>Target URL:</span>
                        <Badge variant="secondary">{diagnostics.baseUrl}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Last Test:</span>
                        <Badge variant="secondary">{new Date(diagnostics.timestamp).toLocaleTimeString()}</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Working Ports:</span>
                        <Badge className="bg-green-100 text-green-800">
                          {diagnostics.portTests?.filter((p: any) => p.success).length || 0}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Working Endpoints:</span>
                        <Badge className="bg-blue-100 text-blue-800">
                          {diagnostics.pathTests?.filter((p: any) => p.success).length || 0}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-500">Run diagnostics to see connection status</p>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline" onClick={() => testSpecificEndpoint("/api/gallery")}>
                    Test Gallery API
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => testSpecificEndpoint("/api/health")}>
                    Test Health Check
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => testSpecificEndpoint("/api/booking")}>
                    Test Booking API
                  </Button>
                  <Button
                    className="w-full bg-amber-600 hover:bg-amber-700"
                    onClick={downloadLogs}
                    disabled={logs.length === 0}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Debug Logs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Port Tests Tab */}
          <TabsContent value="ports">
            <Card>
              <CardHeader>
                <CardTitle>Port Configuration Tests</CardTitle>
              </CardHeader>
              <CardContent>
                {diagnostics?.portTests ? (
                  <div className="space-y-3">
                    {diagnostics.portTests.map((test: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {test.success ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium">{test.url}</p>
                            <p className="text-sm text-gray-600">
                              Port: {test.port} | Status: {test.status || "Failed"}
                            </p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(test.url)}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Run diagnostics to see port test results</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Endpoints Tab */}
          <TabsContent value="endpoints">
            <Card>
              <CardHeader>
                <CardTitle>API Endpoint Tests</CardTitle>
              </CardHeader>
              <CardContent>
                {diagnostics?.pathTests ? (
                  <div className="space-y-3">
                    {diagnostics.pathTests.map((test: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {test.success ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                          <div>
                            <p className="font-medium">{test.path}</p>
                            <p className="text-sm text-gray-600">
                              Status: {test.status || "Failed"} | Type: {test.contentType || "Unknown"}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Badge className={test.success ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                            {test.success ? "Working" : "Failed"}
                          </Badge>
                          <Button size="sm" variant="outline" onClick={() => copyToClipboard(test.url)}>
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">Run diagnostics to see endpoint test results</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Live Logs Tab */}
          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Live Debug Logs
                  <Button size="sm" variant="outline" onClick={() => setLogs([])}>
                    Clear Logs
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={index} className="p-2 bg-gray-50 rounded text-sm font-mono">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge
                          className={
                            log.type === "error"
                              ? "bg-red-100 text-red-800"
                              : log.type === "response"
                                ? "bg-green-100 text-green-800"
                                : "bg-blue-100 text-blue-800"
                          }
                        >
                          {log.type}
                        </Badge>
                        <span className="text-gray-500">{new Date(log.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <pre className="text-xs overflow-x-auto">{JSON.stringify(log, null, 2)}</pre>
                    </div>
                  ))}
                  {logs.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      No logs yet. Run some tests to see debug information.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Manual Tests Tab */}
          <TabsContent value="manual">
            <Card>
              <CardHeader>
                <CardTitle>Manual Endpoint Testing</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "/api/health",
                    "/health",
                    "/api/gallery",
                    "/gallery",
                    "/api/booking",
                    "/booking",
                    "/api/contact",
                    "/contact",
                    "/api/admin/dashboard",
                    "/admin/dashboard",
                  ].map((endpoint) => (
                    <Button
                      key={endpoint}
                      variant="outline"
                      className="justify-start"
                      onClick={() => testSpecificEndpoint(endpoint)}
                    >
                      Test {endpoint}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
