/**
 * Ko Lake Villa - Image Zoom Fix Verification Test
 * Tests that images and videos display properly without unwanted zoom/crop
 */

async function testImageZoomFix() {
  console.log('🔍 Testing Image Zoom Fix...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function logTest(testName, passed, details = '') {
    results.tests.push({ testName, passed, details });
    if (passed) {
      results.passed++;
      console.log(`✅ ${testName}: ${details}`);
    } else {
      results.failed++;
      console.log(`❌ ${testName}: ${details}`);
    }
  }

  // Test 1: Gallery Modal Image Scaling
  console.log('Testing Gallery Modal Image Scaling...');
  try {
    // Navigate to gallery page
    window.history.pushState({}, '', '/gallery');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if gallery images are present
    const galleryImages = document.querySelectorAll('[data-testid="gallery-image"], img');
    
    if (galleryImages.length > 0) {
      logTest('Gallery Images Present', true, `Found ${galleryImages.length} images`);
      
      // Check CSS classes for proper scaling
      const hasProperCSSClasses = document.querySelector('.object-contain') !== null;
      logTest('Proper CSS Classes Applied', hasProperCSSClasses, 'object-contain classes found');
      
    } else {
      logTest('Gallery Images Present', false, 'No gallery images found');
    }
  } catch (error) {
    logTest('Gallery Modal Test', false, `Error: ${error.message}`);
  }

  // Test 2: Modal Styling Verification
  console.log('\nTesting Modal Styling...');
  try {
    // Check for modal components in DOM
    const modalElements = document.querySelectorAll('[role="dialog"], .fixed.inset-0');
    
    if (modalElements.length > 0) {
      logTest('Modal Elements Present', true, `Found ${modalElements.length} modal elements`);
    } else {
      logTest('Modal Elements Present', false, 'No modal elements found');
    }

    // Check for proper viewport calculations
    const viewportStyles = Array.from(document.querySelectorAll('*')).some(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('calc(100vh') || style.includes('calc(100vw');
    });
    
    logTest('Viewport Calculations Present', viewportStyles, 'Found viewport-based styling');
    
  } catch (error) {
    logTest('Modal Styling Test', false, `Error: ${error.message}`);
  }

  // Test 3: API Gallery Data Quality
  console.log('\nTesting Gallery API Data...');
  try {
    const response = await fetch('/api/gallery');
    const data = await response.json();
    
    if (Array.isArray(data) && data.length > 0) {
      logTest('Gallery API Working', true, `${data.length} items returned`);
      
      // Check for proper image URLs
      const validImages = data.filter(item => item.imageUrl && !item.imageUrl.includes('undefined'));
      logTest('Valid Image URLs', validImages.length === data.length, 
        `${validImages.length}/${data.length} images have valid URLs`);
      
      // Check for video content
      const videos = data.filter(item => 
        item.mediaType === 'video' || 
        item.imageUrl?.endsWith('.mp4') || 
        item.imageUrl?.endsWith('.mov')
      );
      logTest('Video Content Available', videos.length > 0, `${videos.length} videos found`);
      
    } else {
      logTest('Gallery API Working', false, 'No gallery data returned');
    }
  } catch (error) {
    logTest('Gallery API Test', false, `Error: ${error.message}`);
  }

  // Test 4: Room Modal Image Display
  console.log('\nTesting Room Modal Images...');
  try {
    // Navigate to accommodation page
    window.history.pushState({}, '', '/accommodation');
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check for room cards
    const roomCards = document.querySelectorAll('[data-testid="room-card"], .cursor-pointer');
    
    if (roomCards.length > 0) {
      logTest('Room Cards Present', true, `Found ${roomCards.length} room cards`);
      
      // Check for proper image styling in room modals
      const roomImages = document.querySelectorAll('img[alt*="Image"]');
      const properlyStyledRoomImages = Array.from(roomImages).filter(img => 
        img.className.includes('object-contain')
      );
      
      logTest('Room Images Properly Styled', properlyStyledRoomImages.length > 0, 
        `${properlyStyledRoomImages.length} properly styled room images`);
        
    } else {
      logTest('Room Cards Present', false, 'No room cards found');
    }
  } catch (error) {
    logTest('Room Modal Test', false, `Error: ${error.message}`);
  }

  // Test 5: Video Modal Functionality
  console.log('\nTesting Video Modal...');
  try {
    // Check for video elements
    const videoElements = document.querySelectorAll('video');
    
    if (videoElements.length > 0) {
      logTest('Video Elements Present', true, `Found ${videoElements.length} videos`);
      
      // Check video styling
      const properlyStyledVideos = Array.from(videoElements).filter(video => 
        video.style.objectFit === 'contain' || video.className.includes('object-contain')
      );
      
      logTest('Videos Properly Styled', properlyStyledVideos.length > 0, 
        `${properlyStyledVideos.length} properly styled videos`);
        
    } else {
      logTest('Video Elements Present', false, 'No video elements found');
    }
  } catch (error) {
    logTest('Video Modal Test', false, `Error: ${error.message}`);
  }

  // Test 6: CSS Fixes Verification
  console.log('\nVerifying CSS Fixes...');
  try {
    // Check for flexbox centering
    const flexCenterElements = document.querySelectorAll('.flex.items-center.justify-center');
    logTest('Flexbox Centering Applied', flexCenterElements.length > 0, 
      `${flexCenterElements.length} elements using flex centering`);
    
    // Check for object-contain usage
    const objectContainElements = document.querySelectorAll('.object-contain');
    logTest('Object-Contain Applied', objectContainElements.length > 0, 
      `${objectContainElements.length} elements using object-contain`);
    
    // Check for viewport-relative sizing
    const viewportElements = Array.from(document.querySelectorAll('*')).filter(el => {
      const style = el.getAttribute('style') || '';
      return style.includes('vh') || style.includes('vw');
    });
    logTest('Viewport Units Used', viewportElements.length > 0, 
      `${viewportElements.length} elements using viewport units`);
    
  } catch (error) {
    logTest('CSS Fixes Verification', false, `Error: ${error.message}`);
  }

  // Generate Report
  console.log('\n📊 IMAGE ZOOM FIX TEST REPORT');
  console.log('='.repeat(50));
  console.log(`✅ Tests Passed: ${results.passed}`);
  console.log(`❌ Tests Failed: ${results.failed}`);
  console.log(`📊 Total Tests: ${results.tests.length}`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('Image zoom fix has been successfully implemented.');
    console.log('Images and videos should now display properly without unwanted cropping.');
  } else {
    console.log('\n⚠️ Some tests failed. Issues to address:');
    results.tests.filter(test => !test.passed).forEach(test => {
      console.log(`   - ${test.testName}: ${test.details}`);
    });
  }
  
  return results;
}

// Auto-run the test
testImageZoomFix().catch(console.error);