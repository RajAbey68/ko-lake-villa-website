import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import fs from "fs";

// Make sure uploads directory exists and is accessible 
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
console.log("Uploads directory:", UPLOADS_DIR);

const app = express();

// Enable trust proxy for proper HTTPS handling in production
app.set('trust proxy', 1);

// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Add cache-busting headers only for HTML, allow caching for static assets
app.use((req, res, next) => {
  // Don't apply no-cache headers to uploads or static assets
  if (req.path.startsWith('/uploads') || req.path.match(/\.(jpg|jpeg|png|gif|mp4|mov|webm|css|js|svg)$/i)) {
    // Allow caching for static assets
    res.header('Cache-Control', 'public, max-age=86400'); // 24 hours
    return next();
  }
  
  // Apply no-cache headers to HTML and API responses
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

// Static file serving for uploads with proper caching
app.use('/uploads', express.static(UPLOADS_DIR, {
  maxAge: '24h', // 24 hour cache
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    // Set proper content types and caching
    if (path.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      res.setHeader('Content-Type', path.endsWith('.png') ? 'image/png' : 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    } else if (path.match(/\.(mp4|mov|webm|avi)$/i)) {
      res.setHeader('Content-Type', 'video/mp4');
      res.setHeader('Accept-Ranges', 'bytes');
      res.setHeader('Cache-Control', 'public, max-age=86400');
    }
  }
}));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  try {
    const server = await registerRoutes(app);

    // AI routes will be loaded when needed

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";

      console.error('Server error:', err);
      console.error('Error stack:', err.stack);

      // Prevent crash on response errors
      if (!res.headersSent) {
        // In production, don't expose internal error details
        if (process.env.NODE_ENV === 'production') {
          res.status(status).json({ 
            message: 'Something went wrong. Please try again later.',
            error: 'Internal server error'
          });
        } else {
          res.status(status).json({ message, error: err.message, stack: err.stack });
        }
      }
    });

  // Use appropriate server mode based on environment
  if (process.env.NODE_ENV === 'production') {
    try {
      serveStatic(app);
      console.log('Production static server started successfully');
    } catch (error) {
      console.error('Failed to start production server:', error);
    }
  } else {
    try {
      await setupVite(app, server);
      console.log('Vite development server started successfully');
    } catch (error) {
      console.error('Failed to start Vite server:', error);
      // Fallback to serving static files if they exist
      try {
        serveStatic(app);
      } catch (staticError) {
        console.error('Static serving also failed:', staticError);
      }
    }
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Removed problematic fallback route that was causing the "Application not built" message

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });

  // Handle uncaught exceptions to prevent crashes
  process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Don't exit in development, just log the error
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

  process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Don't exit in development, just log the error
  });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();