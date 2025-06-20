/**
 * Comprehensive Gallery Debug Test
 * Tests the actual gallery functionality in real-time
 */

// Test the gallery after page loads
setTimeout(() => {
  console.log('=== GALLERY DEBUG TEST ===');
  
  // Test 1: Check edit button functionality
  const editButtons = document.querySelectorAll('button[title*="Edit"]');
  console.log(`Found ${editButtons.length} edit buttons`);
  
  if (editButtons.length > 0) {
    console.log('Clicking first edit button...');
    editButtons[0].click();
    
    // Check if TaggingDialog appears
    setTimeout(() => {
      const taggingDialog = document.querySelector('[aria-describedby="dialog-description"]');
      const editDialog = document.querySelector('[aria-describedby="edit-dialog-description"]');
      const anyDialog = document.querySelector('[role="dialog"]');
      
      console.log('TaggingDialog found:', !!taggingDialog);
      console.log('EditDialog found:', !!editDialog);
      console.log('Any dialog found:', !!anyDialog);
      
      if (anyDialog) {
        console.log('✓ Dialog is visible');
        // Close the dialog
        const closeButton = anyDialog.querySelector('button[type="button"]');
        if (closeButton) closeButton.click();
      } else {
        console.log('✗ No dialog visible - checking DOM state...');
        // Check React component state
        const galleryContainer = document.querySelector('.space-y-6');
        console.log('Gallery container found:', !!galleryContainer);
      }
    }, 1000);
  }
  
  // Test 2: Video click functionality
  setTimeout(() => {
    console.log('\n=== TESTING VIDEO CLICK ===');
    const videos = document.querySelectorAll('video');
    console.log(`Found ${videos.length} videos`);
    
    if (videos.length > 0) {
      const videoContainer = videos[0].closest('.cursor-pointer');
      if (videoContainer) {
        console.log('Clicking video container...');
        videoContainer.click();
        
        setTimeout(() => {
          const fullscreenViewer = document.querySelector('.fixed.inset-0');
          console.log('Fullscreen viewer opened:', !!fullscreenViewer);
          
          if (fullscreenViewer) {
            const closeButton = fullscreenViewer.querySelector('button');
            if (closeButton) closeButton.click();
          }
        }, 1000);
      }
    }
  }, 3000);
  
  // Test 3: Upload button
  setTimeout(() => {
    console.log('\n=== TESTING UPLOAD BUTTON ===');
    const uploadButton = document.querySelector('button:has(.lucide-upload)');
    console.log('Upload button found:', !!uploadButton);
    
    if (uploadButton) {
      console.log('Clicking upload button...');
      uploadButton.click();
      
      setTimeout(() => {
        const fileInput = document.querySelector('input[type="file"]');
        console.log('File input appeared:', !!fileInput);
        
        if (fileInput) {
          const dialog = fileInput.closest('[role="dialog"]');
          if (dialog) {
            const cancelButton = Array.from(dialog.querySelectorAll('button')).find(btn => btn.textContent?.includes('Cancel'));
            if (cancelButton) cancelButton.click();
          }
        }
      }, 1000);
    }
  }, 5000);
  
}, 2000);

console.log('Gallery debug test scheduled...');