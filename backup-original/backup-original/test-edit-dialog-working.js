/**
 * Test edit dialog functionality - run in browser console on /admin/gallery
 */

console.log('=== TESTING EDIT DIALOG ===');

setTimeout(() => {
  // Find edit buttons
  const editButtons = document.querySelectorAll('button[title*="Edit"], button:has(.lucide-edit)');
  console.log(`Found ${editButtons.length} edit buttons`);
  
  if (editButtons.length > 0) {
    console.log('Clicking edit button...');
    editButtons[0].click();
    
    // Check for custom dialog
    setTimeout(() => {
      const customDialog = document.querySelector('.fixed.inset-0.z-50');
      const dialogContent = document.querySelector('.bg-white.rounded-lg.shadow-xl');
      const editForm = document.querySelector('input[value]'); // Look for form inputs
      
      console.log('Custom dialog found:', !!customDialog);
      console.log('Dialog content found:', !!dialogContent);
      console.log('Form inputs found:', !!editForm);
      
      if (customDialog && dialogContent) {
        console.log('✓ EDIT DIALOG IS WORKING!');
        
        // Test form fields
        const categorySelect = document.querySelector('select, [role="combobox"]');
        const titleInput = document.querySelector('input[placeholder*="title"]');
        const descTextarea = document.querySelector('textarea');
        
        console.log('Category field:', !!categorySelect);
        console.log('Title field:', !!titleInput);
        console.log('Description field:', !!descTextarea);
        
        // Test close button
        const closeButton = document.querySelector('button:contains("×"), button:contains("Cancel")');
        if (closeButton) {
          closeButton.click();
          console.log('Dialog closed successfully');
        }
      } else {
        console.log('✗ Edit dialog not working');
      }
    }, 1000);
  }
  
  // Test other functionality
  setTimeout(() => {
    console.log('\n=== TESTING OTHER FUNCTIONS ===');
    
    // Test delete buttons
    const deleteButtons = document.querySelectorAll('button[title*="Delete"]');
    console.log(`Delete buttons found: ${deleteButtons.length}`);
    
    // Test upload button
    const uploadButton = document.querySelector('button:has(.lucide-upload)');
    console.log('Upload button found:', !!uploadButton);
    
    // Test video clicks
    const videos = document.querySelectorAll('video');
    console.log(`Videos found: ${videos.length}`);
    
  }, 3000);
  
}, 1500);