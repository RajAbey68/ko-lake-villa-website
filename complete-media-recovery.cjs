/**
 * Complete Ko Lake Villa Media Recovery
 * Finds and restores ALL authentic property images and videos
 */

const fs = require('fs');
const path = require('path');

async function apiRequest(method, endpoint, body = null) {
  const response = await fetch(`http://localhost:5000${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null
  });
  return response;
}

function findAllMedia() {
  
  const mediaFiles = [];
  
  function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        scanDirectory(fullPath);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        
        // Image files
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          mediaFiles.push({
            filename: item.name,
            path: fullPath.replace('./', '/'),
            type: 'image',
            size: fs.statSync(fullPath).size
          });
        }
        
        // Video files
        if (['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) {
          mediaFiles.push({
            filename: item.name,
            path: fullPath.replace('./', '/'),
            type: 'video',
            size: fs.statSync(fullPath).size
          });
        }
      }
    }
  }
  
  // Scan common media directories
  scanDirectory('./uploads');
  scanDirectory('./static');
  scanDirectory('./images');
  
  return mediaFiles;
}

function generateTags(filename, category, mediaType) {
  const tags = [category];
  
  if (filename.toLowerCase().includes('pool')) tags.push('pool');
  if (filename.toLowerCase().includes('room')) tags.push('accommodation');
  if (filename.toLowerCase().includes('villa')) tags.push('property');
  if (filename.toLowerCase().includes('view')) tags.push('scenic');
  if (filename.toLowerCase().includes('beach')) tags.push('beach');
  if (filename.toLowerCase().includes('garden')) tags.push('garden');
  if (filename.toLowerCase().includes('interior')) tags.push('interior');
  if (filename.toLowerCase().includes('exterior')) tags.push('exterior');
  
  return tags;
}

async function completeMediaRecovery() {
  console.log('🔄 Starting complete media recovery for Ko Lake Villa');
  
  // Find all media files
  const mediaFiles = findAllMedia();
  console.log(`Found ${mediaFiles.length} media files to process`);
  
  const images = mediaFiles.filter(f => f.type === 'image');
  const videos = mediaFiles.filter(f => f.type === 'video');
  
  console.log(`Images: ${images.length}, Videos: ${videos.length}`);
  
  // Clear existing gallery data
  console.log('Clearing corrupted gallery data...');
  try {
    await apiRequest('DELETE', '/api/gallery/clear-all');
  } catch (error) {
    console.log('Note: Clear all endpoint may not exist, continuing...');
  }
  
  let restored = 0;
  
  // Process images
  for (const media of mediaFiles) {
    try {
      // Determine category based on filename and path
      let category = 'property';
      let description = '';
      let title = media.filename.replace(/\.[^/.]+$/, ""); // Remove extension
      
      // Categorize based on filename patterns
      const lowerName = media.filename.toLowerCase();
      
      if (lowerName.includes('pool')) {
        category = 'pool';
        description = 'Ko Lake Villa swimming pool area showcasing our refreshing aquatic amenities';
        title = title.replace(/^\d+_?/, '').replace(/pool/i, 'Pool Area');
      } else if (lowerName.includes('room') || lowerName.includes('bedroom') || lowerName.includes('accommodation')) {
        category = 'accommodation';
        description = 'Comfortable and elegantly furnished accommodation at Ko Lake Villa';
        title = title.replace(/^\d+_?/, '').replace(/room/i, 'Guest Room');
      } else if (lowerName.includes('dining') || lowerName.includes('restaurant') || lowerName.includes('food')) {
        category = 'dining';
        description = 'Delicious local cuisine and dining experiences at Ko Lake Villa';
        title = title.replace(/^\d+_?/, '').replace(/dining/i, 'Dining Experience');
      } else if (lowerName.includes('garden') || lowerName.includes('exterior') || lowerName.includes('outside')) {
        category = 'garden';
        description = 'Beautiful gardens and outdoor spaces at Ko Lake Villa';
        title = title.replace(/^\d+_?/, '').replace(/garden/i, 'Garden Area');
      } else if (lowerName.includes('interior') || lowerName.includes('inside') || lowerName.includes('living')) {
        category = 'interior';
        description = 'Stylish interior spaces designed for comfort and relaxation';
        title = title.replace(/^\d+_?/, '').replace(/interior/i, 'Interior Space');
      } else if (lowerName.includes('view') || lowerName.includes('scenic') || lowerName.includes('landscape')) {
        category = 'scenic';
        description = 'Stunning scenic views and natural beauty surrounding Ko Lake Villa';
        title = title.replace(/^\d+_?/, '').replace(/view/i, 'Scenic View');
      } else {
        description = 'Ko Lake Villa - Experience affordable elegance in the heart of Ahangama';
        title = title.replace(/^\d+_?/, '').replace(/ko.?lake.?villa/i, 'Ko Lake Villa');
      }
      
      // Clean up title
      title = title.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
      if (!title || title.length < 3) {
        title = `Ko Lake Villa - ${category.charAt(0).toUpperCase() + category.slice(1)}`;
      }
      
      const mediaData = {
        title: title,
        alt: `${title} - Ko Lake Villa accommodation in Ahangama`,
        description: description,
        category: category,
        tags: generateTags(media.filename, category, media.type).join(','),
        mediaType: media.type,
        featured: category === 'property' || category === 'scenic',
        sortOrder: 0,
        displaySize: 'medium'
      };
      
      if (media.type === 'image') {
        mediaData.imageUrl = media.path;
      } else {
        mediaData.videoUrl = media.path;
      }
      
      console.log(`Restoring: ${title} (${media.type})`);
      
      const response = await apiRequest('POST', '/api/gallery', mediaData);
      
      if (response.ok) {
        restored++;
        console.log(`✅ Restored: ${title}`);
      } else {
        console.log(`❌ Failed to restore: ${title}`);
      }
      
    } catch (error) {
      console.log(`Error processing ${media.filename}:`, error.message);
    }
  }
  
  console.log(`\n✅ Recovery complete: ${restored} media items restored`);
  console.log(`📊 Final count - Images: ${restored} items total`);
  
  // Verify restoration
  try {
    const verifyResponse = await apiRequest('GET', '/api/gallery');
    const restoredItems = await verifyResponse.json();
    console.log(`\n🔍 Verification: Gallery now contains ${restoredItems.length} items`);
    
    const verifyImages = restoredItems.filter(item => item.type === 'image');
    const verifyVideos = restoredItems.filter(item => item.type === 'video');
    
    console.log(`📸 Images: ${verifyImages.length}`);
    console.log(`🎥 Videos: ${verifyVideos.length}`);
    
  } catch (error) {
    console.log('Could not verify restoration:', error.message);
  }
}

completeMediaRecovery();