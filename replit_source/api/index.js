// Vercel serverless function adapter for Express app
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Import your existing server routes
import { registerRoutes } from '../server/routes.ts';
import { registerAIRoutes } from '../server/aiRoutes.ts';
import { registerStorageRoutes } from '../server/storage.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB limit
});

// Make upload middleware available globally
app.locals.upload = upload;

// Register all your existing routes
try {
  registerRoutes(app);
  registerAIRoutes(app);
  registerStorageRoutes(app);
} catch (error) {
  console.error('Error registering routes:', error);
}

// Serve static files from client dist
app.use(express.static(path.join(__dirname, '../client/dist')));

// Catch-all route for client-side routing
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  } else {
    res.status(404).json({ error: 'API endpoint not found' });
  }
});

// Export for Vercel
export default app;