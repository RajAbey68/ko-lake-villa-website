import { storage } from './storage';
import { db } from './db';
import { galleryImages } from '@shared/schema';
import { eq } from 'drizzle-orm';

// Function to update mediaType of MP4 files to 'video'
async function updateVideoMediaTypes() {
  try {
    console.log('Starting video mediaType update...');
    
    // Get all gallery images
    const images = await storage.getGalleryImages();
    console.log(`Found ${images.length} gallery items`);
    
    let updatedCount = 0;
    
    // Loop through images and check file extensions
    for (const image of images) {
      // Check if the file is an MP4 or if the URL contains YouTube links
      const isMP4 = image.imageUrl.toLowerCase().endsWith('.mp4');
      const isYouTube = image.imageUrl.includes('youtube.com') || image.imageUrl.includes('youtu.be');
      
      if ((isMP4 || isYouTube) && image.mediaType !== 'video') {
        console.log(`Updating mediaType for ID: ${image.id}, File: ${image.imageUrl}`);
        
        try {
          // For MemStorage implementation, we need to update the full object
          await storage.updateGalleryImage({
            id: image.id,
            mediaType: 'video'
          });
          
          updatedCount++;
        } catch (err) {
          console.error(`Failed to update gallery item ${image.id}:`, err);
        }
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