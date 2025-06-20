/**
 * Direct Edit Button Test and Fix
 * Tests and fixes the edit button functionality
 */

console.log('Testing edit button functionality...');

// Wait for page to load
setTimeout(() => {
  console.log('=== EDIT BUTTON TEST ===');
  
  // Find and test edit button
  const editButtons = document.querySelectorAll('button[title*="Edit"]');
  console.log(`Found ${editButtons.length} edit buttons`);
  
  if (editButtons.length > 0) {
    console.log('Testing edit button click...');
    
    // Click the first edit button
    editButtons[0].click();
    
    // Check for dialog after click
    setTimeout(() => {
      // Look for any dialog that might have opened
      const dialogs = document.querySelectorAll('[role="dialog"]');
      const taggingDialog = document.querySelector('[aria-describedby="dialog-description"]');
      const editDialog = document.querySelector('[aria-describedby="edit-dialog-description"]');
      
      console.log('Total dialogs found:', dialogs.length);
      console.log('TaggingDialog found:', !!taggingDialog);
      console.log('EditDialog found:', !!editDialog);
      
      if (dialogs.length > 0) {
        console.log('✓ Dialog opened successfully');
        dialogs.forEach((dialog, index) => {
          console.log(`Dialog ${index + 1}:`, dialog.className);
        });
        
        // Close any open dialogs
        const closeButtons = document.querySelectorAll('[role="dialog"] button');
        if (closeButtons.length > 0) {
          closeButtons[0].click();
          console.log('Closed dialog');
        }
      } else {
        console.log('✗ No dialog appeared');
        
        // Check if React is working
        const reactRoot = document.getElementById('root');
        console.log('React root exists:', !!reactRoot);
        
        // Check for any error messages
        const errors = document.querySelectorAll('.error, [class*="error"]');
        console.log('Error elements found:', errors.length);
      }
    }, 1500);
    
    // Test video functionality
    setTimeout(() => {
      console.log('\n=== VIDEO TEST ===');
      const videos = document.querySelectorAll('video');
      console.log(`Found ${videos.length} videos`);
      
      if (videos.length > 0) {
        const videoContainer = videos[0].closest('.cursor-pointer');
        if (videoContainer) {
          console.log('Clicking video...');
          videoContainer.click();
          
          setTimeout(() => {
            const fullscreen = document.querySelector('.fixed.inset-0');
            console.log('Video fullscreen opened:', !!fullscreen);
            
            if (fullscreen) {
              const closeBtn = fullscreen.querySelector('button');
              if (closeBtn) closeBtn.click();
            }
          }, 1000);
        }
      }
    }, 3000);
    
    // Test upload button
    setTimeout(() => {
      console.log('\n=== UPLOAD TEST ===');
      const uploadBtn = document.querySelector('button:has(.lucide-upload)');
      console.log('Upload button found:', !!uploadBtn);
      
      if (uploadBtn) {
        uploadBtn.click();
        setTimeout(() => {
          const fileInput = document.querySelector('input[type="file"]');
          console.log('Upload dialog opened:', !!fileInput);
          
          if (fileInput) {
            const cancelBtn = Array.from(document.querySelectorAll('button')).find(btn => btn.textContent?.includes('Cancel'));
            if (cancelBtn) cancelBtn.click();
          }
        }, 1000);
      }
    }, 5000);
  }
  
}, 2000);

console.log('Test scheduled...');