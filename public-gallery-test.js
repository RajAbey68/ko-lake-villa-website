/**
 * Public Gallery Test Suite
 * Tests gallery functionality, filtering, and modal interactions
 */

async function testPublicGallery() {
  console.log('🖼️ Testing Public Gallery Functionality...\n');

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
    // Test Gallery API
    const galleryResponse = await fetch('http://localhost:5000/api/gallery');
    const images = await galleryResponse.json();
    logTest('Gallery API loads', galleryResponse.ok, `${images.length} images returned`);

    // Test image categories
    const categories = [...new Set(images.map(img => img.category))];
    logTest('Image categories available', categories.length > 0, `Categories: ${categories.join(', ')}`);

    // Test image data integrity
    const validImages = images.filter(img => img.imageUrl && img.title);
    logTest('Image data integrity', validImages.length === images.length, `${validImages.length}/${images.length} valid`);

    // Test filtering functionality
    const uniqueCategories = categories.length;
    logTest('Category filtering possible', uniqueCategories > 1, `${uniqueCategories} unique categories`);

    // Test image URLs accessibility
    if (images.length > 0) {
      const sampleImage = images[0];
      const imageResponse = await fetch(`http://localhost:5000${sampleImage.imageUrl}`);
      logTest('Image files accessible', imageResponse.ok, `Sample image loads: ${sampleImage.title}`);
    }

    // Test video content
    const videos = images.filter(img => img.isVideo);
    logTest('Video content available', videos.length > 0, `${videos.length} videos found`);

  } catch (error) {
    logTest('Gallery test execution', false, error.message);
  }

  console.log('\n======================================================================');
  console.log('PUBLIC GALLERY TEST RESULTS');
  console.log('======================================================================');
  console.log(`✅ PASSED: ${results.passed}`);
  console.log(`❌ FAILED: ${results.failed}`);
  console.log(`📊 TOTAL: ${results.tests.length}`);
  
  if (results.failed === 0) {
    console.log('\n🎉 PUBLIC GALLERY READY FOR DEPLOYMENT!');
  } else {
    console.log('\n⚠️ Issues found that should be addressed');
  }

  return results;
}

testPublicGallery();