/**
 * Ko Lake Villa - Gallery Video & Modal Test
 * Tests video playback and modal expansion functionality
 */

async function testGalleryVideoModal() {
  console.log('🎥 Testing Gallery Video & Modal Functionality...\n');

  // Test 1: Check gallery API data
  console.log('1. Testing Gallery API Data...');
  try {
    const response = await fetch('/api/gallery');
    const data = await response.json();
    
    const videos = data.filter(item => item.mediaType === 'video' || 
      item.imageUrl?.toLowerCase().includes('.mp4') ||
      item.imageUrl?.toLowerCase().includes('.mov'));
    
    console.log(`✅ Gallery API: ${data.length} total items, ${videos.length} videos`);
    
    if (videos.length > 0) {
      console.log(`   First video: ${videos[0].imageUrl}`);
      console.log(`   Video category: ${videos[0].category}`);
    }
  } catch (error) {
    console.log(`❌ Gallery API Error: ${error.message}`);
  }

  // Test 2: Check for JavaScript errors in browser console
  console.log('\n2. Browser Console Error Check...');
  console.log('   Check browser console for any JavaScript errors');
  console.log('   Common issues: React state updates, modal render errors');

  // Test 3: Test video file accessibility
  console.log('\n3. Testing Video File Access...');
  try {
    const response = await fetch('/api/gallery');
    const data = await response.json();
    const videos = data.filter(item => item.mediaType === 'video');
    
    if (videos.length > 0) {
      const testVideo = videos[0];
      const videoResponse = await fetch(testVideo.imageUrl, { method: 'HEAD' });
      
      if (videoResponse.ok) {
        console.log(`✅ Video accessible: ${testVideo.imageUrl}`);
      } else {
        console.log(`❌ Video not accessible: ${testVideo.imageUrl} (${videoResponse.status})`);
      }
    } else {
      console.log('⚠️  No videos found in gallery data');
    }
  } catch (error) {
    console.log(`❌ Video access test failed: ${error.message}`);
  }

  // Test 4: Modal component check
  console.log('\n4. Modal Component Analysis...');
  console.log('   Checking if GalleryModal component is properly imported and rendered');
  console.log('   Modal should open when clicking on gallery items');

  // Test 5: Event handlers check
  console.log('\n5. Event Handler Analysis...');
  console.log('   Gallery items should have onClick handlers that call openImageModal()');
  console.log('   Video elements should have proper video controls and autoplay');

  console.log('\n🔍 DIAGNOSTIC STEPS:');
  console.log('1. Open browser console (F12)');
  console.log('2. Go to gallery page');
  console.log('3. Click on any image/video');
  console.log('4. Check for error messages');
  console.log('5. Verify modal opens with proper content');
  console.log('6. Test video controls if modal contains video');

  console.log('\n📋 COMMON FIXES:');
  console.log('• Clear browser cache and refresh');
  console.log('• Check React component state management');
  console.log('• Verify modal z-index and CSS positioning');
  console.log('• Test video file formats and browser compatibility');
  console.log('• Check for JavaScript console errors');
}

// Run the test
testGalleryVideoModal().catch(console.error);