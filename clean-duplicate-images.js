/**
 * Clean Duplicate Images - Remove repeated food photos and keep authentic property images
 */

async function cleanDuplicateImages() {
  console.log('🧹 Cleaning duplicate and generic images from gallery');
  
  try {
    const response = await fetch('http://localhost:5000/api/gallery');
    const images = await response.json();
    console.log(`📋 Found ${images.length} gallery items`);
    
    let deletedCount = 0;
    const seenImages = new Set();
    
    for (const image of images) {
      let shouldDelete = false;
      
      // Delete if it's a WhatsApp food image (repeated multiple times)
      if (image.title && image.title.includes('WhatsApp_Image_2025-05-29_at_22.50.43')) {
        shouldDelete = true;
        console.log(`❌ Deleting WhatsApp food image: ${image.title}`);
      }
      
      // Delete if it has generic "full splendor" AI description
      if (image.description && image.description.includes('full splendor')) {
        shouldDelete = true;
        console.log(`❌ Deleting AI-generated content: ${image.title}`);
      }
      
      // Delete if it's a duplicate of the same file
      if (seenImages.has(image.imageUrl)) {
        shouldDelete = true;
        console.log(`❌ Deleting duplicate: ${image.title}`);
      } else {
        seenImages.add(image.imageUrl);
      }
      
      // Delete test images
      if (image.title && (image.title.includes('test_image') || image.title.includes('813125493'))) {
        shouldDelete = true;
        console.log(`❌ Deleting test image: ${image.title}`);
      }
      
      if (shouldDelete) {
        try {
          const deleteResponse = await fetch(`http://localhost:5000/api/gallery/${image.id}`, {
            method: 'DELETE'
          });
          
          if (deleteResponse.ok) {
            deletedCount++;
            console.log(`✅ Deleted: ${image.title || image.id}`);
          } else {
            console.log(`⚠️ Failed to delete ${image.id}: ${deleteResponse.status}`);
          }
        } catch (error) {
          console.log(`❌ Error deleting ${image.id}: ${error.message}`);
        }
        
        // Small delay to prevent server overload
        await new Promise(resolve => setTimeout(resolve, 50));
      } else {
        console.log(`✅ Keeping authentic image: ${image.title}`);
      }
    }
    
    console.log(`\n📊 Cleaned ${deletedCount} duplicate/generic images`);
    return { success: true, deletedCount };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

cleanDuplicateImages().then(result => {
  if (result.success) {
    console.log('\n🎉 Gallery cleaned - removed duplicates and generic content');
  } else {
    console.log('\n💥 Failed to clean gallery');
  }
});