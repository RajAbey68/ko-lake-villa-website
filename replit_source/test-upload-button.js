/**
 * Upload Button Functionality Test
 * Tests if the upload dialog opens when buttons are clicked
 */

async function testUploadButtons() {
  console.log('Testing upload button functionality...');
  
  // Test 1: Check if upload buttons exist
  const uploadButtons = document.querySelectorAll('button');
  const uploadMediaButton = Array.from(uploadButtons).find(btn => 
    btn.textContent.includes('Upload Media') || btn.textContent.includes('Upload Now')
  );
  
  if (!uploadMediaButton) {
    console.error('❌ Upload button not found');
    return false;
  }
  
  console.log('✓ Upload button found:', uploadMediaButton.textContent);
  
  // Test 2: Check if button has click handler
  const hasOnClick = uploadMediaButton.onclick || uploadMediaButton.getAttribute('onclick');
  if (!hasOnClick) {
    console.log('⚠️ No direct onclick handler found, checking for React event listeners...');
  }
  
  // Test 3: Try clicking the button
  try {
    console.log('Attempting to click upload button...');
    uploadMediaButton.click();
    
    // Wait a moment for dialog to appear
    setTimeout(() => {
      const dialog = document.querySelector('[role="dialog"]') || document.querySelector('.dialog');
      if (dialog) {
        console.log('✓ Dialog opened successfully');
        return true;
      } else {
        console.error('❌ Dialog did not open after button click');
        return false;
      }
    }, 500);
    
  } catch (error) {
    console.error('❌ Error clicking button:', error);
    return false;
  }
}

// Run the test
testUploadButtons();