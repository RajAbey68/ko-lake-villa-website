"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { RefreshCw, AlertTriangle, CheckCircle, Clock, Wrench } from "lucide-react"

export function BackendStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "maintenance" | "offline">("checking")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const checkBackendStatus = async () => {
    setStatus("checking")
    try {
      const isOnline = await apiClient.healthCheck()
      setStatus(isOnline ? "online" : "maintenance")
      setRetryCount(0)
    } catch (error) {
      setStatus("maintenance")
      setRetryCount((prev) => prev + 1)
    }
    setLastCheck(new Date())
  }

  useEffect(() => {
    checkBackendStatus()
    const interval = setInterval(checkBackendStatus, 30000) // Check every 30s
    return () => clearInterval(interval)
  }, [])

  const getStatusInfo = () => {
    switch (status) {
      case "online":
        return {
          color: "bg-green-100 text-green-800",
          icon: <CheckCircle className="w-4 h-4" />,
          message: "Backend Online",
          description: "All systems operational",
        }
      case "maintenance":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: <Wrench className="w-4 h-4" />,
          message: "Backend Maintenance",
          description: "Backend is being updated. Frontend continues to work.",
        }
      case "offline":
        return {
          color: "bg-red-100 text-red-800",
          icon: <AlertTriangle className="w-4 h-4" />,
          message: "Backend Offline",
          description: "Temporary connectivity issues",
        }
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: <RefreshCw className="w-4 h-4 animate-spin" />,
          message: "Checking...",
          description: "Verifying backend status",
        }
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center text-sm">
          <Clock className="w-4 h-4 mr-2" />
          System Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge className={statusInfo.color}>
            {statusInfo.icon}
            <span className="ml-2">{statusInfo.message}</span>
          </Badge>
          <Button size="sm" variant="ghost" onClick={checkBackendStatus}>
            <RefreshCw className="w-3 h-3" />
          </Button>
        </div>

        <p className="text-sm text-gray-600">{statusInfo.description}</p>

        {lastCheck && <p className="text-xs text-gray-500">Last checked: {lastCheck.toLocaleTimeString()}</p>}

        {status === "maintenance" && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              💡 <strong>Good news:</strong> The website continues to work perfectly while backend updates are in
              progress.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
