import { storage } from './storage';

async function addVideoToDatabase() {
  try {
    console.log('Adding video to the database...');
    
    // Video details
    const videoPath = '/uploads/gallery/default/1747345835546-656953027-20250420_170537.mp4';
    const videoTitle = 'Lake boat';
    const videoCategory = 'koggala-lake';
    const videoDescription = 'lake fun fun';
    
    // Create the video entry
    const videoEntry = await storage.createGalleryImage({
      imageUrl: videoPath,
      alt: videoTitle,
      description: videoDescription,
      category: videoCategory,
      tags: '',
      featured: false,
      mediaType: 'video',
      sortOrder: 0
    });
    
    console.log('Video added successfully:', videoEntry);
    return videoEntry;
  } catch (error) {
    console.error('Error adding video to database:', error);
    throw error;
  }
}

// Run the function
addVideoToDatabase().then(result => {
  console.log('Done with result:', result);
  process.exit(0);
}).catch(err => {
  console.error('Script failed:', err);
  process.exit(1);
});