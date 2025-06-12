/**
 * Direct Edit Button Test - Run in browser console on /admin/gallery
 */

// Test edit button functionality immediately
console.log('=== DIRECT EDIT BUTTON TEST ===');

// Wait a moment for page to fully load
setTimeout(() => {
  // Find edit buttons
  const editButtons = document.querySelectorAll('button[title*="Edit"], button:has(.lucide-edit)');
  console.log(`Found ${editButtons.length} edit buttons`);
  
  if (editButtons.length > 0) {
    console.log('Clicking edit button...');
    editButtons[0].click();
    
    // Check immediately for any dialog
    setTimeout(() => {
      const allDialogs = document.querySelectorAll('[role="dialog"]');
      const taggingDialog = document.querySelector('[aria-describedby="dialog-description"]');
      const anyModal = document.querySelector('.fixed, [data-state="open"]');
      
      console.log('Total dialogs:', allDialogs.length);
      console.log('TaggingDialog:', !!taggingDialog);
      console.log('Any modal:', !!anyModal);
      
      if (allDialogs.length > 0) {
        console.log('✓ DIALOG OPENED');
        allDialogs.forEach((d, i) => console.log(`Dialog ${i}:`, d.className));
      } else {
        console.log('✗ NO DIALOG - EDIT BUTTON FAILED');
        
        // Check React state
        const reactFiber = editButtons[0]._reactInternalFiber || editButtons[0]._reactInternals;
        if (reactFiber) {
          console.log('React component found - checking state...');
        }
      }
    }, 500);
  } else {
    console.log('✗ NO EDIT BUTTONS FOUND');
  }
}, 1000);

console.log('Edit test running...');