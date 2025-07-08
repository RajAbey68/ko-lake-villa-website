/**
 * Real-time gallery button test - paste this in browser console on /admin/gallery
 */

console.log('=== GALLERY BUTTON TEST ===');

// Test after a moment to ensure page is loaded
setTimeout(() => {
  // Test edit button
  const editButtons = document.querySelectorAll('button[title*="Edit"], button:has(.lucide-edit)');
  console.log(`Edit buttons found: ${editButtons.length}`);
  
  if (editButtons.length > 0) {
    console.log('Testing edit button click...');
    editButtons[0].click();
    
    // Check for dialog after click
    setTimeout(() => {
      const dialogs = document.querySelectorAll('[role="dialog"]');
      const visibleDialogs = Array.from(dialogs).filter(d => 
        window.getComputedStyle(d).display !== 'none' && 
        window.getComputedStyle(d).visibility !== 'hidden'
      );
      
      console.log(`Total dialogs: ${dialogs.length}, Visible: ${visibleDialogs.length}`);
      
      if (visibleDialogs.length > 0) {
        console.log('✓ EDIT DIALOG WORKS');
        // Close the dialog
        const closeBtn = visibleDialogs[0].querySelector('button[type="button"]');
        if (closeBtn) closeBtn.click();
      } else {
        console.log('✗ EDIT DIALOG FAILED');
        
        // Debug state
        const galleryManager = document.querySelector('[data-testid="gallery-manager"], .space-y-6');
        if (galleryManager) {
          console.log('Gallery manager element found');
          
          // Check for React props/state
          const reactKey = Object.keys(galleryManager).find(key => 
            key.startsWith('__reactInternalInstance') || key.startsWith('_reactInternals')
          );
          if (reactKey) {
            console.log('React component found');
          }
        }
      }
    }, 1000);
  }
  
  // Test video functionality
  setTimeout(() => {
    console.log('\n=== VIDEO TEST ===');
    const videos = document.querySelectorAll('video');
    console.log(`Videos found: ${videos.length}`);
    
    if (videos.length > 0) {
      const videoContainer = videos[0].closest('.cursor-pointer');
      if (videoContainer) {
        console.log('Testing video click...');
        videoContainer.click();
        
        setTimeout(() => {
          const fullscreen = document.querySelector('.fixed.inset-0.z-50');
          if (fullscreen) {
            console.log('✓ VIDEO FULLSCREEN WORKS');
            const closeBtn = fullscreen.querySelector('button');
            if (closeBtn) closeBtn.click();
          } else {
            console.log('✗ VIDEO FULLSCREEN FAILED');
          }
        }, 500);
      }
    }
  }, 3000);
  
}, 1500);