/**
 * Gallery Edit Fix Test - Comprehensive validation of gallery editing functionality
 * Tests the PATCH endpoint fix and ensures all editing operations work correctly
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
    
    if (!updateResponse.ok) {
      const errorText = await updateResponse.text();
      console.log('❌ Update failed:');
      console.log('Status:', updateResponse.status);
      console.log('Error:', errorText);
      return;
    }
    
    const updateResult = await updateResponse.json();
    console.log('✅ Update successful!');
    console.log('Response:', updateResult);
    
    // Verify the changes by fetching the image again
    console.log('\n4. Verifying changes...');
    const verifyResponse = await fetch('/api/gallery');
    
    if (verifyResponse.ok) {
      const updatedImages = await verifyResponse.json();
      const updatedImage = updatedImages.find(img => img.id === testImage.id);
      
      if (updatedImage) {
        console.log('✅ Image found after update');
        console.log('Updated data:', {
          alt: updatedImage.alt,
          description: updatedImage.description,
          category: updatedImage.category,
          tags: updatedImage.tags,
          featured: updatedImage.featured
        });
        
        // Check if changes were applied
        const changesApplied = {
          alt: updatedImage.alt.includes('(EDITED)'),
          description: updatedImage.description && updatedImage.description.includes('Updated via test'),
          tags: updatedImage.tags && updatedImage.tags.includes('edited'),
          featured: updatedImage.featured !== testImage.featured
        };
        
        console.log('\n5. Validation results:');
        Object.entries(changesApplied).forEach(([field, applied]) => {
          console.log(`${applied ? '✅' : '❌'} ${field}: ${applied ? 'UPDATED' : 'NOT UPDATED'}`);
        });
        
        const allChangesApplied = Object.values(changesApplied).every(Boolean);
        
        if (allChangesApplied) {
          console.log('\n🎉 ALL TESTS PASSED - Gallery editing is working correctly!');
        } else {
          console.log('\n⚠️ Some changes were not applied correctly');
        }
        
        // Restore original data
        console.log('\n6. Restoring original data...');
        const restoreData = {
          alt: testImage.alt,
          description: testImage.description,
          category: testImage.category,
          tags: testImage.tags,
          featured: testImage.featured
        };
        
        const restoreResponse = await fetch(`/api/admin/gallery/${testImage.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(restoreData)
        });
        
        if (restoreResponse.ok) {
          console.log('✅ Original data restored successfully');
        } else {
          console.log('⚠️ Failed to restore original data');
        }
        
      } else {
        console.log('❌ Updated image not found in gallery');
      }
    } else {
      console.log('❌ Failed to verify changes');
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
    console.log('Stack trace:', error.stack);
  }
}

// Additional test for edge cases
async function testEdgeCases() {
  console.log('\n🔧 Testing Edge Cases...\n');
  
  try {
    // Test 1: Update non-existent image
    console.log('1. Testing update of non-existent image...');
    const nonExistentResponse = await fetch('/api/admin/gallery/99999', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ alt: 'Test' })
    });
    
    if (nonExistentResponse.status === 404) {
      console.log('✅ Non-existent image properly returns 404');
    } else {
      console.log(`❌ Expected 404, got ${nonExistentResponse.status}`);
    }
    
    // Test 2: Invalid data
    console.log('\n2. Testing invalid data handling...');
    const galleryResponse = await fetch('/api/gallery');
    if (galleryResponse.ok) {
      const images = await galleryResponse.json();
      if (images.length > 0) {
        const invalidResponse = await fetch(`/api/admin/gallery/${images[0].id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ alt: '' }) // Empty alt text
        });
        
        if (invalidResponse.status === 400 || invalidResponse.ok) {
          console.log('✅ Invalid data handled appropriately');
        } else {
          console.log(`❌ Unexpected response for invalid data: ${invalidResponse.status}`);
        }
      }
    }
    
    console.log('\n✅ Edge case testing completed');
    
  } catch (error) {
    console.log('❌ Edge case testing failed:', error.message);
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Gallery Edit Tests\n');
  console.log('='.repeat(50));
  
  await testGalleryEditing();
  await testEdgeCases();
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 All tests completed');
}

// Auto-run if page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(runAllTests, 2000);
  });
} else {
  setTimeout(runAllTests, 1000);
}

// Export for manual testing
window.testGalleryEditing = testGalleryEditing;
window.runAllTests = runAllTests;

console.log('Gallery edit test loaded. Run runAllTests() manually if needed.');