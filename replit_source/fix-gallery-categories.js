/**
 * Fix Gallery Categories - Update items with proper category assignments
 */

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

function determineCategory(title, filename) {
  const lowerTitle = title.toLowerCase();
  const lowerFilename = filename.toLowerCase();
  
  // Lake and drone footage
  if (lowerTitle.includes('drone') || lowerTitle.includes('lake') || 
      lowerFilename.includes('drone') || lowerFilename.includes('lake')) {
    return 'koggala-lake';
  }
  
  // Pool areas
  if (lowerTitle.includes('pool') || lowerFilename.includes('pool')) {
    return 'pool-deck';
  }
  
  // Dining areas
  if (lowerTitle.includes('dining') || lowerFilename.includes('dining') ||
      lowerTitle.includes('breakfast') || lowerTitle.includes('meal')) {
    return 'dining-area';
  }
  
  // Suite/bedroom areas
  if (lowerTitle.includes('suite') || lowerTitle.includes('bedroom') ||
      lowerTitle.includes('family') || lowerFilename.includes('suite')) {
    return 'family-suite';
  }
  
  // Garden areas
  if (lowerTitle.includes('garden') || lowerFilename.includes('garden')) {
    return 'lake-garden';
  }
  
  // Exterior/architecture
  if (lowerTitle.includes('exterior') || lowerTitle.includes('villa') ||
      lowerTitle.includes('architecture') || lowerTitle.includes('building')) {
    return 'exterior';
  }
  
  // Default category for general property images
  return 'entire-villa';
}

function generateImprovedDescription(title, category, isVideo) {
  const descriptions = {
    'koggala-lake': isVideo ? 
      'Stunning aerial footage of Koggala Lake surrounding Ko Lake Villa, showcasing the pristine natural beauty and tranquil waters.' :
      'Breathtaking views of Koggala Lake from Ko Lake Villa, featuring crystal-clear waters and lush tropical surroundings.',
    'pool-deck': isVideo ?
      'Video tour of the luxurious pool deck at Ko Lake Villa, highlighting the infinity pool design and stunning lake views.' :
      'The magnificent pool deck at Ko Lake Villa with infinity pool overlooking Koggala Lake, perfect for relaxation.',
    'dining-area': isVideo ?
      'Virtual tour of the elegant dining area at Ko Lake Villa, showcasing the perfect blend of indoor and outdoor dining.' :
      'Elegant dining area at Ko Lake Villa featuring traditional Sri Lankan architecture with modern comfort and lake views.',
    'family-suite': isVideo ?
      'Comprehensive tour of the spacious family suite at Ko Lake Villa, designed for comfort and luxury accommodation.' :
      'Spacious and beautifully appointed family suite at Ko Lake Villa, featuring modern amenities and traditional design.',
    'lake-garden': isVideo ?
      'Peaceful garden walkthrough showcasing the lush tropical landscaping that surrounds Ko Lake Villa.' :
      'Beautifully landscaped gardens at Ko Lake Villa featuring native Sri Lankan flora and peaceful pathways.',
    'exterior': isVideo ?
      'Architectural tour showcasing the stunning exterior design of Ko Lake Villa and its integration with nature.' :
      'Traditional Sri Lankan architecture of Ko Lake Villa beautifully integrated with modern luxury amenities.',
    'entire-villa': isVideo ?
      'Complete tour of Ko Lake Villa showcasing the luxury lakeside retreat in its entirety.' :
      'Ko Lake Villa in its full splendor - a luxury lakeside retreat offering exceptional accommodation in Ahangama.'
  };
  
  return descriptions[category] || descriptions['entire-villa'];
}

async function fixGalleryCategories() {
  console.log('🏷️ Fixing Gallery Categories\n');
  
  const galleryItems = await apiRequest('GET', '/api/gallery');
  console.log(`📊 Found ${galleryItems.length} gallery items to categorize`);
  
  let updated = 0;
  const categoryCount = {};
  
  for (const item of galleryItems) {
    const isVideo = item.mediaType === 'video';
    const newCategory = determineCategory(item.title, item.imageUrl);
    const newDescription = generateImprovedDescription(item.title, newCategory, isVideo);
    const newTags = `ko lake villa, sri lanka, ${newCategory.replace('-', ' ')}, luxury accommodation, lakeside retreat, ahangama`;
    
    // Count categories
    categoryCount[newCategory] = (categoryCount[newCategory] || 0) + 1;
    
    try {
      await apiRequest('PUT', `/api/gallery/${item.id}`, {
        ...item,
        category: newCategory,
        description: newDescription,
        tags: newTags
      });
      console.log(`✅ Updated: ${item.title} -> ${newCategory}`);
      updated++;
    } catch (error) {
      console.log(`❌ Failed to update ${item.title}: ${error.message}`);
    }
  }
  
  console.log(`\n📊 Update Results:`);
  console.log(`✅ Updated: ${updated} items`);
  console.log('\n🏷️ Category Distribution:');
  Object.entries(categoryCount).forEach(([category, count]) => {
    console.log(`  ${category}: ${count} items`);
  });
  
  // Test category filtering
  console.log('\n🧪 Testing Category Filtering:');
  const testCategories = ['koggala-lake', 'family-suite', 'dining-area', 'pool-deck', 'entire-villa'];
  for (const category of testCategories) {
    const filtered = await apiRequest('GET', `/api/gallery?category=${category}`);
    console.log(`  ${category}: ${filtered.length} items`);
  }
  
  console.log('\n🎉 Gallery categories fixed successfully!');
}

fixGalleryCategories().catch(console.error);