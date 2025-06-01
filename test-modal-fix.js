/**
 * Ko Lake Villa Gallery Modal Fix Test
 * Comprehensive test to verify modal display of authentic content
 */

async function testModalFix() {
  console.log('=== Ko Lake Villa Gallery Modal Test ===');
  
  try {
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Test 1: Verify gallery images are loaded
    const galleryImages = document.querySelectorAll('[data-testid="gallery-image"], .group.overflow-hidden');
    console.log('✓ Gallery images found:', galleryImages.length);
    
    if (galleryImages.length === 0) {
      console.error('❌ No gallery images found');
      return false;
    }
    
    // Test 2: Verify authentic titles are displayed on thumbnails
    const titleElements = document.querySelectorAll('.text-\\[\\#8B5E3C\\].font-medium');
    console.log('✓ Title elements found:', titleElements.length);
    
    titleElements.forEach((el, index) => {
      console.log(`  Title ${index + 1}:`, el.textContent);
    });
    
    // Test 3: Simulate modal opening
    console.log('✓ Attempting to open modal...');
    
    const firstImage = galleryImages[0];
    if (firstImage) {
      firstImage.click();
      
      // Wait for modal to open
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if modal opened
      const modal = document.querySelector('[role="dialog"]');
      console.log('✓ Modal opened:', !!modal);
      
      if (modal) {
        // Check modal content
        const modalTitle = modal.querySelector('h2');
        const modalDescription = modal.querySelector('p.text-gray-700');
        
        console.log('✓ Modal title:', modalTitle?.textContent || 'NOT FOUND');
        console.log('✓ Modal description:', modalDescription?.textContent?.substring(0, 50) + '...' || 'NOT FOUND');
        
        // Close modal
        const closeButton = modal.querySelector('button');
        if (closeButton) closeButton.click();
        
        if (!modalTitle || !modalDescription) {
          console.error('❌ DEFECT: Modal content missing');
          return false;
        }
      } else {
        console.error('❌ DEFECT: Modal failed to open');
        return false;
      }
    }
    
    console.log('✅ All tests passed');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Auto-run test when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', testModalFix);
} else {
  testModalFix();
}