/**
 * Emergency Gallery Restore - Quick Fix
 * Restores gallery with working sample images
 */

async function apiRequest(method, endpoint, body = null) {
  const baseUrl = 'http://localhost:5000';
  const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  try {
    const response = await fetch(fullUrl, options);
    const text = await response.text();
    let data = null;
    
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
    
    return { response, data };
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
}

async function emergencyRestore() {
  console.log('🚨 Emergency Gallery Restore Starting...\n');

  try {
    // Step 1: Clear broken gallery
    console.log('1. Clearing broken gallery...');
    const { response: clearResponse } = await apiRequest('DELETE', '/api/gallery/clear-all');
    
    if (clearResponse.ok) {
      console.log('✅ Gallery cleared successfully');
    } else {
      console.log('❌ Failed to clear gallery');
    }

    // Step 2: Add sample images for each category
    console.log('\n2. Adding sample images for each category...');
    
    const categories = [
      'entire-villa',
      'family-suite', 
      'group-room',
      'triple-room',
      'dining-area',
      'pool-deck',
      'lake-garden',
      'roof-garden',
      'front-garden',
      'koggala-lake',
      'excursions'
    ];

    let successCount = 0;
    
    for (const category of categories) {
      try {
        const { response: addResponse } = await apiRequest('POST', '/api/admin/add-sample-image', {
          category: category
        });
        
        if (addResponse.ok) {
          console.log(`✅ Added sample image for: ${category}`);
          successCount++;
        } else {
          console.log(`❌ Failed to add sample for: ${category}`);
        }
      } catch (error) {
        console.log(`❌ Error adding sample for ${category}: ${error.message}`);
      }
    }

    // Step 3: Verify restoration
    console.log('\n3. Verifying gallery restoration...');
    
    const { response: galleryResponse, data: gallery } = await apiRequest('GET', '/api/gallery');
    
    if (galleryResponse.ok && Array.isArray(gallery)) {
      console.log(`✅ Gallery restored with ${gallery.length} images`);
      
      // Test first image accessibility
      if (gallery.length > 0) {
        const testImage = gallery[0];
        try {
          const imageUrl = `http://localhost:5000${testImage.imageUrl}`;
          const imageResponse = await fetch(imageUrl);
          
          if (imageResponse.ok) {
            console.log('✅ Sample image is accessible');
          } else {
            console.log('❌ Sample image not accessible');
          }
        } catch (error) {
          console.log('❌ Image accessibility test failed');
        }
      }
    } else {
      console.log('❌ Failed to verify gallery restoration');
    }

    console.log('\n📊 RESTORATION SUMMARY:');
    console.log('=====================');
    console.log(`Successfully added: ${successCount}/${categories.length} categories`);
    console.log(`Total images in gallery: ${gallery ? gallery.length : 0}`);
    
    if (successCount > 0) {
      console.log('\n🎉 EMERGENCY RESTORATION COMPLETE');
      console.log('Gallery should now be functional for uploads and editing');
    } else {
      console.log('\n🔧 RESTORATION FAILED');
      console.log('Please check server configuration');
    }

  } catch (error) {
    console.log(`\n💥 EMERGENCY RESTORE FAILED: ${error.message}`);
  }
}

emergencyRestore();