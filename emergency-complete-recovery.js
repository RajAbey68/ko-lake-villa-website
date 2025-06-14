
/**
 * Emergency Complete Gallery Recovery
 * Recovers all images and videos with intelligent categorization
 */

const fs = require('fs');
const path = require('path');

async function apiRequest(method, endpoint, body = null) {
  const response = await fetch(`http://localhost:5000${endpoint}`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : null
  });
  
  const text = await response.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  
  return { response, data };
}

function scanForAllMedia() {
  const mediaFiles = [];
  
  function scanDirectory(dirPath, category = null) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory()) {
        // Use directory name as category if it's a known gallery category
        const knownCategories = [
          'family-suite', 'group-room', 'triple-room', 'dining-area',
          'pool-deck', 'lake-garden', 'roof-garden', 'front-garden',
          'koggala-lake', 'excursions', 'entire-villa', 'friends', 'events'
        ];
        
        const dirCategory = knownCategories.includes(item.name) ? item.name : category;
        scanDirectory(fullPath, dirCategory);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        
        // Check for images and videos
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext)) {
          const stats = fs.statSync(fullPath);
          const isVideo = ['.mp4', '.mov', '.avi', '.mkv', '.webm'].includes(ext);
          
          mediaFiles.push({
            filename: item.name,
            fullPath,
            webPath: fullPath.replace(process.cwd(), '').replace(/\\/g, '/'),
            category: category || 'entire-villa',
            type: isVideo ? 'video' : 'image',
            size: stats.size,
            modified: stats.mtime
          });
        }
      }
    }
  }
  
  // Scan all possible media locations
  scanDirectory('./uploads/gallery');
  scanDirectory('./uploads');
  scanDirectory('./static');
  scanDirectory('./images');
  
  return mediaFiles;
}

function generateIntelligentMetadata(filename, category, mediaType) {
  const name = filename.toLowerCase();
  let title = filename.replace(/\.[^/.]+$/, "").replace(/[-_\d]/g, " ").trim();
  let description = '';
  let tags = [category];
  
  // Smart categorization based on filename
  if (name.includes('pool')) {
    category = 'pool-deck';
    title = `Pool Area - ${title}`;
    description = 'Beautiful pool deck area with stunning lake views at Ko Lake Villa';
    tags = ['pool-deck', 'pool', 'relaxation', 'water'];
  } else if (name.includes('dining') || name.includes('food') || name.includes('cake')) {
    category = 'dining-area';
    title = `Dining Experience - ${title}`;
    description = 'Delicious culinary experiences at Ko Lake Villa';
    tags = ['dining-area', 'food', 'cuisine', 'restaurant'];
  } else if (name.includes('family') || name.includes('suite')) {
    category = 'family-suite';
    title = `Family Suite - ${title}`;
    description = 'Spacious family accommodation with modern amenities';
    tags = ['family-suite', 'accommodation', 'family', 'comfort'];
  } else if (name.includes('group') || name.includes('friend')) {
    category = 'group-room';
    title = `Group Accommodation - ${title}`;
    description = 'Perfect for group stays and gatherings';
    tags = ['group-room', 'friends', 'group', 'social'];
  } else if (name.includes('triple')) {
    category = 'triple-room';
    title = `Triple Room - ${title}`;
    description = 'Comfortable triple occupancy room';
    tags = ['triple-room', 'accommodation', 'comfort'];
  } else if (name.includes('lake') || name.includes('koggala')) {
    category = 'koggala-lake';
    title = `Koggala Lake Views - ${title}`;
    description = 'Stunning views of Koggala Lake and natural surroundings';
    tags = ['koggala-lake', 'lake', 'views', 'nature'];
  } else if (name.includes('garden')) {
    if (name.includes('roof')) {
      category = 'roof-garden';
      title = `Roof Garden - ${title}`;
    } else if (name.includes('front')) {
      category = 'front-garden';
      title = `Front Garden - ${title}`;
    } else {
      category = 'lake-garden';
      title = `Garden Area - ${title}`;
    }
    description = 'Beautiful garden spaces at Ko Lake Villa';
    tags = [category, 'garden', 'nature', 'landscaping'];
  } else if (name.includes('excursion') || name.includes('tour')) {
    category = 'excursions';
    title = `Local Excursions - ${title}`;
    description = 'Exciting local tours and cultural experiences';
    tags = ['excursions', 'tours', 'activities', 'culture'];
  }
  
  // Clean up title
  title = title.replace(/\s+/g, ' ').trim();
  if (!title || title.length < 3) {
    title = `Ko Lake Villa - ${category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}`;
  }
  
  if (!description) {
    description = `Beautiful ${category.replace('-', ' ')} at Ko Lake Villa - your luxury lakeside retreat in Ahangama`;
  }
  
  return { title, description, category, tags: tags.join(',') };
}

