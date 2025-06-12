/**
 * Gallery Functionality Test
 * Test all gallery buttons after fixes
 */

console.log('Testing gallery functionality...');

setTimeout(() => {
  // Test 1: Edit buttons
  const editButtons = document.querySelectorAll('button[title*="Edit"]');
  console.log(`✓ Found ${editButtons.length} edit buttons`);
  
  if (editButtons.length > 0) {
    console.log('Testing edit button click...');
    editButtons[0].click();
    
    setTimeout(() => {
      const editDialog = document.querySelector('[aria-describedby="dialog-description"]');
      console.log(`✓ Edit dialog ${editDialog ? 'opened successfully' : 'failed to open'}`);
      
      // Close dialog if opened
      if (editDialog) {
        const closeButton = editDialog.querySelector('button');
        if (closeButton) closeButton.click();
      }
    }, 1000);
  }

  // Test 2: Delete buttons
  setTimeout(() => {
    const deleteButtons = document.querySelectorAll('button[title*="Delete"]');
    console.log(`✓ Found ${deleteButtons.length} delete buttons`);
    
    if (deleteButtons.length > 0) {
      console.log('Testing delete button click...');
      deleteButtons[0].click();
      
      setTimeout(() => {
        const deleteDialog = document.querySelector('[role="dialog"]');
        console.log(`✓ Delete dialog ${deleteDialog ? 'opened successfully' : 'failed to open'}`);
        
        // Close dialog if opened
        if (deleteDialog) {
          const cancelButton = Array.from(deleteDialog.querySelectorAll('button')).find(btn => btn.textContent?.includes('Cancel'));
          if (cancelButton) cancelButton.click();
        }
      }, 1000);
    }
  }, 2000);

  // Test 3: Video playback
  setTimeout(() => {
    const videos = document.querySelectorAll('video');
    console.log(`✓ Found ${videos.length} videos`);
    
    if (videos.length > 0) {
      console.log('Testing video click...');
      const videoContainer = videos[0].closest('.cursor-pointer');
      if (videoContainer) {
        videoContainer.click();
        
        setTimeout(() => {
          const fullscreenVideo = document.querySelector('.fixed.inset-0 video');
          console.log(`✓ Video fullscreen ${fullscreenVideo ? 'opened successfully' : 'failed to open'}`);
          
          // Close fullscreen if opened
          if (fullscreenVideo) {
            const closeButton = document.querySelector('.fixed.inset-0 button');
            if (closeButton) closeButton.click();
          }
        }, 1000);
      }
    }
  }, 4000);

  // Test 4: Upload button
  setTimeout(() => {
    const uploadButton = document.querySelector('button:has(.lucide-upload)');
    console.log(`✓ Upload button ${uploadButton ? 'found' : 'not found'}`);
    
    if (uploadButton) {
      console.log('Testing upload button click...');
      uploadButton.click();
      
      setTimeout(() => {
        const uploadDialog = document.querySelector('input[type="file"]');
        console.log(`✓ Upload dialog ${uploadDialog ? 'opened successfully' : 'failed to open'}`);
        
        // Close dialog if opened
        if (uploadDialog) {
          const cancelButton = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Cancel'));
          if (cancelButton) cancelButton.click();
        }
      }, 1000);
    }
  }, 6000);

}, 2000);

console.log('Gallery test scheduled...');