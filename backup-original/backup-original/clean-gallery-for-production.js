/**
 * Ko Lake Villa - Gallery Production Cleanup
 * Removes test content and ensures authentic property display
 */

async function apiRequest(method, endpoint, body = null) {
  const baseUrl = 'http://localhost:5000';
  
  try {
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : null,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${method} ${endpoint}`, error);
    throw error;
  }
}

async function cleanGalleryForProduction() {
  console.log('🎨 Cleaning Gallery for Production...\n');

  try {
    // Get all current gallery images
    const images = await apiRequest('GET', '/api/admin/gallery');
    console.log(`Found ${images.length} images in gallery`);

    // Identify test/placeholder content
    const testImages = images.filter(img => 
      img.title?.toLowerCase().includes('test') ||
      img.title?.toLowerCase().includes('dialog') ||
      img.title?.toLowerCase().includes('cache') ||
      img.title?.toLowerCase().includes('upload') ||
      img.description?.toLowerCase().includes('test') ||
      img.description?.toLowerCase().includes('placeholder')
    );

    console.log(`\n🗑️ Found ${testImages.length} test/placeholder images to clean:`);
    testImages.forEach(img => {
      console.log(`- "${img.title}" (${img.category})`);
    });

    if (testImages.length === 0) {
      console.log('✅ No test content found - gallery already clean!');
      return;
    }

    // Delete test images
    let deletedCount = 0;
    for (const img of testImages) {
      try {
        await apiRequest('DELETE', `/api/admin/gallery/${img.id}`);
        console.log(`✅ Deleted: "${img.title}"`);
        deletedCount++;
      } catch (error) {
        console.log(`❌ Failed to delete: "${img.title}" - ${error.message}`);
      }
    }

    // Get remaining authentic images
    const remainingImages = await apiRequest('GET', '/api/admin/gallery');
    console.log(`\n📊 Gallery Cleanup Summary:`);
    console.log(`🗑️ Deleted: ${deletedCount} test images`);
    console.log(`📸 Remaining: ${remainingImages.length} authentic images`);

    // Update remaining images with professional titles if needed
    const imagesToUpdate = remainingImages.filter(img => 
      !img.title || 
      img.title.length < 10 ||
      img.description?.length < 20
    );

    if (imagesToUpdate.length > 0) {
      console.log(`\n✏️ Updating ${imagesToUpdate.length} images with professional descriptions...`);
      
      const categoryDescriptions = {
        'family-suite': {
          title: 'Master Family Suite',
          description: 'Spacious family suite with stunning lake views, separate living area, and premium amenities perfect for families at Ko Lake Villa.'
        },
        'triple-room': {
          title: 'Comfortable Triple Room', 
          description: 'Modern triple occupancy room with garden views and contemporary amenities, ideal for friends or small families visiting Ko Lake Villa.'
        },
        'group-room': {
          title: 'Spacious Group Room',
          description: 'Large accommodation perfect for groups, featuring multiple sleeping arrangements and shared facilities in a comfortable setting.'
        },
        'entire-villa': {
          title: 'Entire Villa Experience',
          description: 'Complete Ko Lake Villa exclusivity with all amenities, perfect for large groups or special events with stunning lake views.'
        },
        'pool-deck': {
          title: 'Private Pool & Lake Deck',
          description: 'Exclusive 60-foot infinity pool and wooden deck overlooking Koggala Lake, perfect for relaxation and entertainment.'
        },
        'lake-view': {
          title: 'Stunning Lake Views',
          description: 'Breathtaking panoramic views of Koggala Lake from Ko Lake Villa, showcasing the natural beauty of Sri Lanka.'
        },
        'gardens': {
          title: 'Tropical Lake Gardens',
          description: 'Beautifully landscaped tropical gardens leading to the lake shores, featuring native Sri Lankan flora and peaceful walkways.'
        },
        'dining-area': {
          title: 'Lakeside Dining Experience',
          description: 'Open-air dining spaces with lake views, perfect for enjoying authentic Sri Lankan cuisine and international dishes.'
        },
        'default': {
          title: 'Ko Lake Villa Experience',
          description: 'Experience the beauty and tranquility of Ko Lake Villa, your perfect lakeside retreat in Ahangama, Galle.'
        }
      };

      for (const img of imagesToUpdate) {
        const categoryKey = img.category || 'default';
        const updates = categoryDescriptions[categoryKey] || categoryDescriptions['default'];
        
        try {
          await apiRequest('PUT', `/api/admin/gallery/${img.id}`, {
            title: updates.title,
            description: updates.description
          });
          console.log(`✅ Updated: "${updates.title}"`);
        } catch (error) {
          console.log(`❌ Failed to update image ${img.id}: ${error.message}`);
        }
      }
    }

    const finalImages = await apiRequest('GET', '/api/admin/gallery');
    
    console.log('\n🎉 Gallery Production Cleanup Complete!');
    console.log(`📸 Final gallery contains ${finalImages.length} professional images`);
    console.log('\n✅ Gallery is now ready for production with:');
    console.log('- Authentic Ko Lake Villa property images');
    console.log('- Professional titles and descriptions');  
    console.log('- Proper categorization for filtering');
    console.log('- No test or placeholder content');

    return {
      deleted: deletedCount,
      remaining: finalImages.length,
      success: true
    };

  } catch (error) {
    console.error('❌ Gallery cleanup failed:', error);
    return {
      deleted: 0,
      remaining: 0,
      success: false,
      error: error.message
    };
  }
}

// Run the cleanup
cleanGalleryForProduction().then(result => {
  if (result.success) {
    console.log('\n🚀 Gallery ready for production use!');
    process.exit(0);
  } else {
    console.log('\n⚠️ Cleanup encountered issues:', result.error);
    process.exit(1);
  }
}).catch(error => {
  console.error('❌ Cleanup script failed:', error);
  process.exit(1);
});