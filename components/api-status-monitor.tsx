"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { Wifi, WifiOff, AlertTriangle, RefreshCw } from "lucide-react"

export function ApiStatusMonitor() {
  const [status, setStatus] = useState<"checking" | "online" | "offline" | "error">("checking")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)
  const [errorDetails, setErrorDetails] = useState<string>("")

  const checkStatus = async () => {
    setStatus("checking")
    try {
      const isOnline = await apiClient.healthCheck()
      setStatus(isOnline ? "online" : "offline")
      setLastCheck(new Date())
      setErrorDetails("")
    } catch (error) {
      setStatus("error")
      setErrorDetails(error instanceof Error ? error.message : "Unknown error")
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 30000) // Check every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "bg-green-100 text-green-800"
      case "offline":
        return "bg-red-100 text-red-800"
      case "error":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case "online":
        return <Wifi className="w-3 h-3 mr-1" />
      case "offline":
        return <WifiOff className="w-3 h-3 mr-1" />
      case "error":
        return <AlertTriangle className="w-3 h-3 mr-1" />
      default:
        return <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
    }
  }

  const getStatusText = () => {
    switch (status) {
      case "online":
        return "Backend Online"
      case "offline":
        return "Backend Offline"
      case "error":
        return "Connection Error"
      default:
        return "Checking..."
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge className={getStatusColor()}>
        {getStatusIcon()}
        {getStatusText()}
      </Badge>
      {lastCheck && <span className="text-xs text-gray-500">{lastCheck.toLocaleTimeString()}</span>}
      <Button size="sm" variant="ghost" onClick={checkStatus}>
        <RefreshCw className="w-3 h-3" />
      </Button>
      {errorDetails && (
        <span className="text-xs text-red-600 max-w-xs truncate" title={errorDetails}>
          {errorDetails}
        </span>
      )}
    </div>
  )
}
