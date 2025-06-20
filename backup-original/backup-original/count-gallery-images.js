
#!/usr/bin/env node

/**
 * Ko Lake Villa Gallery Image Counter
 * Counts all images in the production database
 */

async function countGalleryImages() {
  const baseUrl = 'http://localhost:5000';
  
  try {
    console.log('🔍 Counting gallery images in production database...\n');
    
    // Fetch all gallery images from the API
    const response = await fetch(`${baseUrl}/api/gallery`);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const images = await response.json();
    
    if (!Array.isArray(images)) {
      throw new Error('Unexpected response format - not an array');
    }
    
    console.log(`📊 Total Images in Database: ${images.length}`);
    console.log('=====================================\n');
    
    // Count by category
    const categoryCount = {};
    const mediaTypeCount = { image: 0, video: 0 };
    
    images.forEach(img => {
      // Count by category
      const category = img.category || 'uncategorized';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
      
      // Count by media type
      const mediaType = img.mediaType || 'image';
      mediaTypeCount[mediaType] = (mediaTypeCount[mediaType] || 0) + 1;
    });
    
    // Display category breakdown
    console.log('📁 Images by Category:');
    console.log('---------------------');
    Object.entries(categoryCount)
      .sort(([,a], [,b]) => b - a)
      .forEach(([category, count]) => {
        console.log(`${category.padEnd(20)}: ${count} images`);
      });
    
    console.log('\n🎬 Images by Media Type:');
    console.log('------------------------');
    console.log(`Images: ${mediaTypeCount.image}`);
    console.log(`Videos: ${mediaTypeCount.video}`);
    
    // Show featured images
    const featuredImages = images.filter(img => img.featured);
    console.log(`\n⭐ Featured Images: ${featuredImages.length}`);
    
    // Show recent additions (if timestamps available)
    const recentImages = images.filter(img => {
      if (!img.createdAt && !img.updatedAt) return false;
      const timestamp = img.updatedAt || img.createdAt;
      const imageDate = new Date(timestamp);
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return imageDate > oneDayAgo;
    });
    
    if (recentImages.length > 0) {
      console.log(`\n🆕 Recent additions (last 24h): ${recentImages.length}`);
    }
    
    // Check for any issues
    const issuesFound = [];
    const imagesWithoutAlt = images.filter(img => !img.alt || img.alt.trim() === '');
    const imagesWithoutCategory = images.filter(img => !img.category);
    const imagesWithoutTitle = images.filter(img => !img.title);
    
    if (imagesWithoutAlt.length > 0) {
      issuesFound.push(`${imagesWithoutAlt.length} images missing alt text`);
    }
    if (imagesWithoutCategory.length > 0) {
      issuesFound.push(`${imagesWithoutCategory.length} images missing category`);
    }
    if (imagesWithoutTitle.length > 0) {
      issuesFound.push(`${imagesWithoutTitle.length} images missing title`);
    }
    
    if (issuesFound.length > 0) {
      console.log('\n⚠️  Issues Found:');
      console.log('------------------');
      issuesFound.forEach(issue => console.log(`- ${issue}`));
    }
    
    console.log('\n✅ Gallery image count completed successfully!');
    
    return {
      total: images.length,
      byCategory: categoryCount,
      byMediaType: mediaTypeCount,
      featured: featuredImages.length,
      recent: recentImages.length,
      issues: issuesFound
    };
    
  } catch (error) {
    console.error('❌ Error counting gallery images:', error.message);
    
    // Try to provide helpful troubleshooting
    if (error.message.includes('fetch')) {
      console.log('\n💡 Troubleshooting:');
      console.log('- Make sure the development server is running (npm run dev)');
      console.log('- Check if the API is accessible at http://localhost:5000/api/gallery');
    }
    
    return null;
  }
}

// Run the count if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  countGalleryImages();
}

export { countGalleryImages };
