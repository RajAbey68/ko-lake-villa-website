import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import path from "path";
import fs from "fs";

// Make sure uploads directory exists and is accessible 
const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
console.log("Uploads directory:", UPLOADS_DIR);

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enhanced static file serving for uploads to prevent disappearing images
app.use('/uploads', (req, res, next) => {
  const filePath = path.join(UPLOADS_DIR, req.path);
  
  // Check if the file exists
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      
      // Verify file is not empty
      if (stats.size === 0) {
        console.error(`Empty file detected: ${filePath}`);
        return res.status(404).send('Empty file');
      }
      
      // Determine content type
      let contentType = 'application/octet-stream';
      if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) contentType = 'image/jpeg';
      else if (filePath.endsWith('.png')) contentType = 'image/png';
      else if (filePath.endsWith('.gif')) contentType = 'image/gif';
      else if (filePath.endsWith('.mp4')) contentType = 'video/mp4';
      
      // Set no-cache headers to ensure fresh content is always loaded
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Content-Type', contentType);
      
      // Stream the file
      return fs.createReadStream(filePath).pipe(res);
    }
  } catch (error) {
    console.error(`Error serving upload: ${req.path}`, error);
  }
  
  // If we get here, continue to the next middleware
  next();
}, express.static(UPLOADS_DIR));

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
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // Setup vite for development after other routes are set
  // This ensures the catch-all route doesn't interfere with API routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

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
})();
