/**
 * Sync Gallery Database with Existing Files
 * Removes database entries for missing files and adds entries for orphaned files
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

function scanUploadDirectory() {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const files = [];
  
  function scanDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath);
      } else if (/\.(jpg|jpeg|png|mp4|mov|webm)$/i.test(item)) {
        const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
        files.push('/' + relativePath);
      }
    }
  }
  
  scanDir(uploadsDir);
  return files;
}

async function syncMissingFiles() {
  console.log('🔍 Scanning for missing files and orphaned database entries...');
  
  try {
    // Get current database images
    const galleryData = await apiRequest('GET', '/api/gallery');
    console.log(`📊 Database contains ${galleryData.length} image records`);
    
    // Get actual files
    const actualFiles = scanUploadDirectory();
    console.log(`📁 File system contains ${actualFiles.length} media files`);
    
    // Find missing files (in database but not on disk)
    const missingFiles = [];
    const existingFiles = [];
    
    for (const image of galleryData) {
      const filePath = image.imageUrl;
      const fullPath = path.join(process.cwd(), filePath.startsWith('/') ? filePath.slice(1) : filePath);
      
      if (!fs.existsSync(fullPath)) {
        missingFiles.push(image);
      } else {
        existingFiles.push(image);
      }
    }
    
    console.log(`❌ Found ${missingFiles.length} missing files in database`);
    console.log(`✅ Found ${existingFiles.length} valid files in database`);
    
    // Remove database entries for missing files
    if (missingFiles.length > 0) {
      console.log('\n🗑️ Removing database entries for missing files:');
      
      for (const missing of missingFiles) {
        console.log(`  - Removing: ${missing.title} (${missing.imageUrl})`);
        
        try {
          await apiRequest('DELETE', `/api/admin/gallery/${missing.id}`);
        } catch (error) {
          console.log(`    Error removing ${missing.id}: ${error.message}`);
        }
      }
    }
    
    // Find orphaned files (on disk but not in database)
    const dbFilePaths = existingFiles.map(img => img.imageUrl);
    const orphanedFiles = actualFiles.filter(file => !dbFilePaths.includes(file));
    
    console.log(`📎 Found ${orphanedFiles.length} orphaned files not in database`);
    
    if (orphanedFiles.length > 0) {
      console.log('\n📥 Adding orphaned files to database:');
      
      for (const orphanFile of orphanedFiles.slice(0, 10)) { // Limit to 10 to avoid overwhelming
        const filename = path.basename(orphanFile);
        const category = orphanFile.includes('/pool/') ? 'pool-deck' :
                        orphanFile.includes('/room/') ? 'family-suite' :
                        orphanFile.includes('/dining/') ? 'dining-area' :
                        orphanFile.includes('/lake/') ? 'koggala-lake' : 'entire-villa';
        
        console.log(`  + Adding: ${filename} as ${category}`);
        
        const imageData = {
          title: filename.replace(/\.(jpg|jpeg|png|mp4|mov|webm)$/i, '').replace(/[-_]/g, ' '),
          imageUrl: orphanFile,
          alt: filename.replace(/\.(jpg|jpeg|png|mp4|mov|webm)$/i, ''),
          description: `Authentic Ko Lake Villa ${category.replace('-', ' ')} photo`,
          category: category,
          tags: category === 'koggala-lake' ? 'lake,nature,scenic' : 'villa,accommodation',
          featured: false,
          mediaType: /\.(mp4|mov|webm)$/i.test(orphanFile) ? 'video' : 'image',
          sortOrder: 0
        };
        
        try {
          await apiRequest('POST', '/api/admin/gallery', imageData);
        } catch (error) {
          console.log(`    Error adding ${orphanFile}: ${error.message}`);
        }
      }
    }
    
    // Final count
    const finalGallery = await apiRequest('GET', '/api/gallery');
    console.log(`\n📊 Final gallery count: ${finalGallery.length} images`);
    
    console.log('\n✅ Gallery sync completed!');
    console.log('🚀 Gallery should now have no missing file errors');
    
  } catch (error) {
    console.error('Sync error:', error);
  }
}

syncMissingFiles();