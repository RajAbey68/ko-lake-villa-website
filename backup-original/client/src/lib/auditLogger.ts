// Client-side audit logging utility for tracking admin actions

interface AuditLogEntry {
  action: string;
  resource: string;
  resourceId?: string;
  details?: any;
  status?: 'success' | 'failed' | 'partial';
}

class AdminAuditLogger {
  private adminId: string = 'admin1'; // Would come from authentication
  private adminEmail: string = 'admin@kolakevilla.com'; // Would come from authentication

  async logAction(entry: AuditLogEntry): Promise<void> {
    try {
      const auditData = {
        adminId: this.adminId,
        adminEmail: this.adminEmail,
        action: entry.action,
        resource: entry.resource,
        resourceId: entry.resourceId,
        details: {
          ...entry.details,
          timestamp: new Date().toISOString(),
          url: window.location.pathname,
          userAgent: navigator.userAgent
        },
        status: entry.status || 'success'
      };

      await fetch('/api/admin/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(auditData)
      });

      console.log(`[AUDIT] ${entry.action} on ${entry.resource}`);
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  }

  // Gallery actions
  async logGalleryUpload(imageId: string, filename: string, category: string) {
    await this.logAction({
      action: 'gallery_upload',
      resource: 'gallery_image',
      resourceId: imageId,
      details: { filename, category, size: 'unknown' }
    });
  }

  async logGalleryDelete(imageId: string, filename: string) {
    await this.logAction({
      action: 'gallery_delete',
      resource: 'gallery_image',
      resourceId: imageId,
      details: { filename }
    });
  }

  async logGalleryUpdate(imageId: string, changes: any) {
    await this.logAction({
      action: 'gallery_update',
      resource: 'gallery_image',
      resourceId: imageId,
      details: { changes }
    });
  }

  async logBulkUpload(count: number, category: string) {
    await this.logAction({
      action: 'gallery_bulk_upload',
      resource: 'gallery_image',
      details: { count, category }
    });
  }

  // Content management actions
  async logContentUpdate(pageId: string, section: string, changes: any) {
    await this.logAction({
      action: 'content_update',
      resource: 'content_page',
      resourceId: pageId,
      details: { section, changes }
    });
  }

  async logContentCreate(pageId: string, type: string) {
    await this.logAction({
      action: 'content_create',
      resource: 'content_page',
      resourceId: pageId,
      details: { type }
    });
  }

  async logContentDelete(pageId: string) {
    await this.logAction({
      action: 'content_delete',
      resource: 'content_page',
      resourceId: pageId
    });
  }

  // User management actions
  async logUserLogin() {
    await this.logAction({
      action: 'user_login',
      resource: 'user_account',
      resourceId: this.adminId
    });
  }

  async logUserLogout() {
    await this.logAction({
      action: 'user_logout',
      resource: 'user_account',
      resourceId: this.adminId
    });
  }

  // Settings actions
  async logSettingsUpdate(setting: string, oldValue: any, newValue: any) {
    await this.logAction({
      action: 'settings_update',
      resource: 'system_settings',
      resourceId: setting,
      details: { oldValue, newValue }
    });
  }

  async logPricingUpdate(roomId: string, oldPrice: number, newPrice: number) {
    await this.logAction({
      action: 'pricing_update',
      resource: 'pricing_data',
      resourceId: roomId,
      details: { oldPrice, newPrice }
    });
  }

  // Visitor uploads moderation
  async logVisitorUploadApproval(uploadId: string, action: 'approve' | 'reject') {
    await this.logAction({
      action: `visitor_upload_${action}`,
      resource: 'visitor_upload',
      resourceId: uploadId,
      details: { moderationAction: action }
    });
  }

  // Data management actions
  async logDataExport(exportType: string, recordCount: number) {
    await this.logAction({
      action: 'data_export',
      resource: 'system_data',
      details: { exportType, recordCount }
    });
  }

  async logSystemMaintenance(maintenanceType: string) {
    await this.logAction({
      action: 'system_maintenance',
      resource: 'system_settings',
      details: { maintenanceType }
    });
  }

  // Error logging
  async logError(action: string, resource: string, error: any) {
    await this.logAction({
      action,
      resource,
      status: 'failed',
      details: { error: error.message || error }
    });
  }
}

// Export singleton instance
export const auditLogger = new AdminAuditLogger();

// Helper function for easy importing
export function logAdminAction(entry: AuditLogEntry) {
  return auditLogger.logAction(entry);
}

// Predefined action constants
export const AUDIT_ACTIONS = {
  GALLERY_UPLOAD: 'gallery_upload',
  GALLERY_DELETE: 'gallery_delete',
  GALLERY_UPDATE: 'gallery_update',
  GALLERY_BULK_UPLOAD: 'gallery_bulk_upload',
  CONTENT_CREATE: 'content_create',
  CONTENT_UPDATE: 'content_update',
  CONTENT_DELETE: 'content_delete',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  SETTINGS_UPDATE: 'settings_update',
  PRICING_UPDATE: 'pricing_update',
  VISITOR_UPLOAD_APPROVE: 'visitor_upload_approve',
  VISITOR_UPLOAD_REJECT: 'visitor_upload_reject',
  DATA_EXPORT: 'data_export',
  SYSTEM_MAINTENANCE: 'system_maintenance'
} as const;

export const AUDIT_RESOURCES = {
  GALLERY_IMAGE: 'gallery_image',
  GALLERY_VIDEO: 'gallery_video',
  CONTENT_PAGE: 'content_page',
  USER_ACCOUNT: 'user_account',
  PRICING_DATA: 'pricing_data',
  SYSTEM_SETTINGS: 'system_settings',
  VISITOR_UPLOAD: 'visitor_upload',
  SYSTEM_DATA: 'system_data'
} as const;