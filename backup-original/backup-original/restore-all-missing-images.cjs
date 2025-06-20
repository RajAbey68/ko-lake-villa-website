/**
 * Restore All Missing Images - Find and restore 300+ deleted gallery images
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

function findAllImages() {
  const imageFiles = [];
  
  function scanDirectory(dirPath, baseDir = '') {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory() && !item.name.includes('node_modules') && !item.name.includes('.git')) {
        scanDirectory(fullPath, baseDir);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          const fileStats = fs.statSync(fullPath);
          imageFiles.push({
            filename: item.name,
            path: fullPath.replace('./', '/'),
            size: fileStats.size,
            directory: path.dirname(fullPath)
          });
        }
      }
    }
  }
  
  // Scan all directories for images
  scanDirectory('./attached_assets');
  scanDirectory('./images');
  scanDirectory('./static');
  scanDirectory('./uploads');
  
  return imageFiles;
}

function categorizeImage(filename, directory) {
  const lowerName = filename.toLowerCase();
  const lowerDir = directory.toLowerCase();
  
  // Priority categorization based on filename content
  if (lowerName.includes('pool') || lowerDir.includes('pool')) return 'pool-deck';
  if (lowerName.includes('room') || lowerName.includes('bedroom') || lowerDir.includes('room')) return 'accommodation';
  if (lowerName.includes('suite') || lowerDir.includes('suite')) return 'family-suite';
  if (lowerName.includes('dining') || lowerName.includes('food') || lowerName.includes('restaurant')) return 'dining-area';
  if (lowerName.includes('garden') || lowerDir.includes('garden')) return 'lake-garden';
  if (lowerName.includes('lake') || lowerName.includes('koggala')) return 'koggala-lake';
  if (lowerName.includes('excursion') || lowerName.includes('activity')) return 'excursions';
  if (lowerName.includes('exterior') || lowerName.includes('outside')) return 'front-garden';
  if (lowerName.includes('roof')) return 'roof-garden';
  
  return 'entire-villa'; // Default category
}

function generateTitle(filename, category) {
  let title = filename.replace(/\.[^/.]+$/, ""); // Remove extension
  
  // Clean up timestamp prefixes
  title = title.replace(/^\d+[-_]?/, '');
  title = title.replace(/^image_\d+/, '');
  title = title.replace(/^WhatsApp\s*Image\s*\d+.*?at\s*[\d.]+/i, '');
  
  // Convert underscores and dashes to spaces
  title = title.replace(/[-_]/g, ' ');
  title = title.replace(/\s+/g, ' ').trim();
  
  // If title is too short or generic, create descriptive title
  if (!title || title.length < 3) {
    const categoryLabels = {
      'pool-deck': 'Swimming Pool Area',
      'accommodation': 'Guest Accommodation',
      'family-suite': 'Family Suite',
      'dining-area': 'Dining Experience',
      'lake-garden': 'Lake Garden View',
      'koggala-lake': 'Koggala Lake',
      'excursions': 'Local Excursions',
      'front-garden': 'Garden Grounds',
      'roof-garden': 'Rooftop Garden',
      'entire-villa': 'Ko Lake Villa'
    };
    title = `Ko Lake Villa - ${categoryLabels[category] || 'Property View'}`;
  } else {
    title = `Ko Lake Villa - ${title}`;
  }
  
  return title;
}

function generateDescription(category, title) {
  const descriptions = {
    'pool-deck': 'Refreshing infinity pool overlooking the serene lake, perfect for relaxation and enjoying stunning sunset views at Ko Lake Villa.',
    'accommodation': 'Comfortable and elegantly furnished guest rooms designed with modern amenities while maintaining authentic Sri Lankan charm.',
    'family-suite': 'Spacious family suite offering privacy and comfort for families, featuring traditional decor with contemporary conveniences.',
    'dining-area': 'Authentic Sri Lankan cuisine and international dishes prepared with fresh local ingredients in our welcoming dining spaces.',
    'lake-garden': 'Beautifully landscaped gardens extending to the lake shore, offering peaceful spaces for meditation and nature appreciation.',
    'koggala-lake': 'Stunning views of Koggala Lake, one of Sri Lanka\'s largest natural lagoons, home to diverse wildlife and traditional fishing communities.',
    'excursions': 'Discover the rich culture and natural beauty of Galle district through our carefully curated local experiences and adventures.',
    'front-garden': 'Tropical gardens featuring native plants and flowers, creating a tranquil entrance to your lakeside retreat.',
    'roof-garden': 'Elevated garden spaces offering panoramic views of the lake and surrounding countryside, perfect for sunrise yoga.',
    'entire-villa': 'Experience affordable elegance at Ko Lake Villa, your authentic Sri Lankan retreat in the heart of Ahangama.'
  };
  
  return descriptions[category] || 'Beautiful moments captured at Ko Lake Villa, showcasing the natural beauty and comfortable accommodations of your lakeside retreat.';
}

async function restoreAllMissingImages() {
  console.log('🔍 Finding all images across the project...');
  
  const allImages = findAllImages();
  console.log(`Found ${allImages.length} total image files`);
  
  // Get current gallery items to avoid duplicates
  const currentGallery = await fetch('http://localhost:5000/api/gallery').then(r => r.json());
  const existingPaths = new Set(currentGallery.map(item => item.imageUrl));
  
  console.log(`Current gallery has ${currentGallery.length} items`);
  
  let restored = 0;
  let skipped = 0;
  
  for (const image of allImages) {
    try {
      // Skip if already in gallery
      const webPath = image.path.startsWith('/') ? image.path : `/${image.path}`;
      if (existingPaths.has(webPath) || existingPaths.has(webPath.replace(/^\//, ''))) {
        skipped++;
        continue;
      }
      
      const category = categorizeImage(image.filename, image.directory);
      const title = generateTitle(image.filename, category);
      const description = generateDescription(category, title);
      
      const imageData = {
        title: title,
        alt: `${title} - Ko Lake Villa accommodation in Ahangama, Sri Lanka`,
        description: description,
        category: category,
        tags: `ko lake villa, sri lanka, ${category.replace('-', ' ')}, luxury accommodation, lakeside retreat, ahangama`,
        mediaType: 'image',
        imageUrl: webPath,
        featured: category === 'entire-villa' || category === 'koggala-lake',
        sortOrder: 0,
        displaySize: 'medium'
      };
      
      const response = await apiRequest('POST', '/api/gallery', imageData);
      
      if (response.ok) {
        restored++;
        if (restored % 10 === 0) {
          console.log(`✅ Restored ${restored} images...`);
        }
      } else {
        const error = await response.text();
        if (!error.includes('already exists')) {
          console.log(`❌ Failed to restore: ${image.filename} - ${error}`);
        }
      }
      
    } catch (error) {
      console.log(`Error processing ${image.filename}:`, error.message);
    }
  }
  
  console.log(`\n✅ Restoration complete:`);
  console.log(`📸 Images restored: ${restored}`);
  console.log(`⏭️ Images skipped (already in gallery): ${skipped}`);
  
  // Verify final count
  const finalGallery = await fetch('http://localhost:5000/api/gallery').then(r => r.json());
  const finalImages = finalGallery.filter(item => item.mediaType === 'image');
  const finalVideos = finalGallery.filter(item => item.mediaType === 'video');
  
  console.log(`\n📊 Final gallery totals:`);
  console.log(`📸 Total images: ${finalImages.length}`);
  console.log(`🎥 Total videos: ${finalVideos.length}`);
  console.log(`📋 Total items: ${finalGallery.length}`);
}

restoreAllMissingImages();