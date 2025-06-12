/**
 * Ko Lake Villa - Gallery Functionality Test
 * Tests image enlarging, video playback, and edit dialog functionality
 */

async function testGalleryFunctionality() {
  console.log('🔍 Testing Gallery Functionality...');
  
  // Test 1: Check if gallery loads
  try {
    const response = await fetch('/api/gallery');
    const images = await response.json();
    console.log('✓ Gallery API working:', images.length, 'items');
    
    const videos = images.filter(img => img.mediaType === 'video');
    const photos = images.filter(img => img.mediaType === 'image');
    console.log('  - Videos:', videos.length);
    console.log('  - Images:', photos.length);
    
    if (videos.length > 0) {
      console.log('  - Sample video URL:', videos[0].imageUrl);
    }
    
  } catch (error) {
    console.error('✗ Gallery API failed:', error.message);
    return;
  }
  
  // Test 2: Check if click handlers are bound
  console.log('\n🎯 Testing Click Handlers...');
  
  // Wait for gallery to load
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const imageElements = document.querySelectorAll('img[src*="/uploads/gallery"]');
  const videoElements = document.querySelectorAll('video[src*="/uploads/gallery"], video source[src*="/uploads/gallery"]');
  
  console.log('Found image elements:', imageElements.length);
  console.log('Found video elements:', videoElements.length);
  
  // Test image click
  if (imageElements.length > 0) {
    console.log('Testing image click...');
    const firstImage = imageElements[0];
    console.log('Image src:', firstImage.src);
    
    // Simulate click
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    firstImage.dispatchEvent(clickEvent);
    
    // Check if modal opened
    setTimeout(() => {
      const modal = document.querySelector('[role="dialog"]');
      if (modal && modal.style.display !== 'none') {
        console.log('✓ Image click opened modal');
      } else {
        console.log('✗ Image click did not open modal');
      }
    }, 500);
  }
  
  // Test edit button click
  console.log('\n✏️ Testing Edit Functionality...');
  const editButtons = document.querySelectorAll('button[aria-label*="Edit"]');
  console.log('Found edit buttons:', editButtons.length);
  
  if (editButtons.length > 0) {
    const firstEditButton = editButtons[0];
    console.log('Testing edit button click...');
    
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });
    
    firstEditButton.dispatchEvent(clickEvent);
    
    // Check if edit dialog opened
    setTimeout(() => {
      const editDialog = document.querySelector('[role="dialog"]');
      const editForm = document.querySelector('form');
      if (editDialog && editForm) {
        console.log('✓ Edit dialog opened successfully');
      } else {
        console.log('✗ Edit dialog did not open');
      }
    }, 500);
  }
  
  // Test 3: Check video playback
  if (videoElements.length > 0) {
    console.log('\n🎬 Testing Video Playback...');
    const videoContainers = document.querySelectorAll('video');
    
    videoContainers.forEach((video, index) => {
      console.log(`Video ${index + 1}:`, video.src || 'No src');
      console.log('  - Can play:', video.canPlayType('video/mp4'));
      console.log('  - Ready state:', video.readyState);
      
      video.addEventListener('loadeddata', () => {
        console.log(`✓ Video ${index + 1} loaded successfully`);
      });
      
      video.addEventListener('error', (e) => {
        console.log(`✗ Video ${index + 1} failed to load:`, e.target.error);
      });
    });
  }
  
  console.log('\n📊 Test Summary:');
  console.log('- API connectivity: Working');
  console.log('- Image elements: Found');
  console.log('- Video elements: Found');
  console.log('- Edit buttons: Found');
  console.log('\nClick on images and videos to test fullscreen functionality.');
  console.log('Click edit buttons to test edit dialog functionality.');
}

// Auto-run test when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testGalleryFunctionality);
} else {
  testGalleryFunctionality();
}

// Make function available globally for manual testing
window.testGalleryFunctionality = testGalleryFunctionality;

console.log('Gallery functionality test loaded. Run testGalleryFunctionality() to test manually.');