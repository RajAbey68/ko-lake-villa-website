
/**
 * Comprehensive Upload Dialog Test
 * Tests the current state of upload functionality
 */

async function testUploadDialogFix() {
  console.log('🧪 Testing Upload Dialog Fix - Comprehensive Analysis\n');
  
  // Test 1: API Endpoints
  console.log('1. Testing API Endpoints...');
  try {
    const galleryResponse = await fetch('/api/gallery');
    console.log(`✅ Gallery API: ${galleryResponse.status}`);
    
    const uploadResponse = await fetch('/api/admin/gallery/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}) // Empty body to test endpoint existence
    });
    console.log(`📤 Upload API: ${uploadResponse.status} (${uploadResponse.status === 400 ? 'EXISTS' : 'MISSING'})`);
  } catch (error) {
    console.log(`❌ API Error: ${error.message}`);
  }
  
  // Test 2: Frontend Dialog Elements
  console.log('\n2. Testing Frontend Dialog Elements...');
  
  const uploadButtons = [
    document.querySelector('button:has-text("Upload")'),
    document.querySelector('[data-testid="upload-button"]'),
    document.querySelector('button[class*="upload"]'),
    document.querySelector('button:contains("Upload Media")')
  ].filter(Boolean);
  
  console.log(`📱 Upload buttons found: ${uploadButtons.length}`);
  
  if (uploadButtons.length > 0) {
    const button = uploadButtons[0];
    console.log(`✅ Primary upload button: ${button.textContent}`);
    
    // Test button click
    try {
      button.click();
      
      setTimeout(() => {
        const dialogs = [
          document.querySelector('[role="dialog"]'),
          document.querySelector('.dialog'),
          document.querySelector('[data-testid="upload-dialog"]'),
          document.querySelector('[class*="modal"]')
        ].filter(Boolean);
        
        console.log(`🔄 Dialogs opened: ${dialogs.length}`);
        
        if (dialogs.length > 0) {
          const dialog = dialogs[0];
          console.log('✅ Dialog opened successfully');
          
          // Test form fields
          const fileInput = dialog.querySelector('input[type="file"]');
          const categorySelect = dialog.querySelector('select[name="category"]') || dialog.querySelector('[name="category"]');
          const submitButton = dialog.querySelector('button[type="submit"]') || dialog.querySelector('button:has-text("Upload")');
          
          console.log(`📎 File input: ${!!fileInput}`);
          console.log(`📂 Category select: ${!!categorySelect}`);
          console.log(`🚀 Submit button: ${!!submitButton}`);
          
          if (submitButton) {
            console.log(`🔒 Submit button disabled: ${submitButton.disabled}`);
          }
          
          // Close dialog
          const cancelButton = dialog.querySelector('button:has-text("Cancel")') || dialog.querySelector('[aria-label="Close"]');
          if (cancelButton) {
            cancelButton.click();
            console.log('🔄 Dialog closed');
          }
        } else {
          console.log('❌ No dialog opened - THIS IS THE ISSUE');
        }
      }, 500);
    } catch (error) {
      console.log(`❌ Button click error: ${error.message}`);
    }
  } else {
    console.log('❌ No upload buttons found');
  }
  
  // Test 3: JavaScript Errors
  console.log('\n3. Checking for JavaScript Errors...');
  const errors = window.jsErrors || [];
  if (errors.length > 0) {
    console.log('❌ JavaScript Errors Found:');
    errors.forEach(error => console.log(`   - ${error}`));
  } else {
    console.log('✅ No JavaScript errors detected');
  }
  
  // Test 4: React State
  console.log('\n4. Testing React Component State...');
  try {
    // Check if React DevTools are available
    if (window.React) {
      console.log('✅ React is loaded');
    } else {
      console.log('⚠️ React not detected in global scope');
    }
  } catch (error) {
    console.log(`❌ React state error: ${error.message}`);
  }
  
  console.log('\n🎯 Test Complete - Check results above');
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  testUploadDialogFix();
}
