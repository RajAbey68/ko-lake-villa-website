/**
 * Ko Lake Villa - Smart Rollback System
 * Automated backup creation and instant rollback capability
 */

class SmartRollbackSystem {
  constructor() {
    this.backupStorage = 'kolakevilla_backups';
    this.maxBackups = 10;
    this.currentVersion = this.generateVersionId();
  }

  generateVersionId() {
    return `v${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}`;
  }

  async createPreDeploymentBackup() {
    console.log('💾 Creating pre-deployment backup...');
    
    const backup = {
      version: this.currentVersion,
      timestamp: new Date().toISOString(),
      data: await this.captureCurrentState(),
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        size: 0
      }
    };

    backup.metadata.size = JSON.stringify(backup.data).length;
    
    try {
      await this.storeBackup(backup);
      console.log(`✅ Backup created: ${backup.version} (${(backup.metadata.size / 1024).toFixed(1)}KB)`);
      return backup.version;
    } catch (error) {
      console.error('❌ Backup creation failed:', error.message);
      throw error;
    }
  }

  async captureCurrentState() {
    const state = {
      content: null,
      gallery: null,
      rooms: null,
      config: null
    };

    try {
      // Capture content data
      const contentResponse = await fetch('/api/content');
      if (contentResponse.ok) {
        state.content = await contentResponse.json();
      }

      // Capture gallery data
      const galleryResponse = await fetch('/api/gallery');
      if (galleryResponse.ok) {
        state.gallery = await galleryResponse.json();
      }

      // Capture rooms data
      const roomsResponse = await fetch('/api/rooms');
      if (roomsResponse.ok) {
        state.rooms = await roomsResponse.json();
      }

      // Capture configuration
      state.config = {
        timestamp: new Date().toISOString(),
        environment: {
          hasAnalytics: !!import.meta.env.VITE_GA_MEASUREMENT_ID,
          hasStripe: !!import.meta.env.VITE_STRIPE_PUBLIC_KEY
        }
      };

    } catch (error) {
      console.warn('⚠️ Partial state capture:', error.message);
    }

    return state;
  }

  async storeBackup(backup) {
    const stored = this.getStoredBackups();
    stored.push(backup);
    
    // Keep only the most recent backups
    if (stored.length > this.maxBackups) {
      stored.splice(0, stored.length - this.maxBackups);
    }
    
    localStorage.setItem(this.backupStorage, JSON.stringify(stored));
  }

  getStoredBackups() {
    try {
      const stored = localStorage.getItem(this.backupStorage);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.warn('⚠️ Could not read stored backups:', error.message);
      return [];
    }
  }

  listBackups() {
    const backups = this.getStoredBackups();
    
    console.log('\n📋 Available Backups:');
    console.log('-'.repeat(50));
    
    if (backups.length === 0) {
      console.log('No backups available');
      return [];
    }

    backups.reverse().forEach((backup, index) => {
      const age = this.getTimeAgo(backup.timestamp);
      const size = (backup.metadata.size / 1024).toFixed(1);
      console.log(`${index + 1}. ${backup.version} - ${age} (${size}KB)`);
    });

    return backups.reverse();
  }

  async rollbackToVersion(versionId) {
    console.log(`🔄 Rolling back to version: ${versionId}`);
    
    const backups = this.getStoredBackups();
    const targetBackup = backups.find(b => b.version === versionId);
    
    if (!targetBackup) {
      throw new Error(`Backup version ${versionId} not found`);
    }

    try {
      await this.restoreState(targetBackup.data);
      console.log(`✅ Rollback to ${versionId} completed successfully`);
      return true;
    } catch (error) {
      console.error(`❌ Rollback failed:`, error.message);
      throw error;
    }
  }

  async restoreState(state) {
    const restorePromises = [];

    // Restore content if available
    if (state.content) {
      restorePromises.push(
        fetch('/api/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: state.content })
        }).then(response => {
          if (!response.ok) throw new Error('Content restore failed');
          console.log('✅ Content restored');
        })
      );
    }

    // Note: Gallery and rooms restoration would need admin authentication
    // For now, we log what would be restored
    if (state.gallery) {
      console.log(`📸 Gallery data available (${state.gallery.length} items) - requires admin access`);
    }

    if (state.rooms) {
      console.log(`🏠 Rooms data available (${state.rooms.length} items) - requires admin access`);
    }

    await Promise.all(restorePromises);
  }

  getTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = now - then;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    return 'Just now';
  }

  async emergencyRollback() {
    console.log('🚨 EMERGENCY ROLLBACK INITIATED');
    
    const backups = this.getStoredBackups();
    if (backups.length === 0) {
      throw new Error('No backups available for emergency rollback');
    }

    // Use the most recent backup
    const latestBackup = backups[backups.length - 1];
    console.log(`Rolling back to latest backup: ${latestBackup.version}`);
    
    return await this.rollbackToVersion(latestBackup.version);
  }

  clearOldBackups(olderThanDays = 7) {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - olderThanDays);
    
    const backups = this.getStoredBackups();
    const filtered = backups.filter(backup => 
      new Date(backup.timestamp) > cutoff
    );
    
    const removed = backups.length - filtered.length;
    localStorage.setItem(this.backupStorage, JSON.stringify(filtered));
    
    console.log(`🧹 Cleanup: Removed ${removed} old backup${removed !== 1 ? 's' : ''}`);
    return removed;
  }

  getSystemHealth() {
    const backups = this.getStoredBackups();
    const storage = JSON.stringify(backups).length;
    const maxStorage = 5 * 1024 * 1024; // 5MB limit
    
    return {
      backupCount: backups.length,
      storageUsed: storage,
      storageLimit: maxStorage,
      storagePercent: ((storage / maxStorage) * 100).toFixed(1),
      oldestBackup: backups.length > 0 ? backups[0].timestamp : null,
      newestBackup: backups.length > 0 ? backups[backups.length - 1].timestamp : null
    };
  }

  generateRollbackReport() {
    const health = this.getSystemHealth();
    const backups = this.getStoredBackups();
    
    console.log('\n📊 ROLLBACK SYSTEM STATUS');
    console.log('=' + '='.repeat(40));
    console.log(`Backup Count: ${health.backupCount}/${this.maxBackups}`);
    console.log(`Storage Used: ${(health.storageUsed / 1024).toFixed(1)}KB (${health.storagePercent}%)`);
    
    if (health.oldestBackup) {
      console.log(`Oldest Backup: ${this.getTimeAgo(health.oldestBackup)}`);
      console.log(`Newest Backup: ${this.getTimeAgo(health.newestBackup)}`);
    }
    
    console.log('\n🔧 Available Commands:');
    console.log('• createPreDeploymentBackup() - Create backup before changes');
    console.log('• listBackups() - Show all available backups');
    console.log('• rollbackToVersion("versionId") - Restore specific version');
    console.log('• emergencyRollback() - Quick restore to latest backup');
    console.log('• clearOldBackups(days) - Clean up old backups');
    
    return health;
  }
}

// Initialize system
const rollbackSystem = new SmartRollbackSystem();

// Export functions for easy use
async function createBackup() {
  return await rollbackSystem.createPreDeploymentBackup();
}

function listBackups() {
  return rollbackSystem.listBackups();
}

async function rollback(versionId) {
  return await rollbackSystem.rollbackToVersion(versionId);
}

async function emergencyRollback() {
  return await rollbackSystem.emergencyRollback();
}

function rollbackStatus() {
  return rollbackSystem.generateRollbackReport();
}

// Export for use
if (typeof window !== 'undefined') {
  window.createBackup = createBackup;
  window.listBackups = listBackups;
  window.rollback = rollback;
  window.emergencyRollback = emergencyRollback;
  window.rollbackStatus = rollbackStatus;
  window.SmartRollbackSystem = SmartRollbackSystem;
  
  console.log('🛡️ Smart Rollback System loaded!');
  console.log('Commands: createBackup(), listBackups(), rollback("version"), emergencyRollback()');
}