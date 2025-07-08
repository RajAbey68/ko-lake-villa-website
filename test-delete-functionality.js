/**
 * Delete Button Functionality Test
 * Tests if the delete button is working in the gallery manager
 */

async function testDeleteFunctionality() {
  console.log('🗑️ Testing Delete Button Functionality...\n');
  
  try {
    // Test 1: Check gallery images exist
    console.log('1. Checking for existing gallery images...');
    const galleryResponse = await fetch('/api/gallery');
    
    if (!galleryResponse.ok) {
      console.log('❌ Failed to fetch gallery images');
      return;
    }
    
    const images = await galleryResponse.json();
    console.log(`✅ Found ${images.length} images in gallery`);
    
    if (images.length === 0) {
      console.log('⚠️ No images to test delete functionality');
      return;
    }
    
    // Test 2: Test delete endpoint directly
    const testImage = images[0];
    console.log(`\n2. Testing delete endpoint for image ID: ${testImage.id}`);
    
    const deleteResponse = await fetch(`/api/admin/gallery/${testImage.id}`, {
      method: 'DELETE'
    });
    
    console.log(`Delete response status: ${deleteResponse.status}`);
    
    if (deleteResponse.ok) {
      const result = await deleteResponse.json();
      console.log('✅ Delete API working:', result.message);
      
      // Verify deletion worked
      const verifyResponse = await fetch('/api/gallery');
      if (verifyResponse.ok) {
        const updatedImages = await verifyResponse.json();
        const imageStillExists = updatedImages.find(img => img.id === testImage.id);
        
        if (!imageStillExists) {
          console.log('✅ Image successfully deleted from database');
        } else {
          console.log('❌ Image still exists in database after delete');
        }
      }
    } else {
      const errorText = await deleteResponse.text();
      console.log('❌ Delete failed:', errorText);
    }
    
    // Test 3: Test bulk delete endpoint
    console.log('\n3. Testing bulk delete endpoint...');
    const remainingImages = await fetch('/api/gallery').then(r => r.json());
    
    if (remainingImages.length > 0) {
      const testIds = [remainingImages[0].id];
      
      const bulkDeleteResponse = await fetch('/api/admin/gallery/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: testIds })
      });
      
      if (bulkDeleteResponse.ok) {
        const result = await bulkDeleteResponse.json();
        console.log('✅ Bulk delete API working:', result.message);
      } else {
        console.log('❌ Bulk delete failed:', bulkDeleteResponse.status);
      }
    }
    
    // Test 4: Check if admin page has delete buttons
    console.log('\n4. Checking admin gallery page for delete buttons...');
    
    if (window.location.pathname.includes('/admin/gallery')) {
      // Look for delete buttons in the UI
      const deleteButtons = document.querySelectorAll('button[aria-label*="delete"], button:has(svg[data-icon="trash"])');
      console.log(`Found ${deleteButtons.length} potential delete buttons in UI`);
      
      // Look for trash icons
      const trashIcons = document.querySelectorAll('svg[data-icon="trash"], [data-testid="trash-icon"]');
      console.log(`Found ${trashIcons.length} trash icons in UI`);
      
      if (deleteButtons.length > 0 || trashIcons.length > 0) {
        console.log('✅ Delete buttons/icons found in UI');
      } else {
        console.log('❌ No delete buttons found in UI');
      }
    } else {
      console.log('ℹ️ Not on admin gallery page - UI test skipped');
    }
    
  } catch (error) {
    console.log('❌ Test failed with error:', error.message);
  }
}

// Function to check page UI specifically
function checkDeleteButtonsInUI() {
  console.log('\n🔍 Checking Delete Buttons in Current Page UI...\n');
  
  // Check for various delete button patterns
  const patterns = [
    'button[aria-label*="delete"]',
    'button[aria-label*="Delete"]',
    'button:has([data-icon="trash"])',
    'button:has(svg[class*="trash"])',
    '[data-testid*="delete"]',
    'button[class*="destructive"]'
  ];
  
  let totalFound = 0;
  
  patterns.forEach((pattern, index) => {
    const elements = document.querySelectorAll(pattern);
    if (elements.length > 0) {
      console.log(`✅ Pattern ${index + 1}: Found ${elements.length} elements with "${pattern}"`);
      totalFound += elements.length;
    }
  });
  
  if (totalFound === 0) {
    console.log('❌ No delete buttons found with common patterns');
    
    // Look for any buttons that might be delete buttons
    const allButtons = document.querySelectorAll('button');
    const suspiciousButtons = Array.from(allButtons).filter(btn => 
      btn.textContent?.toLowerCase().includes('delete') ||
      btn.getAttribute('aria-label')?.toLowerCase().includes('delete') ||
      btn.querySelector('[data-icon="trash"]') ||
      btn.querySelector('svg[class*="trash"]')
    );
    
    console.log(`Found ${suspiciousButtons.length} buttons that might be delete buttons`);
    suspiciousButtons.forEach((btn, i) => {
      console.log(`  ${i + 1}. Text: "${btn.textContent?.trim()}", Class: "${btn.className}"`);
    });
  } else {
    console.log(`\n✅ Total delete buttons found: ${totalFound}`);
  }
}

// Auto-run tests
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
      testDeleteFunctionality();
      setTimeout(checkDeleteButtonsInUI, 2000);
    }, 1000);
  });
} else {
  setTimeout(() => {
    testDeleteFunctionality();
    setTimeout(checkDeleteButtonsInUI, 2000);
  }, 500);
}

// Export for manual testing
window.testDeleteFunctionality = testDeleteFunctionality;
window.checkDeleteButtonsInUI = checkDeleteButtonsInUI;

console.log('Delete functionality test loaded. Testing delete button operations...');