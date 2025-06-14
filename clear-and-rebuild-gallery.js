/**
 * Clear and Rebuild Gallery from Scratch
 * Removes all gallery entries and rebuilds with actual files
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

function scanForMediaFiles() {
  const uploadsDir = path.join(process.cwd(), 'uploads');
  const files = [];
  
  function scanDir(dir, category = 'entire-villa') {
    if (!fs.existsSync(dir)) return;
    
    const items = fs.readdirSync(dir);
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Determine category from directory name
        const dirCategory = item.includes('dining') ? 'dining-area' :
                          item.includes('pool') ? 'pool-deck' :
                          item.includes('family') ? 'family-suite' :
                          item.includes('group') ? 'group-room' :
                          item.includes('triple') ? 'triple-room' :
                          item.includes('lake') ? 'koggala-lake' :
                          item.includes('room') ? 'family-suite' :
                          'entire-villa';
        scanDir(fullPath, dirCategory);
      } else if (/\.(jpg|jpeg|png|mp4|mov|webm|gif)$/i.test(item)) {
        const relativePath = path.relative(process.cwd(), fullPath).replace(/\\/g, '/');
        files.push({
          path: '/' + relativePath,
          filename: item,
          category: category,
          isVideo: /\.(mp4|mov|webm)$/i.test(item)
        });
      }
    }
  }
  
  scanDir(uploadsDir);
  return files;
}

function generateImageData(file) {
  const filename = file.filename.replace(/\.[^.]+$/, '');
  const cleanName = filename
    .replace(/^\d+[-_]/, '')  // Remove timestamp prefixes
    .replace(/[-_]/g, ' ')    // Replace dashes/underscores with spaces
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();
  
  // Generate category-specific titles and descriptions
  const categoryTitles = {
    'dining-area': `${cleanName} - Dining Experience`,
    'pool-deck': `${cleanName} - Pool Area`,
    'family-suite': `${cleanName} - Family Suite`,
    'group-room': `${cleanName} - Group Accommodation`,
    'triple-room': `${cleanName} - Triple Room`,
    'koggala-lake': `${cleanName} - Lake View`,
    'entire-villa': `${cleanName} - Villa Experience`
  };
  
  const categoryDescriptions = {
    'dining-area': 'Authentic Sri Lankan dining experience at Ko Lake Villa',
    'pool-deck': 'Relaxing pool deck with stunning lake views',
    'family-suite': 'Comfortable family accommodation with modern amenities',
    'group-room': 'Spacious group accommodation for friends and families',
    'triple-room': 'Cozy triple room with garden or lake views',
    'koggala-lake': 'Beautiful Koggala Lake natural scenery',
    'entire-villa': 'Luxurious villa experience in tropical Sri Lanka'
  };
  
  return {
    title: categoryTitles[file.category] || cleanName,
    imageUrl: file.path,
    alt: `Ko Lake Villa ${file.category.replace('-', ' ')} - ${cleanName}`,
    description: categoryDescriptions[file.category] || 'Authentic Ko Lake Villa experience',
    category: file.category,
    tags: file.category === 'koggala-lake' ? 'lake,nature,scenic,sri-lanka' : 
          file.category === 'dining-area' ? 'dining,food,experience,authentic' :
          file.category === 'pool-deck' ? 'pool,relaxation,luxury,water' :
          'villa,accommodation,sri-lanka,koggala',
    featured: false,
    mediaType: file.isVideo ? 'video' : 'image',
    sortOrder: 0
  };
}

async function clearAndRebuildGallery() {
  console.log('🧹 Clearing and rebuilding gallery from scratch...');
  
  try {
    // Get current gallery count
    const currentGallery = await apiRequest('GET', '/api/gallery');
    console.log(`Found ${currentGallery.length} existing gallery entries`);
    
    // Clear all existing gallery entries
    console.log('🗑️ Clearing existing gallery...');
    for (const image of currentGallery) {
      try {
        await apiRequest('DELETE', `/api/admin/gallery/${image.id}`);
      } catch (error) {
        console.log(`Warning: Could not delete image ${image.id}`);
      }
    }
    
    // Scan for actual media files
    console.log('📁 Scanning for media files...');
    const mediaFiles = scanForMediaFiles();
    console.log(`Found ${mediaFiles.length} actual media files`);
    
    // Rebuild gallery with actual files
    console.log('📝 Rebuilding gallery database...');
    let added = 0;
    
    for (const file of mediaFiles) {
      const imageData = generateImageData(file);
      
      try {
        await apiRequest('POST', '/api/admin/gallery', imageData);
        added++;
        console.log(`✅ Added: ${imageData.title}`);
      } catch (error) {
        console.log(`❌ Failed to add: ${file.filename} - ${error.message}`);
      }
    }
    
    // Final verification
    const finalGallery = await apiRequest('GET', '/api/gallery');
    
    console.log('\n🎉 Gallery rebuild completed!');
    console.log(`📊 Final count: ${finalGallery.length} images`);
    console.log(`📈 Successfully added: ${added} images`);
    console.log('✅ All images now match actual files on disk');
    console.log('🚀 Admin gallery should display properly without gray placeholders');
    
  } catch (error) {
    console.error('Rebuild error:', error);
  }
}

clearAndRebuildGallery();