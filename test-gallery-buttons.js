/**
 * Direct Gallery Button Test
 * Tests actual button functionality on the live page
 */

console.log('Testing gallery buttons...');

// Wait for page to load
setTimeout(() => {
  // Test upload button
  console.log('Testing upload button...');
  const uploadBtn = document.querySelector('button:has(.lucide-upload)');
  if (uploadBtn) {
    console.log('Upload button found, clicking...');
    uploadBtn.click();
    setTimeout(() => {
      const uploadDialog = document.querySelector('input[type="file"]');
      console.log('Upload dialog opened:', !!uploadDialog);
    }, 500);
  } else {
    console.log('Upload button not found');
  }

  // Test edit buttons  
  console.log('Testing edit buttons...');
  const editBtns = document.querySelectorAll('button[title*="Edit"]');
  console.log('Edit buttons found:', editBtns.length);
  if (editBtns.length > 0) {
    editBtns[0].click();
    setTimeout(() => {
      const editDialog = document.querySelector('[role="dialog"]');
      console.log('Edit dialog opened:', !!editDialog);
    }, 500);
  }

  // Test video click
  console.log('Testing video click...');
  const videos = document.querySelectorAll('video');
  if (videos.length > 0) {
    const videoContainer = videos[0].closest('.cursor-pointer');
    if (videoContainer) {
      videoContainer.click();
      setTimeout(() => {
        const fullscreen = document.querySelector('.fixed.inset-0');
        console.log('Video fullscreen opened:', !!fullscreen);
      }, 500);
    }
  }

}, 2000);

console.log('Button test scheduled...');