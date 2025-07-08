// Script to update gallery images with placeholder images
const fs = require('fs');
const path = require('path');

// Categories from our website
const CATEGORIES = [
  'family-suite',
  'group-room',
  'triple-room',
  'dining-area',
  'pool-deck',
  'lake-garden',
  'roof-garden',
  'front-garden',
  'koggala-lake',
  'excursions'
];

// Format the category name for display
function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Process a single category by creating placeholder images
async function processCategory(category) {
  const storage = require('./server/storage').storage;
  const categoryName = formatCategoryName(category);
  
  console.log(`Processing category: ${categoryName}`);
  
  // Get existing images for this category
  const existingImages = await storage.getGalleryImagesByCategory(category);
  console.log(`Found ${existingImages.length} existing images for ${categoryName}`);
  
  // If there are existing images, update their URLs
  if (existingImages.length > 0) {
    for (const image of existingImages) {
      console.log(`Updating image ${image.id}: ${image.alt}`);
      
      // Update the image with a placeholder URL
      const updatedImage = await storage.updateGalleryImage({
        id: image.id,
        imageUrl: `/uploads/gallery/${category}/placeholder-${image.id}.jpg`,
        // Keep all other properties the same
      });
      
      console.log(`Updated image: ${updatedImage.id} - ${updatedImage.imageUrl}`);
    }
  }
  // If no images exist for this category, create some placeholder ones
  else {
    console.log(`No images found for ${categoryName}, creating placeholders...`);
    
    // Create 2 placeholder images for this category
    for (let i = 1; i <= 2; i++) {
      const newImage = {
        imageUrl: `/uploads/gallery/${category}/placeholder-${i}.jpg`,
        alt: `${categoryName} Image ${i}`,
        category: category,
        featured: i === 1, // First image is featured
        sortOrder: i,
        mediaType: 'image',
        description: `Placeholder image for ${categoryName}`,
        fileSize: null,
        tags: category
      };
      
      const createdImage = await storage.createGalleryImage(newImage);
      console.log(`Created placeholder image: ${createdImage.id} - ${createdImage.imageUrl}`);
    }
  }
}

// Main function to process all categories
async function main() {
  try {
    console.log('Starting gallery image update process...');
    
    // Process each category
    for (const category of CATEGORIES) {
      await processCategory(category);
    }
    
    console.log('Gallery image update completed successfully!');
  } catch (error) {
    console.error('Error updating gallery images:', error);
  }
}

// Run the script
main();