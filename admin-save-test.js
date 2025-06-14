/**
 * Admin Gallery Save Functionality Test
 * Verifies that admin modifications actually save to database
 */

async function testAdminSaveFunctionality() {
  console.log('🔧 Testing Admin Gallery Save Functionality...\n');

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function logTest(test, passed, details = '') {
    const status = passed ? '✅' : '❌';
    console.log(`${status} ${test}: ${details}`);
    results.tests.push({ test, passed, details });
    if (passed) results.passed++;
    else results.failed++;
  }

  try {
    // Get initial image data
    const galleryResponse = await fetch('http://localhost:5000/api/gallery');
    const images = await galleryResponse.json();
    
    if (images.length === 0) {
      logTest('Initial data check', false, 'No images found in gallery');
      return results;
    }

    const testImage = images[0];
    const originalTitle = testImage.title;
    const originalDescription = testImage.description;
    
    logTest('Initial data loaded', true, `Testing image ID: ${testImage.id}`);

    // Test 1: Update image metadata
    const updateData = {
      title: 'TEST SAVE FUNCTION - Ko Lake Villa',
      description: 'Testing admin save functionality - should persist',
      category: testImage.category,
      tags: ['test', 'admin', 'save-function']
    };

    const updateResponse = await fetch(`http://localhost:5000/api/gallery/${testImage.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });

    logTest('Update request sent', updateResponse.ok, `Status: ${updateResponse.status}`);

    // Test 2: Verify changes persisted
    const verifyResponse = await fetch('http://localhost:5000/api/gallery');
    const updatedImages = await verifyResponse.json();
    const updatedImage = updatedImages.find(img => img.id === testImage.id);

    const titleSaved = updatedImage.title === updateData.title;
    const descriptionSaved = updatedImage.description === updateData.description;
    
    logTest('Title change persisted', titleSaved, `New title: ${updatedImage.title}`);
    logTest('Description change persisted', descriptionSaved, `Description updated`);

    // Test 3: Restore original data
    const restoreData = {
      title: originalTitle,
      description: originalDescription,
      category: testImage.category,
      tags: testImage.tags || []
    };

    const restoreResponse = await fetch(`http://localhost:5000/api/gallery/${testImage.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(restoreData)
    });

    logTest('Data restoration', restoreResponse.ok, 'Original data restored');

    // Test 4: Test bulk operations endpoint
    const bulkTestResponse = await fetch('http://localhost:5000/api/gallery/bulk-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        action: 'test',
        ids: [testImage.id]
      })
    });

    logTest('Bulk operations endpoint', bulkTestResponse.status !== 404, `Status: ${bulkTestResponse.status}`);

  } catch (error) {
    logTest('Admin save test execution', false, error.message);
  }

  console.log('\n======================================================================');
  console.log('ADMIN SAVE FUNCTIONALITY TEST RESULTS');
  console.log('======================================================================');
  console.log(`✅ PASSED: ${results.passed}`);
  console.log(`❌ FAILED: ${results.failed}`);
  console.log(`📊 TOTAL: ${results.tests.length}`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ADMIN SAVE FUNCTIONALITY WORKING!');
  } else {
    console.log('\n⚠️ Admin save issues detected');
  }

  return results;
}

testAdminSaveFunctionality();