async function emergencyRecovery() {
  console.log('🚨 EMERGENCY GALLERY RECOVERY STARTED');
  console.log('======================================\n');
  
  try {
    // Step 1: Find all media files
    console.log('1. 🔍 Scanning for all media files...');
    const mediaFiles = scanForAllMedia();
    
    console.log(`   Found ${mediaFiles.length} media files:`);
    const images = mediaFiles.filter(f => f.type === 'image');
    const videos = mediaFiles.filter(f => f.type === 'video');
    console.log(`   - Images: ${images.length}`);
    console.log(`   - Videos: ${videos.length}\n`);
    
    if (mediaFiles.length === 0) {
      console.log('❌ No media files found! Check if files still exist.');
      return;
    }
    
    // Step 2: Clear corrupted gallery
    console.log('2. 🧹 Clearing corrupted gallery data...');
    try {
      const { response } = await apiRequest('DELETE', '/api/gallery/all');
      if (response.ok) {
        console.log('   ✅ Gallery cleared successfully\n');
      } else {
        console.log('   ⚠️ Could not clear gallery, continuing...\n');
      }
    } catch (error) {
      console.log('   ⚠️ Clear operation failed, continuing...\n');
    }
    
    // Step 3: Restore all media with intelligent metadata
    console.log('3. 🔄 Restoring media with intelligent categorization...');
    let restored = 0;
    let failed = 0;
    
    for (const media of mediaFiles) {
      try {
        const metadata = generateIntelligentMetadata(media.filename, media.category, media.type);
        
        const galleryData = {
          imageUrl: media.webPath,
          title: metadata.title,
          alt: metadata.title,
          description: metadata.description,
          category: metadata.category,
          tags: metadata.tags,
          mediaType: media.type,
          featured: restored < 10, // First 10 as featured
          sortOrder: restored + 1
        };
        
        const { response } = await apiRequest('POST', '/api/gallery', galleryData);
        
        if (response.ok) {
          restored++;
          console.log(`   ✅ Restored: ${metadata.title} (${media.type})`);
        } else {
          failed++;
          console.log(`   ❌ Failed: ${media.filename}`);
        }
        
      } catch (error) {
        failed++;
        console.log(`   ❌ Error processing ${media.filename}: ${error.message}`);
      }
    }
    
    console.log('\n4. 🔍 Verifying restoration...');
    const { response: verifyResponse, data: gallery } = await apiRequest('GET', '/api/gallery');
    
    if (verifyResponse.ok && Array.isArray(gallery)) {
      console.log(`   ✅ Gallery verification: ${gallery.length} items restored\n`);
      
      // Show category breakdown
      const categoryBreakdown = {};
      gallery.forEach(item => {
        categoryBreakdown[item.category] = (categoryBreakdown[item.category] || 0) + 1;
      });
      
      console.log('📊 RECOVERY SUMMARY:');
      console.log('==================');
      console.log(`✅ Successfully restored: ${restored} items`);
      console.log(`❌ Failed to restore: ${failed} items`);
      console.log(`📁 Total in gallery: ${gallery.length} items\n`);
      
      console.log('📂 Category breakdown:');
      Object.entries(categoryBreakdown).forEach(([category, count]) => {
        console.log(`   ${category}: ${count} items`);
      });
      
      if (restored > 0) {
        console.log('\n🎉 EMERGENCY RECOVERY COMPLETED SUCCESSFULLY!');
        console.log('Your gallery is now restored with intelligent categorization.');
        console.log('You can now access your gallery at: http://localhost:5000/gallery');
      } else {
        console.log('\n❌ RECOVERY FAILED - No items were restored');
      }
    } else {
      console.log('   ❌ Gallery verification failed\n');
    }
    
  } catch (error) {
    console.error('💥 EMERGENCY RECOVERY FAILED:', error.message);
    console.error('Please check server logs and try again.');
  }
}

// Run emergency recovery
emergencyRecovery().catch(console.error);
