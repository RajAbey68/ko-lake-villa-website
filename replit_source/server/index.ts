import express, { type Request, Response, NextFunction } from "express";
import routes from "./routes.js";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import fs from "fs";

// Make sure uploads directory exists
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const app = express();

// Security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Static file serving for uploads
app.use('/uploads', express.static(UPLOADS_DIR));

// API routes
app.use(routes);

// Error handling middleware
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  console.error('Server error:', err);
  
  if (!res.headersSent) {
    if (process.env.NODE_ENV === 'production') {
      res.status(status).json({ error: "Internal Server Error" });
    } else {
      res.status(status).json({ error: message, stack: err.stack });
    }
  }
});

(async () => {
  try {
    // Setup Vite in development, serve static in production
    if (process.env.NODE_ENV === 'production') {
      serveStatic(app, false);
      console.log('Production mode: serving static files');
    } else {
      try {
        await setupVite(app, true);
        console.log('Development mode: Vite server configured');
      } catch (viteError) {
        console.warn('Vite setup failed, falling back to static serving:', viteError);
        serveStatic(app, false);
      }
    }

    // Start server
    const PORT = Number(process.env.PORT) || 5000;
    const server = app.listen(PORT, "0.0.0.0", () => {
      log(`Ko Lake Villa server listening on port ${PORT}`);
      console.log(`Server accessible at http://localhost:${PORT}`);
    });
    
    // Test server is responsive
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:${PORT}/api/rooms`);
        console.log(`Server health check: ${response.status}`);
      } catch (err) {
        console.log('Server health check failed:', err.message);
      }
    }, 1000);

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});