/**
 * Manual Category Persistence Test
 * Run this in browser console on /admin/gallery page
 */

async function testCategoryPersistence() {
  console.log('🧪 Testing Category Persistence Fix...');
  
  // Step 1: Find the first edit button
  const editButton = document.querySelector('button[aria-label="Edit Image"]');
  if (!editButton) {
    console.error('❌ No edit button found. Make sure you are on /admin/gallery');
    return;
  }
  
  console.log('✅ Found edit button, clicking...');
  editButton.click();
  
  // Wait for modal to appear
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Step 2: Find category dropdown
  const categorySelect = document.querySelector('select[name="category"]');
  if (!categorySelect) {
    console.error('❌ Category dropdown not found');
    return;
  }
  
  // Store original value
  const originalCategory = categorySelect.value;
  console.log('📝 Original category:', originalCategory);
  
  // Step 3: Change to different category
  const newCategory = originalCategory === 'pool-deck' ? 'triple-room' : 'pool-deck';
  categorySelect.value = newCategory;
  categorySelect.dispatchEvent(new Event('change'));
  
  console.log('🔄 Changed category to:', newCategory);
  
  // Step 4: Click Save
  const saveButton = document.querySelector('button:has-text("Save Tags")') || 
                    Array.from(document.querySelectorAll('button')).find(btn => 
                      btn.textContent.includes('Save'));
  
  if (!saveButton) {
    console.error('❌ Save button not found');
    return;
  }
  
  console.log('💾 Clicking save...');
  saveButton.click();
  
  // Wait for save to complete
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Step 5: Refresh page
  console.log('🔄 Refreshing page to test persistence...');
  window.location.reload();
}

// Instructions for manual testing
console.log(`
📋 Manual Category Persistence Test Instructions:

1. Go to /admin/gallery
2. Run: testCategoryPersistence()
3. Wait for page to refresh
4. Click edit on the same image
5. Check if the category stayed changed

Or test manually:
1. Click any image's edit button (pencil icon)
2. Change the category dropdown
3. Click "Save Tags"
4. Refresh the page
5. Edit the same image again
6. Verify the category persisted
`);

// Export for use
window.testCategoryPersistence = testCategoryPersistence;