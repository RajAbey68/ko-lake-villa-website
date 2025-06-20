"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { Wifi, WifiOff, RefreshCw, Cloud, Server } from "lucide-react"

export function ConnectionStatus() {
  const [status, setStatus] = useState<"checking" | "online" | "offline" | "error">("checking")
  const [platform, setPlatform] = useState<string>("Unknown")
  const [lastCheck, setLastCheck] = useState<Date | null>(null)

  const detectPlatform = () => {
    if (typeof window !== "undefined") {
      const hostname = window.location.hostname
      if (hostname.includes("vercel.app")) return "Vercel"
      if (hostname.includes("replit.app") || hostname.includes("replit.dev")) return "Replit"
      if (hostname.includes("localhost")) return "Local"
      return "Custom Domain"
    }
    return "Server"
  }

  const checkStatus = async () => {
    setStatus("checking")
    setPlatform(detectPlatform())

    try {
      const isOnline = await apiClient.healthCheck()
      setStatus(isOnline ? "online" : "offline")
      setLastCheck(new Date())
    } catch (error) {
      setStatus("error")
      setLastCheck(new Date())
    }
  }

  useEffect(() => {
    checkStatus()
    const interval = setInterval(checkStatus, 30000)
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

  const getPlatformIcon = () => {
    switch (platform) {
      case "Vercel":
        return <Cloud className="w-3 h-3 mr-1" />
      case "Replit":
        return <Server className="w-3 h-3 mr-1" />
      default:
        return <Wifi className="w-3 h-3 mr-1" />
    }
  }

  return (
    <div className="flex items-center space-x-2">
      <Badge className={getStatusColor()}>
        {status === "checking" ? (
          <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
        ) : status === "online" ? (
          <Wifi className="w-3 h-3 mr-1" />
        ) : (
          <WifiOff className="w-3 h-3 mr-1" />
        )}
        {status === "online" ? "Online" : status === "offline" ? "Offline" : "Checking..."}
      </Badge>

      <Badge variant="secondary">
        {getPlatformIcon()}
        {platform}
      </Badge>

      {lastCheck && <span className="text-xs text-gray-500">{lastCheck.toLocaleTimeString()}</span>}

      <Button size="sm" variant="ghost" onClick={checkStatus}>
        <RefreshCw className="w-3 h-3" />
      </Button>
    </div>
  )
}
