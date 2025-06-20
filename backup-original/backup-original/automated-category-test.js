/**
 * Automated Category Persistence Test
 * Tests the category editing fix without requiring UI interaction
 */

async function apiRequest(method, endpoint, body = null) {
  const url = `http://localhost:5000${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function testCategoryPersistence() {
  console.log('🧪 Starting Automated Category Persistence Test...');
  
  try {
    // Step 1: Get current gallery images
    console.log('📋 Fetching gallery images...');
    const images = await apiRequest('GET', '/api/gallery');
    
    if (images.length === 0) {
      console.log('❌ No images found in gallery to test');
      return;
    }
    
    const testImage = images[0];
    console.log(`📸 Testing with image: ${testImage.alt} (ID: ${testImage.id})`);
    console.log(`📝 Current category: ${testImage.category}`);
    
    // Step 2: Change category to something different
    const originalCategory = testImage.category;
    const newCategory = originalCategory === 'pool-deck' ? 'triple-room' : 'pool-deck';
    
    console.log(`🔄 Changing category from "${originalCategory}" to "${newCategory}"`);
    
    // Step 3: Update the image with new category
    const updateData = {
      category: newCategory,
      alt: testImage.alt,
      description: testImage.description || '',
      tags: newCategory + ',test',
      featured: testImage.featured || false,
      sortOrder: testImage.sortOrder || 1
    };
    
    console.log('💾 Sending update request...');
    await apiRequest('PATCH', `/api/admin/gallery/${testImage.id}`, updateData);
    console.log('✅ Update request completed');
    
    // Step 4: Wait a moment then fetch the updated image
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('🔍 Fetching updated gallery to verify persistence...');
    const updatedImages = await apiRequest('GET', '/api/gallery');
    const updatedImage = updatedImages.find(img => img.id === testImage.id);
    
    if (!updatedImage) {
      console.log('❌ Could not find updated image');
      return;
    }
    
    // Step 5: Verify the category persisted
    console.log(`📊 Results:`);
    console.log(`   Original category: ${originalCategory}`);
    console.log(`   Expected category: ${newCategory}`);
    console.log(`   Actual category:   ${updatedImage.category}`);
    
    if (updatedImage.category === newCategory) {
      console.log('🎉 ✅ CATEGORY PERSISTENCE TEST PASSED!');
      console.log('   Category successfully persisted after update');
      
      // Restore original category
      console.log('🔄 Restoring original category...');
      const restoreData = {
        ...updateData,
        category: originalCategory,
        tags: originalCategory
      };
      await apiRequest('PATCH', `/api/admin/gallery/${testImage.id}`, restoreData);
      console.log('✅ Original category restored');
      
    } else {
      console.log('❌ ❌ CATEGORY PERSISTENCE TEST FAILED!');
      console.log('   Category reverted to original value');
      console.log('   The API endpoint fix may need further investigation');
    }
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

// Run the test
testCategoryPersistence();