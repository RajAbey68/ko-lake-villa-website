import type { Request, Response, NextFunction } from 'express';
import { db } from './db';
import { adminAuditLogs, insertAdminAuditLogSchema } from '@shared/schema';

interface AdminUser {
  id: string;
  email: string;
  username?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AdminUser;
    }
  }
}

export interface AuditLogData {
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  status?: 'success' | 'failed' | 'partial';
}

// Middleware to capture admin actions
export function auditLog(auditData: AuditLogData) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const originalSend = res.send;
    
    res.send = function(body) {
      // Log the action after response is sent
      logAdminAction(req, auditData, res.statusCode >= 400 ? 'failed' : 'success');
      return originalSend.call(this, body);
    };
    
    next();
  };
}

// Function to manually log admin actions
export async function logAdminAction(
  req: Request, 
  auditData: AuditLogData, 
  status: 'success' | 'failed' | 'partial' = 'success'
) {
  try {
    // Get admin user info (assuming authentication middleware sets req.user)
    const adminUser = req.user || { id: 'unknown', email: 'unknown@admin.com' };
    
    // Get client IP
    const ipAddress = req.ip || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress || 
                     'unknown';
    
    // Get user agent
    const userAgent = req.get('User-Agent') || 'unknown';
    
    const logEntry = {
      adminId: adminUser.id,
      adminEmail: adminUser.email,
      action: auditData.action,
      resource: auditData.resource,
      resourceId: auditData.resourceId,
      details: {
        ...auditData.details,
        method: req.method,
        url: req.originalUrl,
        body: req.method !== 'GET' ? req.body : undefined
      },
      ipAddress,
      userAgent,
      status: auditData.status || status
    };
    
    const validatedLog = insertAdminAuditLogSchema.parse(logEntry);
    await db.insert(adminAuditLogs).values(validatedLog);
    
    console.log(`[AUDIT] ${adminUser.email} performed ${auditData.action} on ${auditData.resource}`);
    
  } catch (error) {
    console.error('Failed to log admin action:', error);
    // Don't throw error to avoid breaking the request
  }
}

// Common audit actions for easy use
export const AUDIT_ACTIONS = {
  // Gallery management
  GALLERY_UPLOAD: 'gallery_upload',
  GALLERY_DELETE: 'gallery_delete',
  GALLERY_UPDATE: 'gallery_update',
  GALLERY_BULK_UPLOAD: 'gallery_bulk_upload',
  
  // Content management
  CONTENT_CREATE: 'content_create',
  CONTENT_UPDATE: 'content_update',
  CONTENT_DELETE: 'content_delete',
  CONTENT_PUBLISH: 'content_publish',
  
  // User management
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  
  // Settings
  SETTINGS_UPDATE: 'settings_update',
  PRICING_UPDATE: 'pricing_update',
  
  // Data management
  DATA_EXPORT: 'data_export',
  DATA_IMPORT: 'data_import',
  DATA_BACKUP: 'data_backup',
  
  // System actions
  SYSTEM_MAINTENANCE: 'system_maintenance',
  CACHE_CLEAR: 'cache_clear'
} as const;

export const AUDIT_RESOURCES = {
  GALLERY_IMAGE: 'gallery_image',
  GALLERY_VIDEO: 'gallery_video',
  CONTENT_PAGE: 'content_page',
  USER_ACCOUNT: 'user_account',
  PRICING_DATA: 'pricing_data',
  SYSTEM_SETTINGS: 'system_settings',
  BOOKING_DATA: 'booking_data',
  VISITOR_UPLOAD: 'visitor_upload'
} as const;