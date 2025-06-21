/**
 * Debug script to test gallery click handlers directly
 * Run this in browser console to diagnose click handler issues
 */

console.log('🔧 Starting Gallery Click Handler Debug...');

// Test 1: Check if gallery elements exist
function checkGalleryElements() {
  console.log('\n📍 Checking Gallery Elements...');
  
  const galleryCards = document.querySelectorAll('[data-testid="gallery-card"], .grid .overflow-hidden');
  console.log('Gallery cards found:', galleryCards.length);
  
  const images = document.querySelectorAll('img[src*="/uploads/gallery"]');
  console.log('Gallery images found:', images.length);
  
  const videos = document.querySelectorAll('video');
  console.log('Gallery videos found:', videos.length);
  
  const editButtons = document.querySelectorAll('button[aria-label*="Edit"]');
  console.log('Edit buttons found:', editButtons.length);
  
  return { galleryCards, images, videos, editButtons };
}

// Test 2: Check if click events are bound
function testEventBinding() {
  console.log('\n⚡ Testing Event Binding...');
  
  const elements = checkGalleryElements();
  
  // Test image clicks
  if (elements.images.length > 0) {
    const firstImage = elements.images[0];
    console.log('Testing image click on:', firstImage.src);
    
    // Check if parent has click handler
    const parent = firstImage.parentElement;
    console.log('Image parent element:', parent.tagName, parent.className);
    
    // Simulate click
    const clickEvent = new MouseEvent('click', { bubbles: true });
    parent.dispatchEvent(clickEvent);
    console.log('Image click dispatched');
  }
  
  // Test edit button clicks
  if (elements.editButtons.length > 0) {
    const firstButton = elements.editButtons[0];
    console.log('Testing edit button click');
    
    const clickEvent = new MouseEvent('click', { bubbles: true });
    firstButton.dispatchEvent(clickEvent);
    console.log('Edit button click dispatched');
  }
}

// Test 3: Check React state and component mounting
function checkReactState() {
  console.log('\n⚛️ Checking React Component State...');
  
  // Look for React DevTools info
  const reactRoot = document.querySelector('#root');
  if (reactRoot && reactRoot._reactInternalFiber) {
    console.log('React component tree detected');
  } else if (reactRoot && reactRoot._reactInternalInstance) {
    console.log('React component tree detected (legacy)');
  } else {
    console.log('React internal state not accessible via DevTools');
  }
  
  // Check for console errors
  const originalError = console.error;
  let errorCount = 0;
  console.error = (...args) => {
    errorCount++;
    originalError.apply(console, args);
  };
  
  setTimeout(() => {
    console.error = originalError;
    console.log('Console errors captured:', errorCount);
  }, 1000);
}

// Test 4: Manual state test
function manualStateTest() {
  console.log('\n🧪 Manual State Test...');
  
  // Try to trigger state changes manually
  window.testGalleryState = {
    viewingMedia: null,
    editingImage: null,
    
    setViewingMedia: function(media) {
      console.log('State change: viewingMedia =', media);
      this.viewingMedia = media;
      
      // Check if modal would open
      setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]');
        console.log('Modal after state change:', modal ? 'Found' : 'Not found');
      }, 100);
    },
    
    setEditingImage: function(image) {
      console.log('State change: editingImage =', image);
      this.editingImage = image;
      
      // Check if edit dialog would open
      setTimeout(() => {
        const editDialog = document.querySelector('[role="dialog"]');
        console.log('Edit dialog after state change:', editDialog ? 'Found' : 'Not found');
      }, 100);
    }
  };
  
  // Test state changes
  window.testGalleryState.setViewingMedia({ type: 'image', url: 'test.jpg', title: 'Test' });
  setTimeout(() => {
    window.testGalleryState.setEditingImage({ id: 1, alt: 'Test Image' });
  }, 200);
}

// Test 5: Check for CSS/layout issues
function checkLayoutIssues() {
  console.log('\n🎨 Checking Layout Issues...');
  
  const images = document.querySelectorAll('img[src*="/uploads/gallery"]');
  images.forEach((img, index) => {
    const rect = img.getBoundingClientRect();
    const parent = img.parentElement;
    const parentRect = parent.getBoundingClientRect();
    
    console.log(`Image ${index + 1}:`);
    console.log('  - Size:', rect.width, 'x', rect.height);
    console.log('  - Position:', rect.left, rect.top);
    console.log('  - Parent size:', parentRect.width, 'x', parentRect.height);
    console.log('  - Pointer events:', getComputedStyle(img).pointerEvents);
    console.log('  - Parent pointer events:', getComputedStyle(parent).pointerEvents);
  });
}

// Run all tests
async function runFullDebug() {
  console.log('🚀 Running Full Gallery Debug Suite...');
  
  checkGalleryElements();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  testEventBinding();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  checkReactState();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  manualStateTest();
  await new Promise(resolve => setTimeout(resolve, 500));
  
  checkLayoutIssues();
  
  console.log('\n✅ Debug complete. Check results above.');
}

// Make functions available globally
window.debugGallery = {
  checkElements: checkGalleryElements,
  testEvents: testEventBinding,
  checkReact: checkReactState,
  manualTest: manualStateTest,
  checkLayout: checkLayoutIssues,
  runFull: runFullDebug
};

console.log('Debug functions loaded. Run debugGallery.runFull() to test everything.');

// Auto-run if page is already loaded
if (document.readyState === 'complete') {
  setTimeout(runFullDebug, 1000);
} else {
  window.addEventListener('load', () => setTimeout(runFullDebug, 1000));
}