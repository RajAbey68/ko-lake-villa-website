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

// Add cache-busting headers to force browser refresh
app.use((req, res, next) => {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  next();
});

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

      // Set appropriate headers based on content type
      if (contentType.startsWith('video/')) {
        // For video files, set headers that support range requests and streaming
        res.setHeader('Accept-Ranges', 'bytes');

        // Get the range header from the request
        const range = req.headers.range;

        if (range) {
          // Range request handling for video streaming
          const fileSize = stats.size;
          const parts = range.replace(/bytes=/, '').split('-');
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunkSize = (end - start) + 1;

          console.log(`Video streaming request: Range: ${range}, Size: ${fileSize}, Start: ${start}, End: ${end}`);

          const fileStream = fs.createReadStream(filePath, { start, end });

          // Set appropriate headers for the range request
          res.writeHead(206, {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunkSize,
            'Content-Type': contentType
          });

          return fileStream.pipe(res);
        } 
        else {
          // If no range header, serve the whole video but with headers that enable browser to make range requests
          res.setHeader('Content-Length', stats.size);
          res.setHeader('Content-Type', contentType);
          return fs.createReadStream(filePath).pipe(res);
        }
      } 
      else {
        // For images and other content, set no-cache headers
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
        res.setHeader('Content-Type', contentType);

        // Stream the file
        return fs.createReadStream(filePath).pipe(res);
      }
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

  // AI routes will be loaded when needed

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error('Server error:', err);
    console.error('Error stack:', err.stack);

    // In production, don't expose internal error details
    if (process.env.NODE_ENV === 'production') {
      res.status(status).json({ 
        message: 'Something went wrong. Please try again later.',
        error: 'Internal server error'
      });
    } else {
      res.status(status).json({ message, error: err.message, stack: err.stack });
    }
  });

  // Setup vite for development after other routes are set
  // This ensures the catch-all route doesn't interfere with API routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Health check endpoint
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Emergency catch-all for production
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      return next();
    }

    try {
      const indexPath = path.join(__dirname, '../client/dist/index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application not built. Run: npm run build');
      }
    } catch (error) {
      console.error('Static file error:', error);
      res.status(500).send('Server configuration error');
    }
  });

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