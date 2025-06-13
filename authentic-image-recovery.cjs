/**
 * Authentic Image Recovery - Identify and restore only genuine Ko Lake Villa property photos
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

function analyzeImageAuthenticity(filename, filePath, fileStats) {
  const lowerName = filename.toLowerCase();
  const size = fileStats.size;
  
  // Scoring system for authenticity (0-100)
  let authenticityScore = 0;
  const reasons = [];
  
  // Property-specific indicators (high value)
  if (lowerName.includes('ko') && (lowerName.includes('lake') || lowerName.includes('villa'))) {
    authenticityScore += 30;
    reasons.push('Property name match');
  }
  
  if (lowerName.includes('koggala')) {
    authenticityScore += 25;
    reasons.push('Location specific');
  }
  
  // Architecture and facility indicators
  const propertyFeatures = ['pool', 'room', 'suite', 'garden', 'dining', 'bedroom', 'bathroom', 'kitchen', 'living', 'terrace', 'balcony'];
  const featureMatches = propertyFeatures.filter(feature => lowerName.includes(feature));
  if (featureMatches.length > 0) {
    authenticityScore += featureMatches.length * 8;
    reasons.push(`Property features: ${featureMatches.join(', ')}`);
  }
  
  // WhatsApp images often authentic property photos
  if (lowerName.includes('whatsapp')) {
    authenticityScore += 20;
    reasons.push('WhatsApp image (likely authentic)');
  }
  
  // File size indicators (authentic photos usually larger)
  if (size > 500000) { // > 500KB
    authenticityScore += 15;
    reasons.push('High quality image size');
  } else if (size < 50000) { // < 50KB
    authenticityScore -= 10;
    reasons.push('Small file size (possibly compressed/icon)');
  }
  
  // Red flags for test/duplicate content
  if (lowerName.includes('test') || lowerName.includes('sample') || lowerName.includes('demo')) {
    authenticityScore -= 30;
    reasons.push('Test/sample indicator');
  }
  
  if (lowerName.includes('cake') || lowerName.includes('food') && !lowerName.includes('dining')) {
    authenticityScore -= 15;
    reasons.push('Generic food image');
  }
  
  // Timestamp patterns (often indicate uploads)
  if (/\d{10,13}/.test(lowerName)) {
    authenticityScore += 10;
    reasons.push('Timestamp pattern (uploaded file)');
  }
  
  // Image format quality indicators
  if (filename.endsWith('.jpg') || filename.endsWith('.jpeg')) {
    authenticityScore += 5;
    reasons.push('Standard photo format');
  }
  
  return {
    score: Math.max(0, Math.min(100, authenticityScore)),
    reasons: reasons,
    authentic: authenticityScore >= 40 // Threshold for authentic content
  };
}

function categorizeAuthenticImage(filename, analysis) {
  const lowerName = filename.toLowerCase();
  
  // Specific categorization based on content
  if (lowerName.includes('pool') || lowerName.includes('swimming')) return 'pool-deck';
  if (lowerName.includes('suite') && (lowerName.includes('family') || lowerName.includes('master'))) return 'family-suite';
  if (lowerName.includes('room') && lowerName.includes('group')) return 'group-room';
  if (lowerName.includes('room') && lowerName.includes('triple')) return 'triple-room';
  if (lowerName.includes('dining') || (lowerName.includes('food') && lowerName.includes('dining'))) return 'dining-area';
  if (lowerName.includes('garden') && lowerName.includes('lake')) return 'lake-garden';
  if (lowerName.includes('garden') && lowerName.includes('roof')) return 'roof-garden';
  if (lowerName.includes('garden') && lowerName.includes('front')) return 'front-garden';
  if (lowerName.includes('koggala') && lowerName.includes('lake')) return 'koggala-lake';
  if (lowerName.includes('excursion') || lowerName.includes('activity') || lowerName.includes('boat')) return 'excursions';
  if (lowerName.includes('room') || lowerName.includes('bedroom')) return 'accommodation';
  if (lowerName.includes('garden') || lowerName.includes('outdoor')) return 'lake-garden';
  
  return 'entire-villa'; // Default for general property images
}

function generateAuthenticTitle(filename, category) {
  let title = filename.replace(/\.[^/.]+$/, ""); // Remove extension
  
  // Clean common prefixes
  title = title.replace(/^\d+[-_]?/, '');
  title = title.replace(/^image_\d+/, '');
  title = title.replace(/^whatsapp\s*image\s*\d+.*?at\s*[\d.]+/i, '');
  title = title.replace(/^\d{10,13}[-_]?/, ''); // Remove timestamps
  
  // Convert underscores and dashes to spaces
  title = title.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  
  // Create descriptive titles based on category
  const categoryTitles = {
    'pool-deck': 'Swimming Pool & Deck Area',
    'family-suite': 'Master Family Suite',
    'group-room': 'Group Accommodation',
    'triple-room': 'Triple Room',
    'dining-area': 'Dining Experience',
    'lake-garden': 'Lakeside Gardens',
    'roof-garden': 'Rooftop Garden',
    'front-garden': 'Front Gardens',
    'koggala-lake': 'Koggala Lake Views',
    'excursions': 'Local Excursions',
    'accommodation': 'Guest Accommodation',
    'entire-villa': 'Ko Lake Villa'
  };
  
  const baseTitle = categoryTitles[category] || 'Ko Lake Villa';
  
  if (title && title.length > 3 && !title.match(/^\d+$/)) {
    return `${baseTitle} - ${title}`;
  } else {
    return baseTitle;
  }
}

async function recoverAuthenticImages() {
  console.log('🔍 Analyzing all images for authenticity...');
  
  // Scan all directories for images
  const allImages = [];
  
  function scanDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) return;
    
    const items = fs.readdirSync(dirPath, { withFileTypes: true });
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item.name);
      
      if (item.isDirectory() && !item.name.includes('node_modules') && !item.name.includes('.git')) {
        scanDirectory(fullPath);
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        
        if (['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext)) {
          const fileStats = fs.statSync(fullPath);
          allImages.push({
            filename: item.name,
            path: fullPath,
            size: fileStats.size,
            directory: path.dirname(fullPath)
          });
        }
      }
    }
  }
  
  scanDirectory('./attached_assets');
  scanDirectory('./uploads');
  scanDirectory('./images');
  scanDirectory('./static');
  
  console.log(`Found ${allImages.length} total image files`);
  
  // Analyze each image for authenticity
  const authenticImages = [];
  const rejectedImages = [];
  
  for (const image of allImages) {
    const fileStats = fs.statSync(image.path);
    const analysis = analyzeImageAuthenticity(image.filename, image.path, fileStats);
    
    if (analysis.authentic) {
      authenticImages.push({
        ...image,
        analysis: analysis,
        category: categorizeAuthenticImage(image.filename, analysis)
      });
    } else {
      rejectedImages.push({
        ...image,
        analysis: analysis
      });
    }
  }
  
  console.log(`\n📊 Authenticity Analysis Results:`);
  console.log(`✅ Authentic images identified: ${authenticImages.length}`);
  console.log(`❌ Non-authentic images rejected: ${rejectedImages.length}`);
  
  // Show sample of authentic images
  console.log(`\n✅ Sample authentic images:`);
  authenticImages.slice(0, 10).forEach(img => {
    console.log(`  ${img.filename} (score: ${img.analysis.score}) - ${img.analysis.reasons.join(', ')}`);
  });
  
  // Show sample of rejected images
  console.log(`\n❌ Sample rejected images:`);
  rejectedImages.slice(0, 5).forEach(img => {
    console.log(`  ${img.filename} (score: ${img.analysis.score}) - ${img.analysis.reasons.join(', ')}`);
  });
  
  return { authenticImages, rejectedImages };
}

async function cleanAndRestoreAuthentic() {
  console.log('🧹 Cleaning current gallery and restoring authentic images only...');
  
  // Get authentic images
  const { authenticImages, rejectedImages } = await recoverAuthenticImages();
  
  // Clear current gallery (keeping only essential records)
  console.log('Clearing non-authentic gallery entries...');
  
  // Get current gallery to identify non-authentic items
  const currentGallery = await fetch('http://localhost:5000/api/gallery').then(r => r.json());
  console.log(`Current gallery has ${currentGallery.length} items`);
  
  let cleaned = 0;
  let restored = 0;
  
  // Remove items that point to attached_assets (these were the bulk restored items)
  for (const item of currentGallery) {
    if (item.imageUrl && item.imageUrl.includes('/attached_assets/')) {
      try {
        const deleteResponse = await fetch(`http://localhost:5000/api/gallery/${item.id}`, {
          method: 'DELETE'
        });
        if (deleteResponse.ok) {
          cleaned++;
        }
      } catch (error) {
        console.log(`Failed to clean item ${item.id}`);
      }
    }
  }
  
  console.log(`🧹 Cleaned ${cleaned} non-authentic items`);
  
  // Restore only authentic images
  for (const image of authenticImages) {
    try {
      const webPath = image.path.startsWith('/') ? image.path : `/${image.path}`;
      const title = generateAuthenticTitle(image.filename, image.category);
      
      const imageData = {
        title: title,
        alt: `${title} - Authentic Ko Lake Villa property photo`,
        description: `Authentic property photography showcasing ${image.category.replace('-', ' ')} at Ko Lake Villa, Ahangama`,
        category: image.category,
        tags: `ko lake villa, authentic property, ${image.category.replace('-', ' ')}, sri lanka, accommodation`,
        mediaType: 'image',
        imageUrl: webPath,
        featured: image.analysis.score > 70,
        sortOrder: Math.round(image.analysis.score),
        displaySize: 'medium'
      };
      
      const response = await apiRequest('POST', '/api/gallery', imageData);
      
      if (response.ok) {
        restored++;
        if (restored % 10 === 0) {
          console.log(`✅ Restored ${restored} authentic images...`);
        }
      }
      
    } catch (error) {
      console.log(`Error restoring ${image.filename}:`, error.message);
    }
  }
  
  console.log(`\n✅ Authentic image recovery complete:`);
  console.log(`🧹 Cleaned: ${cleaned} non-authentic items`);
  console.log(`📸 Restored: ${restored} authentic images`);
  
  // Final verification
  const finalGallery = await fetch('http://localhost:5000/api/gallery').then(r => r.json());
  const finalImages = finalGallery.filter(item => item.mediaType === 'image');
  const finalVideos = finalGallery.filter(item => item.mediaType === 'video');
  
  console.log(`\n📊 Final authentic gallery:`);
  console.log(`📸 Authentic images: ${finalImages.length}`);
  console.log(`🎥 Videos: ${finalVideos.length}`);
  console.log(`📋 Total items: ${finalGallery.length}`);
  
  return {
    authenticCount: restored,
    cleanedCount: cleaned,
    finalTotal: finalGallery.length
  };
}

cleanAndRestoreAuthentic();