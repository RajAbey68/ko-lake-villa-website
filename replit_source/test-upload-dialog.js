/**
 * Test Upload Dialog Functionality
 * Run this in browser console on /admin/gallery to test the upload dialog
 */
async function testUploadDialog() {
  console.log('Testing upload dialog functionality...');
  
  // Test 1: Check if upload dialog opens
  console.log('1. Testing dialog opening...');
  const uploadButton = document.querySelector('[data-testid="upload-button"]') || 
                      document.querySelector('button:has-text("Upload Image")') ||
                      document.querySelector('button[class*="upload"]');
  
  if (uploadButton) {
    console.log('✓ Upload button found');
    uploadButton.click();
    
    setTimeout(() => {
      // Check if dialog opened
      const dialog = document.querySelector('[role="dialog"]') || 
                    document.querySelector('.dialog') ||
                    document.querySelector('[data-testid="upload-dialog"]');
      
      if (dialog) {
        console.log('✓ Upload dialog opened successfully');
        
        // Test 2: Check form fields
        console.log('2. Testing form fields...');
        const categoryField = dialog.querySelector('select') || dialog.querySelector('[name="category"]');
        const altField = dialog.querySelector('input[type="text"]') || dialog.querySelector('[name="alt"]');
        const fileField = dialog.querySelector('input[type="file"]');
        
        console.log('Form fields found:');
        console.log('- Category field:', !!categoryField);
        console.log('- Alt text field:', !!altField);
        console.log('- File field:', !!fileField);
        
        // Test 3: Try to submit form
        console.log('3. Testing form submission...');
        if (categoryField && altField && fileField) {
          // Fill out the form
          if (categoryField.tagName === 'SELECT') {
            categoryField.value = 'entire-villa';
          }
          if (altField) {
            altField.value = 'test upload';
          }
          
          // Create a test file
          const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
          
          // Try to set file (this might not work due to security restrictions)
          try {
            const dt = new DataTransfer();
            dt.items.add(testFile);
            fileField.files = dt.files;
            
            // Find submit button
            const submitButton = dialog.querySelector('button[type="submit"]') ||
                                dialog.querySelector('button:has-text("Upload")') ||
                                dialog.querySelector('button[class*="submit"]');
            
            if (submitButton) {
              console.log('✓ Form filled and ready to submit');
              console.log('Note: File upload test requires manual file selection');
            } else {
              console.log('✗ Submit button not found');
            }
          } catch (error) {
            console.log('File selection test skipped (security restriction)');
          }
        } else {
          console.log('✗ Required form fields missing');
        }
        
      } else {
        console.log('✗ Upload dialog did not open');
      }
    }, 1000);
    
  } else {
    console.log('✗ Upload button not found');
    console.log('Available buttons:', document.querySelectorAll('button'));
  }
}

// Test API endpoint directly
async function testUploadAPI() {
  console.log('Testing upload API endpoint...');
  
  try {
    const formData = new FormData();
    formData.append('category', 'entire-villa');
    formData.append('alt', 'API test');
    formData.append('description', 'Testing API directly');
    formData.append('featured', 'false');
    
    // Create a minimal test file
    const testFile = new File(['test content'], 'test.jpg', { type: 'image/jpeg' });
    formData.append('image', testFile);
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    const result = await response.json();
    
    if (response.ok) {
      console.log('✓ API upload test successful:', result);
    } else {
      console.log('✗ API upload test failed:', result);
    }
  } catch (error) {
    console.log('✗ API test error:', error.message);
  }
}

// Run tests
console.log('=== UPLOAD DIALOG TEST SUITE ===');
testUploadDialog();
setTimeout(() => {
  testUploadAPI();
}, 2000);