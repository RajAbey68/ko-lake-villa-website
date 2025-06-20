
/**
 * Test Gallery Modal Debug Logging
 * Verify the console.log for selected images is working
 */

async function testModalDebugLogging() {
  console.log('🔍 Testing Gallery Modal Debug Logging...\n');
  
  try {
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if we're on the gallery page
    const currentPath = window.location.pathname;
    console.log('Current page:', currentPath);
    
    if (!currentPath.includes('/gallery')) {
      console.log('❌ Not on gallery page. Navigate to /gallery first.');
      return false;
    }
    
    // Find gallery images
    const galleryImages = document.querySelectorAll('.group.overflow-hidden.rounded-lg.cursor-pointer');
    console.log('✓ Found gallery images:', galleryImages.length);
    
    if (galleryImages.length === 0) {
      console.log('❌ No gallery images found');
      return false;
    }
    
    // Test clicking on first image
    const firstImage = galleryImages[0];
    console.log('✓ Testing click on first image...');
    
    // Look for the debug log in console
    const originalLog = console.log;
    let debugLogFound = false;
    
    console.log = function(...args) {
      if (args[0] === "Selected image for modal:") {
        debugLogFound = true;
        console.log('✅ DEBUG LOG FOUND:', args[0], args[1]);
      }
      originalLog.apply(console, args);
    };
    
    // Simulate click
    firstImage.click();
    
    // Wait a moment for the log
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Restore original console.log
    console.log = originalLog;
    
    if (debugLogFound) {
      console.log('✅ Gallery modal debug logging is working correctly!');
      
      // Check if modal opened
      const modal = document.querySelector('[role="dialog"]');
      if (modal) {
        console.log('✅ Modal opened successfully');
        
        // Close modal
        const closeButton = modal.querySelector('button');
        if (closeButton) {
          closeButton.click();
        }
      } else {
        console.log('⚠️ Modal did not open, but debug log worked');
      }
      
      return true;
    } else {
      console.log('❌ Debug log not found. The console.log may not be executing.');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

// Auto-run if on gallery page
if (typeof window !== 'undefined' && window.location.pathname.includes('/gallery')) {
  testModalDebugLogging();
} else {
  console.log('Navigate to /gallery and run: testModalDebugLogging()');
}
