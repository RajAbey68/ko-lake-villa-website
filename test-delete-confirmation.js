/**
 * Delete Confirmation Test
 * Tests the enhanced delete confirmation dialogs
 */

async function testDeleteConfirmation() {
  console.log('🗑️ Testing Delete Confirmation Functionality...\n');
  
  try {
    // Test 1: Check if we're on admin gallery page
    if (!window.location.pathname.includes('/admin/gallery')) {
      console.log('❌ Please run this test on the /admin/gallery page');
      return;
    }

    // Test 2: Look for delete buttons in the UI
    console.log('1. Checking for delete buttons...');
    
    const deleteButtons = document.querySelectorAll('button[title="Delete"]');
    console.log(`✅ Found ${deleteButtons.length} delete buttons`);
    
    if (deleteButtons.length === 0) {
      console.log('❌ No delete buttons found - hover over gallery images to see them');
      return;
    }

    // Test 3: Simulate clicking a delete button
    console.log('\n2. Testing delete button click...');
    
    const firstDeleteButton = deleteButtons[0];
    if (firstDeleteButton) {
      console.log('Clicking first delete button...');
      firstDeleteButton.click();
      
      // Wait for confirmation dialog
      setTimeout(() => {
        const confirmDialog = document.querySelector('[role="dialog"]');
        if (confirmDialog) {
          console.log('✅ Delete confirmation dialog appeared');
          
          // Check for warning message
          const warningElement = confirmDialog.querySelector('[class*="red-"]');
          if (warningElement) {
            console.log('✅ Warning message found in dialog');
          }
          
          // Check for cancel and delete buttons
          const cancelButton = confirmDialog.querySelector('button:has-text("Cancel")') ||
                              Array.from(confirmDialog.querySelectorAll('button')).find(btn => 
                                btn.textContent?.includes('Cancel')
                              );
          
          const deleteButton = confirmDialog.querySelector('button:has-text("Delete")') ||
                              Array.from(confirmDialog.querySelectorAll('button')).find(btn => 
                                btn.textContent?.includes('Delete')
                              );
          
          if (cancelButton) {
            console.log('✅ Cancel button found');
          }
          
          if (deleteButton) {
            console.log('✅ Delete confirmation button found');
          }
          
          // Test cancel functionality
          if (cancelButton) {
            console.log('Testing cancel functionality...');
            cancelButton.click();
            
            setTimeout(() => {
              const dialogStillOpen = document.querySelector('[role="dialog"]');
              if (!dialogStillOpen) {
                console.log('✅ Dialog closes when Cancel is clicked');
              } else {
                console.log('❌ Dialog still open after Cancel');
              }
            }, 500);
          }
          
        } else {
          console.log('❌ No confirmation dialog appeared');
        }
      }, 500);
    }

    // Test 4: Check bulk delete functionality
    console.log('\n3. Testing bulk delete confirmation...');
    
    // Look for checkboxes to select images
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    if (checkboxes.length > 0) {
      console.log(`Found ${checkboxes.length} selection checkboxes`);
      
      // Select first checkbox
      checkboxes[0].click();
      
      setTimeout(() => {
        const bulkDeleteButton = Array.from(document.querySelectorAll('button')).find(btn => 
          btn.textContent?.includes('Delete Selected')
        );
        
        if (bulkDeleteButton) {
          console.log('✅ Bulk delete button appeared');
          
          // Test bulk delete confirmation
          bulkDeleteButton.click();
          
          setTimeout(() => {
            const bulkDialog = document.querySelector('[role="dialog"]');
            if (bulkDialog && bulkDialog.textContent?.includes('Bulk Delete')) {
              console.log('✅ Bulk delete confirmation dialog appeared');
            } else {
              console.log('❌ Bulk delete confirmation dialog not found');
            }
          }, 500);
        } else {
          console.log('❌ Bulk delete button not found');
        }
      }, 500);
    } else {
      console.log('⚠️ No selection checkboxes found');
    }

  } catch (error) {
    console.log('❌ Test failed:', error.message);
  }
}

// Function to manually trigger delete button
function triggerDeleteButton() {
  const deleteButtons = document.querySelectorAll('button[title="Delete"]');
  if (deleteButtons.length > 0) {
    console.log('Triggering delete button...');
    deleteButtons[0].click();
  } else {
    console.log('No delete buttons found. Make sure to hover over gallery images.');
  }
}

// Auto-run test
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(testDeleteConfirmation, 2000);
  });
} else {
  setTimeout(testDeleteConfirmation, 1000);
}

// Export for manual testing
window.testDeleteConfirmation = testDeleteConfirmation;
window.triggerDeleteButton = triggerDeleteButton;

console.log('Delete confirmation test loaded. Enhanced confirmation dialogs now implemented.');