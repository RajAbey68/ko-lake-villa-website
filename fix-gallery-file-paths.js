/**
 * Fix Gallery File Paths - Match database URLs with existing files
 */

import fs from 'fs';
import path from 'path';

async function apiRequest(method, endpoint, body = null) {
  const url = `http://localhost:5000${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(url, options);
  return response.json();
}

async function fixGalleryFilePaths() {
  console.log('🔧 Fixing Gallery File Paths\n');
  
  // Get current gallery items
  const galleryItems = await apiRequest('GET', '/api/gallery');
  console.log(`📊 Found ${galleryItems.length} gallery items in database`);
  
  // Get actual files in uploads directory
  const uploadsDir = 'uploads/gallery/default';
  const actualFiles = fs.readdirSync(uploadsDir);
  console.log(`📁 Found ${actualFiles.length} actual files in uploads`);
  
  let fixed = 0;
  let matched = 0;
  
  for (const item of galleryItems) {
    const currentPath = item.imageUrl;
    const filename = path.basename(currentPath);
    
    // Check if current path exists
    const fullPath = currentPath.substring(1); // Remove leading slash
    if (fs.existsSync(fullPath)) {
      matched++;
      continue;
    }
    
    // Try to find matching file by filename pattern
    const baseTitle = item.title || '';
    const matchingFiles = actualFiles.filter(file => {
      // Match by title or partial filename
      return file.includes(baseTitle) || 
             baseTitle.includes(file.replace(/^\d+-\d+-/, '').replace(/\.[^.]+$/, ''));
    });
    
    if (matchingFiles.length > 0) {
      const newPath = `/uploads/gallery/default/${matchingFiles[0]}`;
      
      try {
        await apiRequest('PUT', `/api/gallery/${item.id}`, {
          ...item,
          imageUrl: newPath
        });
        console.log(`✅ Fixed: ${filename} -> ${matchingFiles[0]}`);
        fixed++;
      } catch (error) {
        console.log(`❌ Failed to update ${item.id}: ${error.message}`);
      }
    } else {
      console.log(`⚠️  No match found for: ${filename}`);
    }
  }
  
  console.log(`\n📊 Results:`);
  console.log(`✅ Already matched: ${matched}`);
  console.log(`🔧 Fixed paths: ${fixed}`);
  console.log(`⚠️  Unmatched: ${galleryItems.length - matched - fixed}`);
  
  // Test accessibility after fixes
  console.log('\n🧪 Testing fixed paths...');
  const updatedItems = await apiRequest('GET', '/api/gallery');
  const testItems = updatedItems.slice(0, 5);
  
  let accessible = 0;
  for (const item of testItems) {
    const filePath = item.imageUrl.substring(1);
    if (fs.existsSync(filePath)) {
      accessible++;
      console.log(`✅ ${item.imageUrl} - accessible`);
    } else {
      console.log(`❌ ${item.imageUrl} - still not found`);
    }
  }
  
  console.log(`\n🎯 Accessibility: ${accessible}/${testItems.length} files now accessible`);
}

fixGalleryFilePaths().catch(console.error);