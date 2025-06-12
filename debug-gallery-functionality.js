/**
 * Real-time Gallery Debug Test
 * Run this in browser console to test gallery functionality
 */

console.log('🔍 Starting Gallery Functionality Debug...');

// Test 1: Check if gallery loads
async function testGalleryLoad() {
  try {
    const response = await fetch('/api/gallery');
    const data = await response.json();
    console.log('✓ Gallery API Response:', data.length, 'items');
    return data;
  } catch (error) {
    console.error('✗ Gallery API Failed:', error);
    return [];
  }
}

// Test 2: Test video elements
function testVideoElements() {
  const videos = document.querySelectorAll('video');
  console.log('Found video elements:', videos.length);
  
  videos.forEach((video, index) => {
    console.log(`Video ${index + 1}:`, {
      src: video.src,
      readyState: video.readyState,
      networkState: video.networkState,
      controls: video.controls,
      muted: video.muted
    });
    
    // Try to play each video
    video.play().then(() => {
      console.log(`✓ Video ${index + 1} playing`);
    }).catch(error => {
      console.log(`✗ Video ${index + 1} failed:`, error.message);
    });
  });
}

// Test 3: Test button functionality
function testButtonClicks() {
  console.log('Testing button functionality...');
  
  // Find edit buttons
  const editButtons = document.querySelectorAll('button[title*="Edit"], button:has(.lucide-edit)');
  console.log('Edit buttons found:', editButtons.length);
  
  // Find delete buttons  
  const deleteButtons = document.querySelectorAll('button:has(.lucide-trash)');
  console.log('Delete buttons found:', deleteButtons.length);
  
  // Find upload button
  const uploadButtons = document.querySelectorAll('button:has(.lucide-upload)');
  console.log('Upload buttons found:', uploadButtons.length);
  
  // Test first edit button
  if (editButtons.length > 0) {
    console.log('Testing first edit button...');
    editButtons[0].click();
    setTimeout(() => {
      const dialog = document.querySelector('[role="dialog"]');
      console.log('Edit dialog appeared:', !!dialog);
    }, 500);
  }
}

// Test 4: Test media click handlers
function testMediaClicks() {
  console.log('Testing media click handlers...');
  
  const mediaElements = document.querySelectorAll('[class*="cursor-pointer"]');
  console.log('Clickable media elements:', mediaElements.length);
  
  if (mediaElements.length > 0) {
    console.log('Testing first media element click...');
    mediaElements[0].click();
    setTimeout(() => {
      const fullscreenDialog = document.querySelector('.max-w-\\[95vw\\]');
      console.log('Fullscreen dialog appeared:', !!fullscreenDialog);
    }, 500);
  }
}

// Test 5: Check React state
function checkReactState() {
  console.log('Checking React component state...');
  
  // Look for React fiber
  const galleryContainer = document.querySelector('[class*="grid"]');
  if (galleryContainer && galleryContainer._reactInternalFiber) {
    console.log('React fiber found');
  } else if (galleryContainer && galleryContainer._reactInternalInstance) {
    console.log('React instance found');
  } else {
    console.log('No React state accessible');
  }
}

// Run all tests
async function runFullDebug() {
  console.log('=== STARTING COMPREHENSIVE GALLERY DEBUG ===');
  
  // Test API
  const galleryData = await testGalleryLoad();
  
  // Wait for page to render
  setTimeout(() => {
    // Test DOM elements
    testVideoElements();
    testButtonClicks();
    testMediaClicks();
    checkReactState();
    
    console.log('=== DEBUG COMPLETE ===');
    console.log('Check above for any ✗ failures');
  }, 2000);
}

// Auto-run debug
runFullDebug();

// Make functions available globally for manual testing
window.debugGallery = {
  testGalleryLoad,
  testVideoElements,
  testButtonClicks,
  testMediaClicks,
  checkReactState,
  runFullDebug
};

console.log('Debug functions available at: window.debugGallery');