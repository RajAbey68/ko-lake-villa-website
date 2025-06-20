import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import path from "path"
import { fileURLToPath } from "url"
import secureRoutes from "./secure-routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https:"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  }),
)

app.use(compression())

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://skill-bridge-rajabey68.replit.app",
        /\.vercel\.app$/,
        /\.replit\.dev$/,
      ]

      if (!origin) return callback(null, true)

      const isAllowed = allowedOrigins.some((allowed) => {
        if (typeof allowed === "string") {
          return allowed === origin
        }
        return allowed.test(origin)
      })

      callback(null, isAllowed)
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Body parsing with limits
app.use(express.json({ limit: "1mb" }))
app.use(express.urlencoded({ extended: true, limit: "1mb" }))

// Trust proxy for rate limiting
app.set("trust proxy", 1)

// Serve static files securely
app.use(
  "/uploads",
  express.static(path.join(__dirname, "../public/uploads"), {
    maxAge: "1d",
    etag: true,
    lastModified: true,
  }),
)

app.use(
  express.static(path.join(__dirname, "../public"), {
    maxAge: "1h",
    etag: true,
  }),
)

// API routes
app.use("/api", secureRoutes)

// Health check for root
app.get("/", (req, res) => {
  res.json({
    message: "Ko Lake Villa API Server - Secure",
    status: "running",
    timestamp: new Date().toISOString(),
    version: "2.0.0-secure",
  })
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" })
})

// Global error handler
app.use((error: any, req: any, res: any, next: any) => {
  console.error("Global error:", error.message)
  res.status(500).json({ error: "Internal server error" })
})

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully")
  process.exit(0)
})

process.on("SIGINT", () => {
  console.log("SIGINT received, shutting down gracefully")
  process.exit(0)
})

// Start server
app.listen(PORT, () => {
  console.log(`🔒 Ko Lake Villa Secure API Server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🏠 Root endpoint: http://localhost:${PORT}/`)
  console.log(`🛡️ Security: Helmet, CORS, Rate Limiting, Input Sanitization`)
})

export default app
