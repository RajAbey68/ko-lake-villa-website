// Script to add the downloaded images to the gallery database
import { storage } from './storage';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = path.join(process.cwd(), 'uploads');
const GALLERY_DIR = path.join(UPLOADS_DIR, 'gallery');

// Categories to process
const categories = [
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

// Format category name for display
function formatCategoryName(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Process files in a category directory
async function processCategory(category) {
  const categoryDir = path.join(GALLERY_DIR, category);
  
  // Skip if directory doesn't exist
  if (!fs.existsSync(categoryDir)) {
    console.log(`Directory ${categoryDir} does not exist. Skipping.`);
    return;
  }
  
  // Get all files in this category directory
  const files = fs.readdirSync(categoryDir);
  
  if (files.length === 0) {
    console.log(`No files found in ${category}. Skipping.`);
    return;
  }
  
  console.log(`Processing ${files.length} files in ${category}...`);
  
  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const filePath = path.join(categoryDir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isFile()) {
      const fileUrl = `/uploads/gallery/${category}/${file}`;
      const isVideo = file.endsWith('.mp4') || file.endsWith('.mov') || file.endsWith('.avi');
      
      try {
        // Create gallery image entry
        const [galleryImage] = await db.insert(galleryImages).values({
          imageUrl: fileUrl,
          alt: `${formatCategoryName(category)} - ${i + 1}`,
          description: `Image from ${formatCategoryName(category)} at Ko Lake House`,
          category: category,
          tags: category,
          featured: i === 0, // Set first image as featured
          mediaType: isVideo ? 'video' : 'image',
          sortOrder: i
        }).returning();
        
        console.log(`Added ${fileUrl} to gallery as ${galleryImage.id}`);
      } catch (error) {
        console.error(`Failed to add ${fileUrl} to gallery:`, error);
      }
    }
  }
}

// Main function to process all categories
async function main() {
  try {
    console.log('Starting gallery update process...');
    
    // Process each category
    for (const category of categories) {
      await processCategory(category);
    }
    
    console.log('Gallery update completed successfully!');
  } catch (error) {
    console.error('Error updating gallery:', error);
  } finally {
    // Close database connection when done
    await db.client.end();
  }
}

// Run the main function
main();