import { storage } from './storage';
import { db } from './db';
import { galleryImages } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Function to update mediaType of MP4 files to 'video'
async function updateVideoMediaTypes() {
  try {
    console.log('Starting video mediaType update...');
    
    // Get all gallery images
    const images = await dataStorage.getGalleryImages();
    console.log(`Found ${images.length} gallery items`);
    
    let updatedCount = 0;
    
    // Loop through images and check file extensions
    for (const image of images) {
      // Check if the file is an MP4 but mediaType is not set to 'video'
      const isMP4 = image.imageUrl.toLowerCase().endsWith('.mp4');
      
      if (isMP4 && image.mediaType !== 'video') {
        console.log(`Updating mediaType for ID: ${image.id}, File: ${image.imageUrl}`);
        
        // Update the mediaType to 'video'
        await db.update(galleryImages)
          .set({ mediaType: 'video' })
          .where(eq(galleryImages.id, image.id));
          
        updatedCount++;
      }
    }
    
    console.log(`Update complete. Updated ${updatedCount} items.`);
    return { success: true, updated: updatedCount };
  } catch (error) {
    console.error('Error updating video mediaTypes:', error);
    return { success: false, error };
  }
}

// Run the update function
updateVideoMediaTypes().then((result) => {
  console.log('Update script result:', result);
  process.exit(0);
}).catch((error) => {
  console.error('Update script failed:', error);
  process.exit(1);
});