/**
 * Gallery Button Test - Direct browser console test
 * Run this in the browser console to test gallery functionality
 */

function testGalleryButtons() {
  console.log('🧪 Testing Gallery Button Functionality...');
  
  // Test 1: Check if buttons exist
  const editButtons = document.querySelectorAll('button[title*="Edit"]');
  const deleteButtons = document.querySelectorAll('button[class*="text-red-600"]');
  const uploadButton = document.querySelector('button:has(.lucide-upload)');
  const mediaItems = document.querySelectorAll('[class*="cursor-pointer"]');
  
  console.log('Found elements:');
  console.log('- Edit buttons:', editButtons.length);
  console.log('- Delete buttons:', deleteButtons.length);
  console.log('- Upload button:', uploadButton ? 'Yes' : 'No');
  console.log('- Media items:', mediaItems.length);
  
  // Test 2: Simulate button clicks
  if (editButtons.length > 0) {
    console.log('Testing edit button click...');
    const firstEdit = editButtons[0];
    firstEdit.click();
    setTimeout(() => {
      const editDialog = document.querySelector('[role="dialog"]');
      console.log('Edit dialog opened:', editDialog ? 'Yes' : 'No');
    }, 500);
  }
  
  // Test 3: Test media click
  if (mediaItems.length > 0) {
    console.log('Testing media item click...');
    const firstMedia = mediaItems[0];
    firstMedia.click();
    setTimeout(() => {
      const fullscreenDialog = document.querySelector('[role="dialog"]');
      console.log('Fullscreen dialog opened:', fullscreenDialog ? 'Yes' : 'No');
    }, 500);
  }
  
  // Test 4: Test upload button
  if (uploadButton) {
    console.log('Testing upload button...');
    uploadButton.click();
    setTimeout(() => {
      const uploadDialog = document.querySelector('[role="dialog"]');
      console.log('Upload dialog opened:', uploadDialog ? 'Yes' : 'No');
    }, 500);
  }
  
  console.log('Test completed. Check for any errors above.');
}

// Auto-run test
testGalleryButtons();

// Make function available globally
window.testGalleryButtons = testGalleryButtons;