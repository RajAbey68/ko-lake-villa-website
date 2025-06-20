/**
 * Sync Gallery Database with Actual Files
 * Updates the gallery database to reference files that actually exist
 */

import fs from 'fs';
import path from 'path';

async function apiRequest(method, endpoint, body = null) {
  const url = `http://localhost:5000${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url);
  return response;
}

function scanUploadDirectory() {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'gallery', 'default');
  const files = [];
  
  try {
    const dirContents = fs.readdirSync(uploadsDir);
    
    for (const file of dirContents) {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.isFile() && file.match(/\.(jpg|jpeg|png|gif|mp4|mov|webm)$/i)) {
        files.push({
          filename: file,
          path: `/uploads/gallery/default/${file}`,
          size: stats.size,
          isVideo: file.match(/\.(mp4|mov|webm|avi)$/i) !== null
        });
      }
    }
  } catch (error) {
    console.error('Error scanning upload directory:', error);
  }
  
  return files;
}

function generateImageData(file) {
  // Extract original name and categorize based on filename patterns
  const filename = file.filename;
  const baseName = filename.replace(/^\d+-(\d+-)?/, '').replace(/\.(jpg|jpeg|png|gif|mp4|mov|webm)$/i, '');
  
  // Categorize based on filename patterns
  let category = 'exterior';
  if (filename.includes('bedroom') || filename.includes('bed')) category = 'bedrooms';
  else if (filename.includes('bathroom') || filename.includes('bath')) category = 'bathrooms';
  else if (filename.includes('kitchen') || filename.includes('dining')) category = 'dining-area';
  else if (filename.includes('living') || filename.includes('lounge')) category = 'living-area';
  else if (filename.includes('pool') || filename.includes('swim')) category = 'pool-area';
  else if (filename.includes('view') || filename.includes('lake')) category = 'lake-views';
  else if (filename.includes('garden') || filename.includes('outdoor')) category = 'gardens';
  
  const title = baseName.replace(/[_-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  return {
    imageUrl: file.path,
    title: title || 'Ko Lake Villa',
    alt: `${title} at Ko Lake Villa`,
    description: `Ko Lake Villa ${category.replace('-', ' ')}`,
    tags: category.replace('-', ','),
    category: category,
    featured: false,
    sortOrder: 0,
    mediaType: file.isVideo ? 'video' : 'image',
    displaySize: 'medium',
    fileSize: file.size
  };
}

async function syncGalleryFiles() {
  console.log('🔍 Scanning upload directory for actual files...');
  
  const actualFiles = scanUploadDirectory();
  console.log(`📁 Found ${actualFiles.length} actual files in uploads directory`);
  
  // Get current gallery entries
  const galleryResponse = await apiRequest('GET', '/api/gallery');
  const currentGallery = await galleryResponse.json();
  console.log(`📊 Current gallery has ${currentGallery.length} entries`);
  
  // Check which current entries have broken file references
  const brokenEntries = [];
  const validEntries = [];
  
  for (const entry of currentGallery) {
    const filePath = path.join(process.cwd(), entry.imageUrl.replace(/^\//, ''));
    if (fs.existsSync(filePath)) {
      validEntries.push(entry);
    } else {
      brokenEntries.push(entry);
    }
  }
  
  console.log(`✅ Valid entries: ${validEntries.length}`);
  console.log(`❌ Broken entries: ${brokenEntries.length}`);
  
  // Find files that aren't in the database
  const existingUrls = new Set(validEntries.map(e => e.imageUrl));
  const newFiles = actualFiles.filter(file => !existingUrls.has(file.path));
  
  console.log(`🆕 New files to add: ${newFiles.length}`);
  
  // Add new files to gallery
  let addedCount = 0;
  for (const file of newFiles) {
    const imageData = generateImageData(file);
    
    try {
      const response = await apiRequest('POST', '/api/gallery', imageData);
      if (response.ok) {
        addedCount++;
        console.log(`➕ Added: ${file.filename}`);
      } else {
        console.error(`❌ Failed to add: ${file.filename}`);
      }
    } catch (error) {
      console.error(`❌ Error adding ${file.filename}:`, error);
    }
  }
  
  // Remove broken entries
  let removedCount = 0;
  for (const entry of brokenEntries) {
    try {
      const response = await apiRequest('DELETE', `/api/gallery/${entry.id}`);
      if (response.ok) {
        removedCount++;
        console.log(`🗑️ Removed broken entry: ${entry.title}`);
      }
    } catch (error) {
      console.error(`❌ Error removing entry ${entry.id}:`, error);
    }
  }
  
  console.log('\n📋 Sync Summary:');
  console.log(`✅ Valid entries kept: ${validEntries.length}`);
  console.log(`➕ New files added: ${addedCount}`);
  console.log(`🗑️ Broken entries removed: ${removedCount}`);
  console.log(`📊 Total files in directory: ${actualFiles.length}`);
  
  // Final verification
  const finalGalleryResponse = await apiRequest('GET', '/api/gallery');
  const finalGallery = await finalGalleryResponse.json();
  console.log(`🎯 Final gallery size: ${finalGallery.length} entries`);
  
  return {
    actualFiles: actualFiles.length,
    validEntries: validEntries.length,
    addedCount,
    removedCount,
    finalGallery: finalGallery.length
  };
}

// Run the sync
syncGalleryFiles()
  .then(result => {
    console.log('\n🎉 Gallery sync completed successfully!');
    console.log('Result:', result);
  })
  .catch(error => {
    console.error('💥 Gallery sync failed:', error);
  });