/**
 * Final Gallery Sync - Match database with actual files
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

async function finalGallerySync() {
  console.log('🔄 Final Gallery Synchronization\n');
  
  // Get actual files
  const uploadsDir = 'uploads/gallery/default';
  const actualFiles = fs.readdirSync(uploadsDir);
  console.log(`📁 Found ${actualFiles.length} actual files`);
  
  // Clear database completely and rebuild with only existing files
  const allItems = await apiRequest('GET', '/api/gallery');
  console.log(`🗑️ Removing all ${allItems.length} database entries`);
  
  for (const item of allItems) {
    try {
      await apiRequest('DELETE', `/api/admin/gallery/${item.id}`);
    } catch (error) {
      console.log(`Failed to delete ${item.id}`);
    }
  }
  
  console.log('✅ Database cleared');
  
  // Add only existing files to database
  console.log('\n📝 Adding existing files to database...');
  let added = 0;
  
  for (const filename of actualFiles) {
    const filePath = `/uploads/gallery/default/${filename}`;
    const isVideo = /\.(mp4|mov|avi|webm)$/i.test(filename);
    
    // Extract meaningful title
    let title = filename.replace(/^\d+-\d*-?/, '').replace(/\.[^.]+$/, '');
    if (title.includes('(copy)')) {
      title = title.replace('(copy)', '').trim();
    }
    
    // Determine category from filename
    const lowerFilename = filename.toLowerCase();
    let category = 'default';
    if (lowerFilename.includes('drone') || lowerFilename.includes('lake')) category = 'koggala-lake';
    else if (lowerFilename.includes('pool')) category = 'pool-deck';
    else if (lowerFilename.includes('dining')) category = 'dining-area';
    else if (lowerFilename.includes('suite')) category = 'family-suite';
    
    const description = isVideo ? 
      `Beautiful video showcasing Ko Lake Villa, your luxury lakeside retreat in Ahangama, Galle.` :
      `Stunning imagery from Ko Lake Villa showcasing the natural beauty and luxury accommodation of this lakeside retreat.`;
    
    const galleryItem = {
      title,
      imageUrl: filePath,
      alt: `${title} - Ko Lake Villa`,
      description,
      category,
      mediaType: isVideo ? 'video' : 'image',
      featured: false,
      sortOrder: 0,
      tags: `ko lake villa, sri lanka, ${category.replace('-', ' ')}, luxury accommodation`
    };
    
    try {
      await apiRequest('POST', '/api/gallery', galleryItem);
      console.log(`✅ Added: ${title}`);
      added++;
    } catch (error) {
      console.log(`❌ Failed: ${title}`);
    }
  }
  
  console.log(`\n📊 Sync Results: ${added} files added to database`);
  
  // Final verification
  const finalGallery = await apiRequest('GET', '/api/gallery');
  console.log(`\n🎯 Final gallery has ${finalGallery.length} items`);
  
  // Test first 3 files
  console.log('\n🔍 Testing accessibility:');
  for (let i = 0; i < Math.min(3, finalGallery.length); i++) {
    const item = finalGallery[i];
    const filePath = item.imageUrl.substring(1);
    const exists = fs.existsSync(filePath);
    console.log(`${exists ? '✅' : '❌'} ${item.imageUrl}`);
  }
  
  console.log('\n🎉 Gallery synchronization complete!');
}

finalGallerySync().catch(console.error);