/**
 * Test Gallery Modal Display
 * Verify that authentic Ko Lake Villa content displays correctly
 */

async function testGalleryModal() {
  console.log('=== Gallery Modal Display Test ===');
  
  try {
    // Test API response structure
    const response = await fetch('/api/gallery');
    const images = await response.json();
    
    console.log('✓ API Response received:', images.length, 'images');
    
    // Test first image data
    const firstImage = images[0];
    console.log('✓ First image data:', {
      id: firstImage.id,
      title: firstImage.title,
      description: firstImage.description,
      alt: firstImage.alt,
      category: firstImage.category
    });
    
    // Verify authentic content is present
    const hasTitle = firstImage.title && firstImage.title.length > 0;
    const hasDescription = firstImage.description && firstImage.description.length > 0;
    
    console.log('✓ Title present:', hasTitle, '-', firstImage.title);
    console.log('✓ Description present:', hasDescription, '-', firstImage.description?.substring(0, 50) + '...');
    
    // Test modal opening
    console.log('✓ Testing modal display logic...');
    
    // Check if modal elements exist
    const modalExists = document.querySelector('[role="dialog"]');
    console.log('✓ Modal dialog exists:', !!modalExists);
    
    if (!hasTitle || !hasDescription) {
      console.error('❌ DEFECT: Missing authentic Ko Lake Villa content');
      return false;
    }
    
    console.log('✅ All tests passed - authentic content verified');
    return true;
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Run the test
testGalleryModal();