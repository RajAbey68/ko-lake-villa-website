/**
 * Clear Gallery and Rebuild with AI-Generated Titles
 * Complete gallery reset with OpenAI Vision API for proper titles
 */

import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import fetch from 'node-fetch';

const API_BASE = 'http://localhost:5000';

async function apiRequest(method, endpoint, body = null) {
  const url = `${API_BASE}${endpoint}`;
  const options = {
    method,
    headers: body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {},
    body: body instanceof FormData ? body : (body ? JSON.stringify(body) : null)
  };

  const response = await fetch(url, options);
  return response.json();
}

function findAllMediaFiles() {
  const mediaFiles = [];
  const uploadsDir = 'uploads';
  
  function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDirectory(fullPath);
      } else if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.webm'].includes(ext)) {
          // Determine category from path
          let category = 'entire-villa';
          if (fullPath.includes('pool')) category = 'pool-deck';
          else if (fullPath.includes('dining')) category = 'dining-area';
          else if (fullPath.includes('family')) category = 'family-suite';
          else if (fullPath.includes('garden')) category = 'front-garden';
          else if (fullPath.includes('lake')) category = 'koggala-lake';
          else if (fullPath.includes('group')) category = 'group-room';
          else if (fullPath.includes('triple')) category = 'triple-room';
          
          mediaFiles.push({
            path: fullPath,
            filename: item,
            category,
            isVideo: ['.mp4', '.mov', '.avi', '.webm'].includes(ext)
          });
        }
      }
    }
  }
  
  scanDirectory(uploadsDir);
  return mediaFiles;
}

async function clearExistingGallery() {
  console.log('🗑️ Clearing existing gallery...');
  
  try {
    // Get all gallery images
    const images = await apiRequest('GET', '/api/gallery');
    console.log(`Found ${images.length} images to remove`);
    
    // Delete each image
    for (const image of images) {
      try {
        await apiRequest('DELETE', `/api/gallery/${image.id}`);
        console.log(`Deleted image ${image.id}: ${image.title}`);
      } catch (error) {
        console.error(`Failed to delete image ${image.id}:`, error.message);
      }
    }
    
    console.log('✅ Gallery cleared successfully');
    
  } catch (error) {
    console.error('Gallery clear error:', error.message);
  }
}

async function uploadWithAI(file) {
  try {
    console.log(`📤 Uploading ${file.filename} (${file.category})...`);
    
    const form = new FormData();
    form.append('image', fs.createReadStream(file.path));
    form.append('category', file.category);
    // Don't provide title or description - let AI generate them
    
    const result = await apiRequest('POST', '/api/upload', form);
    
    if (result.success) {
      console.log(`✅ Uploaded: "${result.data.title}" - ${result.data.description.substring(0, 60)}...`);
      return result.data;
    } else {
      console.error(`❌ Upload failed for ${file.filename}:`, result.message);
      return null;
    }
    
  } catch (error) {
    console.error(`Upload error for ${file.filename}:`, error.message);
    return null;
  }
}

async function rebuildGalleryWithAI() {
  console.log('🚀 Starting Gallery Rebuild with AI Titles...');
  
  // Step 1: Clear existing gallery
  await clearExistingGallery();
  
  // Step 2: Find all media files
  const mediaFiles = findAllMediaFiles();
  console.log(`📁 Found ${mediaFiles.length} media files to process`);
  
  if (mediaFiles.length === 0) {
    console.log('⚠️ No media files found in uploads directory');
    return;
  }
  
  // Step 3: Upload with AI-generated titles
  const results = [];
  let successCount = 0;
  let failCount = 0;
  
  for (const file of mediaFiles) {
    const result = await uploadWithAI(file);
    if (result) {
      results.push(result);
      successCount++;
    } else {
      failCount++;
    }
    
    // Small delay to avoid overwhelming the API
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Step 4: Summary
  console.log('\n🎉 Gallery Rebuild Complete!');
  console.log(`✅ Successfully uploaded: ${successCount} files`);
  console.log(`❌ Failed uploads: ${failCount} files`);
  
  if (results.length > 0) {
    console.log('\n📝 Sample AI-Generated Titles:');
    results.slice(0, 5).forEach(item => {
      console.log(`• "${item.title}" (${item.category})`);
    });
  }
  
  // Verify final count
  const finalGallery = await apiRequest('GET', '/api/gallery');
  console.log(`\n📊 Final gallery contains ${finalGallery.length} images`);
}

rebuildGalleryWithAI().catch(console.error);