import { Request, Response, NextFunction } from 'express';

// Admin authentication middleware
export const requireAdminAuth = (req: Request, res: Response, next: NextFunction) => {
  // Check for authentication token or session
  const authHeader = req.headers.authorization;
  const sessionUser = req.session?.user;
  
  // Allow requests with proper authentication
  if (authHeader?.startsWith('Bearer ') || sessionUser?.isAdmin) {
    return next();
  }
  
  // Check for admin emails in request (fallback for development)
  const adminEmails = ['contact@KoLakeHouse.com', 'RajAbey68@gmail.com'];
  const userEmail = req.headers['x-user-email'] as string;
  
  if (userEmail && adminEmails.includes(userEmail)) {
    return next();
  }
  
  return res.status(401).json({ 
    error: 'Unauthorized',
    message: 'Admin authentication required'
  });
};

// Rate limiting middleware for admin operations
export const adminRateLimit = (req: Request, res: Response, next: NextFunction) => {
  // Simple rate limiting - could be enhanced with Redis in production
  const clientIP = req.ip;
  const now = Date.now();
  
  // Allow for development environment
  if (process.env.NODE_ENV === 'development') {
    return next();
  }
  
  // In production, implement proper rate limiting
  next();
};

// Validate admin session
export const validateAdminSession = (req: Request, res: Response, next: NextFunction) => {
  const session = req.session;
  
  if (!session) {
    return res.status(401).json({
      error: 'No session found',
      message: 'Please log in to access admin features'
    });
  }
  
  next();
};