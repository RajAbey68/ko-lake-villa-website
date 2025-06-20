import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import routes from "./routes.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://skill-bridge-rajabey68.replit.app",
      /\.vercel\.app$/,
      /\.replit\.dev$/,
    ],
    credentials: true,
  }),
)

app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true, limit: "10mb" }))

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")))
app.use(express.static(path.join(__dirname, "../public")))

// API routes
app.use("/api", routes)

// Health check for root
app.get("/", (req, res) => {
  res.json({
    message: "Ko Lake Villa API Server",
    status: "running",
    timestamp: new Date().toISOString(),
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ko Lake Villa API Server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🏠 Root endpoint: http://localhost:${PORT}/`)
})

export default app
