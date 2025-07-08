/**
 * Gallery Governance System - Production-Safe Image Management
 * Implements backup, rollback, and audit controls for gallery operations
 */

import { db } from "./db";
import { galleryImages } from "@shared/schema";
import { eq } from "drizzle-orm";

interface BackupOperation {
  reason: string;
  performedBy: string;
  affectedIds?: number[];
}

interface RestoreOperation {
  backupId: number;
  performedBy: string;
  reason: string;
}

export class GalleryGovernance {
  
  /**
   * Create full backup before any mass operations
   */
  async createBackup(operation: BackupOperation): Promise<number> {
    try {
      // Get current timestamp for backup reference
      const backupTimestamp = new Date().toISOString();
      
      console.log(`🔒 Creating gallery backup: ${operation.reason}`);
      
      // Execute backup using SQL function
      const result = await db.execute(`
        SELECT backup_gallery_images('${operation.reason}') as backup_count
      `);
      
      const backupCount = result.rows[0]?.backup_count || 0;
      
      // Log the backup operation
      await db.execute(`
        INSERT INTO gallery_audit_log (operation, affected_ids, reason, performed_by)
        VALUES ('BACKUP', ${JSON.stringify(operation.affectedIds || [])}, '${operation.reason}', '${operation.performedBy}')
      `);
      
      console.log(`✅ Backup completed: ${backupCount} images backed up`);
      return backupCount;
      
    } catch (error) {
      console.error('❌ Backup failed:', error);
      throw new Error(`Backup operation failed: ${error.message}`);
    }
  }
  
  /**
   * Safely remove duplicate images with governance
   */
  async removeDuplicatesSafely(performedBy: string): Promise<{removed: number, backupId: number}> {
    try {
      // 1. Create backup first
      const backupCount = await this.createBackup({
        reason: 'Pre-duplicate-removal backup',
        performedBy,
        affectedIds: []
      });
      
      // 2. Identify duplicates without deleting
      const duplicates = await db.execute(`
        SELECT image_url, array_agg(id) as duplicate_ids, count(*) as duplicate_count
        FROM gallery_images 
        GROUP BY image_url 
        HAVING count(*) > 1
      `);
      
      if (duplicates.rows.length === 0) {
        console.log('✅ No duplicates found');
        return { removed: 0, backupId: backupCount };
      }
      
      let totalRemoved = 0;
      const affectedIds: number[] = [];
      
      // 3. For each duplicate set, keep only the first one
      for (const row of duplicates.rows) {
        const duplicateIds = row.duplicate_ids;
        const idsToRemove = duplicateIds.slice(1); // Keep first, remove rest
        
        if (idsToRemove.length > 0) {
          affectedIds.push(...idsToRemove);
          
          // Remove duplicates (keeping the first occurrence)
          await db.execute(`
            DELETE FROM gallery_images 
            WHERE id = ANY(ARRAY[${idsToRemove.join(',')}])
          `);
          
          totalRemoved += idsToRemove.length;
          console.log(`🗑️ Removed ${idsToRemoved.length} duplicates of: ${row.image_url}`);
        }
      }
      
      // 4. Log the removal operation
      await db.execute(`
        INSERT INTO gallery_audit_log (operation, affected_ids, reason, performed_by)
        VALUES ('DELETE_DUPLICATES', ARRAY[${affectedIds.join(',')}], 'Removed ${totalRemoved} duplicate images', '${performedBy}')
      `);
      
      console.log(`✅ Duplicate removal completed: ${totalRemoved} images removed safely`);
      return { removed: totalRemoved, backupId: backupCount };
      
    } catch (error) {
      console.error('❌ Safe duplicate removal failed:', error);
      throw new Error(`Duplicate removal failed: ${error.message}`);
    }
  }
  
  /**
   * Restore gallery from backup
   */
  async restoreFromBackup(operation: RestoreOperation): Promise<number> {
    try {
      console.log(`🔄 Restoring gallery from backup ID: ${operation.backupId}`);
      
      // Execute restore using SQL function
      const result = await db.execute(`
        SELECT restore_gallery_from_backup(
          (SELECT backup_timestamp FROM gallery_images_backup WHERE backup_id = ${operation.backupId} LIMIT 1)
        ) as restore_count
      `);
      
      const restoreCount = result.rows[0]?.restore_count || 0;
      
      // Log the restore operation
      await db.execute(`
        INSERT INTO gallery_audit_log (operation, reason, performed_by)
        VALUES ('RESTORE', 'Restored from backup ID ${operation.backupId}: ${operation.reason}', '${operation.performedBy}')
      `);
      
      console.log(`✅ Restore completed: ${restoreCount} images restored`);
      return restoreCount;
      
    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw new Error(`Restore operation failed: ${error.message}`);
    }
  }
  
  /**
   * Get available backups for rollback
   */
  async getAvailableBackups(): Promise<any[]> {
    try {
      const result = await db.execute(`
        SELECT DISTINCT backup_id, backup_timestamp, backup_reason, 
               COUNT(*) as image_count
        FROM gallery_images_backup 
        GROUP BY backup_id, backup_timestamp, backup_reason
        ORDER BY backup_timestamp DESC
        LIMIT 10
      `);
      
      return result.rows;
    } catch (error) {
      console.error('❌ Failed to get backups:', error);
      return [];
    }
  }
  
  /**
   * Get audit trail for gallery operations
   */
  async getAuditTrail(): Promise<any[]> {
    try {
      const result = await db.execute(`
        SELECT * FROM gallery_audit_log 
        ORDER BY performed_at DESC 
        LIMIT 20
      `);
      
      return result.rows;
    } catch (error) {
      console.error('❌ Failed to get audit trail:', error);
      return [];
    }
  }
}

export const galleryGovernance = new GalleryGovernance();