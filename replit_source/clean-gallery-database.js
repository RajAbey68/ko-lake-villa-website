/**
 * Clean Gallery Database - Remove entries with non-existent files
 */

import fs from 'fs';

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

async function cleanGalleryDatabase() {
  console.log('🧹 Cleaning Gallery Database\n');
  
  // Get all gallery items
  const allItems = await apiRequest('GET', '/api/gallery');
  console.log(`📊 Found ${allItems.length} database entries`);
  
  let removed = 0;
  let kept = 0;
  
  for (const item of allItems) {
    const filePath = item.imageUrl.substring(1); // Remove leading slash
    
    if (!fs.existsSync(filePath)) {
      try {
        await apiRequest('DELETE', `/api/admin/gallery/${item.id}`);
        console.log(`🗑️ Removed: ${item.title} (file not found)`);
        removed++;
      } catch (error) {
        console.log(`❌ Failed to remove ${item.id}: ${error.message}`);
      }
    } else {
      kept++;
    }
  }
  
  console.log(`\n📊 Cleanup Results:`);
  console.log(`🗑️ Removed: ${removed} entries with missing files`);
  console.log(`✅ Kept: ${kept} entries with valid files`);
  
  // Test the cleaned gallery
  const cleanedGallery = await apiRequest('GET', '/api/gallery');
  console.log(`\n🎯 Cleaned gallery has ${cleanedGallery.length} items`);
  
  // Test accessibility of first 5 items
  console.log('\n🔍 Testing File Accessibility:');
  for (let i = 0; i < Math.min(5, cleanedGallery.length); i++) {
    const item = cleanedGallery[i];
    const filePath = item.imageUrl.substring(1);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${item.imageUrl} - ${exists ? 'accessible' : 'not found'}`);
  }
  
  console.log('\n🎉 Database cleanup complete!');
}

cleanGalleryDatabase().catch(console.error);