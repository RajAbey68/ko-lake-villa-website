/**
 * Gallery Edit Test - Debug the saving issue
 */

async function testGalleryEditing() {
  console.log('🧪 Testing Gallery Editing Functionality...\n');
  
  try {
    // First, get existing gallery images
    console.log('1. Fetching gallery images...');
    const galleryResponse = await fetch('/api/gallery');
    
    if (!galleryResponse.ok) {
      console.log('❌ Failed to fetch gallery images');
      return;
    }
    
    const images = await galleryResponse.json();
    console.log(`✅ Found ${images.length} images in gallery`);
    
    if (images.length === 0) {
      console.log('⚠️ No images to test editing with');
      return;
    }
    
    // Test editing the first image
    const testImage = images[0];
    console.log(`\n2. Testing edit on image ID: ${testImage.id}`);
    console.log('Original data:', {
      alt: testImage.alt,
      description: testImage.description,
      category: testImage.category,
      tags: testImage.tags,
      featured: testImage.featured
    });
    
    // Prepare test update data
    const updateData = {
      alt: testImage.alt + ' (EDITED)',
      description: (testImage.description || '') + ' Updated via test',
      category: testImage.category || 'family-suite',
      tags: (testImage.tags || 'test') + ',edited',
      featured: !testImage.featured
    };
    
    console.log('\n3. Sending PATCH request...');
    console.log('Update data:', updateData);
    
    // Send the PATCH request
    const updateResponse = await fetch(`/api/admin/gallery/${testImage.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    console.log(`Response status: ${updateResponse.status}`);
    
    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log('✅ Update successful!');
      console.log('Response:', result);
      
      // Verify the update by fetching the image again
      console.log('\n4. Verifying update...');
      const verifyResponse = await fetch('/api/gallery');
      const updatedImages = await verifyResponse.json();
      const updatedImage = updatedImages.find(img => img.id === testImage.id);
      
      if (updatedImage) {
        console.log('✅ Update verified!');
        console.log('Updated data:', {
          alt: updatedImage.alt,
          description: updatedImage.description,
          category: updatedImage.category,
          tags: updatedImage.tags,
          featured: updatedImage.featured
        });
        
        // Check if changes were actually saved
        const changes = [];
        if (updatedImage.alt !== testImage.alt) changes.push('title');
        if (updatedImage.description !== testImage.description) changes.push('description');
        if (updatedImage.category !== testImage.category) changes.push('category');
        if (updatedImage.tags !== testImage.tags) changes.push('tags');
        if (updatedImage.featured !== testImage.featured) changes.push('featured');
        
        if (changes.length > 0) {
          console.log(`✅ Successfully updated: ${changes.join(', ')}`);
        } else {
          console.log('⚠️ No changes detected in the data');
        }
      } else {
        console.log('❌ Could not find updated image');
      }
      
    } else {
      const errorText = await updateResponse.text();
      console.log(`❌ Update failed: ${updateResponse.status}`);
      console.log('Error response:', errorText);
    }
    
  } catch (error) {
    console.log(`❌ Test failed with error: ${error.message}`);
  }
}

// Test category mapping issue
async function testCategoryMapping() {
  console.log('\n🏷️ Testing Category Mapping...\n');
  
  const categories = [
    "Family Suite",
    "Group Room", 
    "Triple Room",
    "Dining Area",
    "Pool Deck",
    "Lake Garden",
    "Roof Garden",
    "Front Garden and Entrance",
    "Koggala Lake and Surrounding",
    "Excursions"
  ];
  
  console.log('Available categories in dialog:', categories);
  
  // Check if there's a mismatch between dialog categories and backend categories
  try {
    const response = await fetch('/api/gallery');
    const images = await response.json();
    
    const usedCategories = [...new Set(images.map(img => img.category))];
    console.log('Categories in use by images:', usedCategories);
    
    // Check for mismatches
    const mismatches = usedCategories.filter(cat => 
      !categories.some(dialogCat => 
        dialogCat.toLowerCase().replace(/\s+/g, '-') === cat ||
        dialogCat === cat
      )
    );
    
    if (mismatches.length > 0) {
      console.log('⚠️ Category mismatches found:', mismatches);
    } else {
      console.log('✅ All categories match correctly');
    }
    
  } catch (error) {
    console.log(`❌ Category test failed: ${error.message}`);
  }
}

// Run both tests
console.log('🏝️ Ko Lake Villa - Gallery Edit Debugging\n');
testGalleryEditing().then(() => {
  testCategoryMapping();
});

// Make functions available globally
window.testGalleryEditing = testGalleryEditing;
window.testCategoryMapping = testCategoryMapping;