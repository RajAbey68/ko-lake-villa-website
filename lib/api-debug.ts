// Advanced API debugging and troubleshooting utilities
export class ApiDebugger {
  private static logs: any[] = []

  static log(type: "request" | "response" | "error", data: any) {
    const timestamp = new Date().toISOString()
    const logEntry = { timestamp, type, ...data }
    this.logs.push(logEntry)
    console.log(`🔍 [${type.toUpperCase()}] ${timestamp}:`, data)

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(-100)
    }
  }

  static getLogs() {
    return this.logs
  }

  static clearLogs() {
    this.logs = []
  }

  // Test different port configurations
  static async testPorts(baseUrl: string) {
    const commonPorts = ["", ":3000", ":5000", ":8000", ":8080", ":3001"]
    const results = []

    for (const port of commonPorts) {
      const testUrl = `${baseUrl}${port}/api/health`
      try {
        const response = await fetch(testUrl, {
          method: "GET",
          timeout: 5000,
        } as any)
        results.push({
          port: port || "default",
          url: testUrl,
          status: response.status,
          success: response.ok,
          headers: Object.fromEntries(response.headers.entries()),
        })
      } catch (error) {
        results.push({
          port: port || "default",
          url: testUrl,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        })
      }
    }

    return results
  }

  // Test different API path configurations
  static async testApiPaths(baseUrl: string) {
    const commonPaths = ["/api", "/api/v1", "", "/server", "/backend"]

    const testEndpoints = ["/health", "/gallery", "/booking", "/contact"]

    const results = []

    for (const basePath of commonPaths) {
      for (const endpoint of testEndpoints) {
        const testUrl = `${baseUrl}${basePath}${endpoint}`
        try {
          const response = await fetch(testUrl, {
            method: "GET",
            timeout: 3000,
          } as any)

          results.push({
            path: `${basePath}${endpoint}`,
            url: testUrl,
            status: response.status,
            success: response.ok,
            contentType: response.headers.get("content-type"),
          })
        } catch (error) {
          results.push({
            path: `${basePath}${endpoint}`,
            url: testUrl,
            success: false,
            error: error instanceof Error ? error.message : "Unknown error",
          })
        }
      }
    }

    return results
  }
}
