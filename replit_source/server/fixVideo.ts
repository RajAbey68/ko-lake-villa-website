import { storage } from './storage';

async function fixVideoType() {
  try {
    console.log('Getting all gallery images...');
    const images = await storage.getGalleryImages();
    console.log(`Found ${images.length} images`);
    
    // Find the specific video record
    const videoPath = '/uploads/gallery/default/1747345835546-656953027-20250420_170537.mp4';
    const videoItem = images.find(img => img.imageUrl === videoPath);
    
    if (videoItem) {
      console.log('Found video item:', videoItem);
      
      // Update the record
      await storage.updateGalleryImage({
        ...videoItem,
        mediaType: 'video'
      });
      
      console.log('Video record updated successfully');
    } else {
      console.log('Video not found in database. Looking for similar paths...');
      
      // Look for similar paths
      const possibleMatches = images.filter(img => 
        img.imageUrl.includes('1747345835546') || 
        img.imageUrl.includes('20250420_170537') ||
        img.imageUrl.endsWith('.mp4')
      );
      
      console.log('Possible matches:', possibleMatches);
      
      // If we found any possible matches, update them
      if (possibleMatches.length > 0) {
        for (const match of possibleMatches) {
          console.log(`Updating match: ${match.id} - ${match.imageUrl}`);
          await storage.updateGalleryImage({
            ...match,
            mediaType: 'video'
          });
        }
        console.log(`Updated ${possibleMatches.length} potential video records`);
      }
    }
    
    // Also check and update any recent uploads
    const recentItems = images
      .filter(img => img.id > 20) // Focus on more recent uploads
      .filter(img => img.mediaType !== 'video'); // Only those not already marked as video
      
    console.log('Recent items to check:', recentItems);
    
    for (const item of recentItems) {
      console.log(`Updating recent item: ${item.id} - ${item.imageUrl}`);
      await storage.updateGalleryImage({
        ...item,
        mediaType: 'video'
      });
    }
    
    console.log('Fix complete');
  } catch (error) {
    console.error('Error fixing video type:', error);
  }
}

// Run the function
fixVideoType().then(() => {
  console.log('Done');
  process.exit(0);
}).catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});