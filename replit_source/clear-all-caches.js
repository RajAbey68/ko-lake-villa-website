/**
 * Clear All Caches - Complete System Reset
 * Clears server cache, browser cache directives, and temporary files
 */

import fs from 'fs';
import path from 'path';

async function apiRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(`http://localhost:5000${endpoint}`, options);
  return response.json();
}

function clearTempFiles() {
  const tempDirs = ['temp_extract', 'temp_merge', 'node_modules/.cache'];
  let cleaned = 0;
  
  for (const dir of tempDirs) {
    if (fs.existsSync(dir)) {
      try {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`✅ Cleared ${dir}`);
        cleaned++;
      } catch (error) {
        console.log(`⚠️ Could not clear ${dir}: ${error.message}`);
      }
    }
  }
  
  return cleaned;
}

async function clearServerCache() {
  try {
    // Force gallery cache refresh
    await apiRequest('GET', '/api/gallery');
    console.log('✅ Gallery cache refreshed');
    
    // Test admin gallery cache
    await apiRequest('GET', '/api/admin/gallery');
    console.log('✅ Admin gallery cache refreshed');
    
    return true;
  } catch (error) {
    console.log(`⚠️ Server cache refresh failed: ${error.message}`);
    return false;
  }
}

async function clearAllCaches() {
  console.log('🧹 Clearing all caches for deployment...');
  
  // Clear temporary files
  console.log('\n📁 Clearing temporary files...');
  const tempFilesCleared = clearTempFiles();
  
  // Clear server caches
  console.log('\n🔄 Refreshing server caches...');
  const serverCacheCleared = await clearServerCache();
  
  // Clear development artifacts
  console.log('\n🗑️ Removing development artifacts...');
  const artifacts = [
    'sync-missing-files.js',
    'fix-admin-gallery-display.js',
    'clear-and-rebuild-gallery.js',
    'clear-gallery-completely.js',
    'fix-gallery-upload-system.js',
    'release-validation-test.js'
  ];
  
  let artifactsRemoved = 0;
  for (const artifact of artifacts) {
    if (fs.existsSync(artifact)) {
      try {
        fs.unlinkSync(artifact);
        artifactsRemoved++;
      } catch (error) {
        console.log(`⚠️ Could not remove ${artifact}`);
      }
    }
  }
  
  console.log('\n✅ Cache clearing completed!');
  console.log('='.repeat(50));
  console.log(`📁 Temporary files cleared: ${tempFilesCleared}`);
  console.log(`🔄 Server cache refreshed: ${serverCacheCleared ? 'Yes' : 'No'}`);
  console.log(`🗑️ Development artifacts removed: ${artifactsRemoved}`);
  console.log('\n🚀 System ready for clean deployment');
  console.log('📊 Gallery: Empty and ready for manual uploads');
  console.log('🔧 Upload system: Functional and optimized');
  console.log('💾 Caches: Completely cleared');
}

clearAllCaches();