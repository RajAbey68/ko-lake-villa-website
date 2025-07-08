/**
 * Fix Gallery Titles - Replace timestamp IDs with proper descriptive titles
 */

async function fixGalleryTitles() {
  console.log('🔧 Fixing gallery titles - removing timestamp IDs');
  
  try {
    // Get current gallery images
    const response = await fetch('/api/gallery');
    if (!response.ok) {
      throw new Error(`Failed to fetch gallery: ${response.status}`);
    }
    
    const images = await response.json();
    console.log(`📋 Found ${images.length} gallery items to review`);
    
    let updatedCount = 0;
    
    for (const image of images) {
      // Check if title is a timestamp ID (long number)
      const isTimestampId = /^\d{13,}$/.test(image.title);
      
      if (isTimestampId) {
        console.log(`❌ Found timestamp ID title: ${image.title}`);
        
        // Generate proper title based on category and content
        let newTitle = '';
        
        if (image.category === 'entire-villa') {
          newTitle = 'Ko Lake Villa - Complete Property View';
        } else if (image.category === 'family-suite') {
          newTitle = 'Master Family Suite';
        } else if (image.category === 'triple-room') {
          newTitle = 'Triple/Twin Room';
        } else if (image.category === 'group-room') {
          newTitle = 'Group Room Accommodation';
        } else if (image.category === 'pool-deck') {
          newTitle = 'Pool Deck & Swimming Area';
        } else if (image.category === 'dining-area') {
          newTitle = 'Dining Area';
        } else if (image.category === 'lake-garden') {
          newTitle = 'Lake Garden Views';
        } else if (image.category === 'koggala-lake') {
          newTitle = 'Koggala Lake Views';
        } else if (image.alt) {
          newTitle = image.alt;
        } else {
          newTitle = 'Ko Lake Villa Experience';
        }
        
        // Update the image with proper title
        try {
          const updateResponse = await fetch(`/api/admin/gallery/${image.id}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...image,
              title: newTitle,
              alt: newTitle
            })
          });
          
          if (updateResponse.ok) {
            console.log(`✅ Updated: ${image.title} → ${newTitle}`);
            updatedCount++;
          } else {
            console.log(`⚠️ Failed to update image ${image.id}: ${updateResponse.status}`);
          }
        } catch (error) {
          console.log(`❌ Error updating image ${image.id}: ${error.message}`);
        }
      } else if (image.title) {
        console.log(`✅ Good title: ${image.title}`);
      }
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`- Total images reviewed: ${images.length}`);
    console.log(`- Timestamp IDs fixed: ${updatedCount}`);
    console.log(`- Gallery now has proper descriptive titles`);
    
    return {
      success: true,
      totalImages: images.length,
      updatedCount,
      message: 'Gallery titles cleaned up successfully'
    };
    
  } catch (error) {
    console.error('❌ Failed to fix gallery titles:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the fix
fixGalleryTitles().then(result => {
  if (result.success) {
    console.log('\n🎉 SUCCESS: Gallery titles now show proper descriptions instead of timestamp IDs');
  } else {
    console.log('\n💥 FAILED: Could not fix gallery titles');
  }
});