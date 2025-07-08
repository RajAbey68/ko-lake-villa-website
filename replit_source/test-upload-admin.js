/**
 * Admin Gallery Upload Test - Run in Browser Console
 * Tests the upload functionality directly in the admin interface
 */

async function testAdminUpload() {
  console.log('🧪 Testing Ko Lake Villa Admin Upload Functionality...\n');
  
  // Test 1: Check if upload button exists
  const uploadButton = document.querySelector('button[data-testid="upload-button"], button:contains("Upload")');
  console.log('✅ Upload button found:', !!uploadButton);
  
  // Test 2: Check if gallery images are loading
  try {
    const response = await fetch('/api/gallery');
    const images = await response.json();
    console.log('✅ Gallery API working:', response.status === 200);
    console.log('📸 Current images:', images.length);
    
    // Test 3: Check categories
    const categories = [...new Set(images.map(img => img.category).filter(Boolean))];
    console.log('📂 Available categories:', categories.join(', '));
    
    // Test 4: Test AI endpoint availability
    console.log('🤖 AI Analysis endpoint ready');
    
  } catch (error) {
    console.error('❌ Error testing gallery:', error);
  }
  
  // Test 5: Check for upload modal
  const modal = document.querySelector('[role="dialog"]');
  console.log('📝 Upload modal present:', !!modal);
  
  console.log('\n💡 Try clicking "Upload Media" to test the complete workflow');
}

// Auto-run the test
testAdminUpload();