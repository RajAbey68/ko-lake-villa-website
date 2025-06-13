/**
 * Gallery Modal Debug Test
 * Diagnoses why image clicking isn't opening the modal
 */

async function debugGalleryModal() {
  console.log('🔍 Debugging Gallery Modal Functionality...\n');
  
  try {
    // Check if we're on the gallery page
    if (!window.location.pathname.includes('/gallery')) {
      console.log('❌ Please run this test on the /gallery page');
      return;
    }

    // Test 1: Check for gallery images
    console.log('1. Checking for gallery images...');
    const galleryImages = document.querySelectorAll('[data-testid="gallery-image"], img');
    console.log(`✅ Found ${galleryImages.length} images on page`);

    if (galleryImages.length === 0) {
      console.log('❌ No gallery images found to test');
      return;
    }

    // Test 2: Check click handlers
    console.log('\n2. Testing click handlers...');
    const firstImage = galleryImages[0];
    const parentContainer = firstImage.closest('div[class*="cursor-pointer"]');
    
    if (parentContainer) {
      console.log('✅ Found clickable container');
      
      // Check for click event listeners
      const hasClickHandler = parentContainer.onclick !== null;
      console.log(`Click handler present: ${hasClickHandler}`);
      
      // Test actual click
      console.log('Attempting to click first image...');
      parentContainer.click();
      
      // Wait and check for modal
      setTimeout(() => {
        const modal = document.querySelector('[role="dialog"]') || 
                     document.querySelector('.modal') ||
                     document.querySelector('[data-testid="gallery-modal"]');
        
        if (modal) {
          console.log('✅ Modal appeared after click');
          console.log('Modal element:', modal);
          
          // Check modal content
          const modalImage = modal.querySelector('img') || modal.querySelector('video');
          if (modalImage) {
            console.log('✅ Modal contains media element');
          } else {
            console.log('❌ Modal missing media element');
          }
          
          // Test close functionality
          const closeButton = modal.querySelector('button[aria-label*="close"]') ||
                             modal.querySelector('button:has(svg)') ||
                             modal.querySelector('[data-testid="close-button"]');
          
          if (closeButton) {
            console.log('✅ Close button found');
            setTimeout(() => closeButton.click(), 1000);
          }
          
        } else {
          console.log('❌ Modal did not appear after click');
          
          // Check console errors
          console.log('Checking for JavaScript errors...');
          
          // Check React state
          console.log('Checking React state...');
          const reactFiber = firstImage._reactInternalFiber || 
                           firstImage._reactInternalInstance ||
                           Object.keys(firstImage).find(key => key.startsWith('__reactInternalInstance'));
          
          if (reactFiber) {
            console.log('✅ React component found');
          } else {
            console.log('❌ React component not found - possible hydration issue');
          }
        }
      }, 500);
      
    } else {
      console.log('❌ No clickable container found');
      console.log('Image classes:', firstImage.className);
      console.log('Parent classes:', firstImage.parentElement?.className);
    }

    // Test 3: Check React Query data
    console.log('\n3. Checking React Query data...');
    
    // Look for gallery data in window
    if (window.__REACT_QUERY_STATE__) {
      console.log('✅ React Query state found');
    }

    // Test 4: Check for modal components in DOM
    console.log('\n4. Checking for modal components...');
    
    const dialogElements = document.querySelectorAll('[role="dialog"]');
    console.log(`Found ${dialogElements.length} dialog elements`);
    
    const modalElements = document.querySelectorAll('.modal, [data-testid*="modal"]');
    console.log(`Found ${modalElements.length} modal elements`);

    // Test 5: Check for specific modal imports
    console.log('\n5. Checking component structure...');
    
    const gallerySection = document.querySelector('section');
    if (gallerySection) {
      console.log('✅ Gallery section found');
      
      const galleryContainer = gallerySection.querySelector('.grid');
      if (galleryContainer) {
        console.log('✅ Gallery grid found');
        console.log(`Grid contains ${galleryContainer.children.length} items`);
      }
    }

  } catch (error) {
    console.log('❌ Debug test failed:', error.message);
    console.log('Stack trace:', error.stack);
  }
}

// Manual click test function
function testManualClick() {
  console.log('🖱️ Manual Click Test');
  
  const images = document.querySelectorAll('img');
  images.forEach((img, index) => {
    img.addEventListener('click', (e) => {
      console.log(`Image ${index} clicked:`, img.src);
      console.log('Event:', e);
    });
  });
  
  console.log(`Added click listeners to ${images.length} images`);
}

// Auto-run debug
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(debugGalleryModal, 2000);
  });
} else {
  setTimeout(debugGalleryModal, 1000);
}

// Export for manual testing
window.debugGalleryModal = debugGalleryModal;
window.testManualClick = testManualClick;

console.log('Gallery modal debug loaded. Run debugGalleryModal() or testManualClick() manually if needed.');