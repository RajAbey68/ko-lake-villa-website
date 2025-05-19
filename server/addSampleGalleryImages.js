import fs from 'fs';
import path from 'path';
import { Pool } from '@neondatabase/serverless';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Function to get all image files from the uploads directory
async function getUploadedImages() {
  const uploadsDir = path.join(process.cwd(), 'uploads', 'gallery');
  
  try {
    // Get all subdirectories in the uploads/gallery folder
    const categories = await fs.promises.readdir(uploadsDir);
    const imageFiles = [];
    
    // Process each category folder
    for (const category of categories) {
      const categoryPath = path.join(uploadsDir, category);
      
      // Skip if not a directory
      const stats = await fs.promises.stat(categoryPath);
      if (!stats.isDirectory()) continue;
      
      // Get files in this category folder
      const files = await fs.promises.readdir(categoryPath);
      
      for (const file of files) {
        // Skip .DS_Store and other hidden files
        if (file.startsWith('.')) continue;
        
        const filePath = path.join(categoryPath, file);
        const fileStats = await fs.promises.stat(filePath);
        
        // Skip if not a file or empty file
        if (!fileStats.isFile() || fileStats.size === 0) continue;
        
        // Get file extension to determine media type
        const ext = path.extname(file).toLowerCase();
        const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(ext);
        
        // Create a database-friendly image path
        const dbImagePath = `/uploads/gallery/${category}/${file}`;
        
        // Extract a name from the filename (remove timestamp and extension)
        let name = file.split('-').slice(2).join('-');
        name = name.replace(/\.[^/.]+$/, ""); // Remove extension
        name = name.split('_').join(' '); // Replace underscores with spaces
        
        imageFiles.push({
          imageUrl: dbImagePath,
          category: category,
          alt: name || 'Ko Lake House Image',
          mediaType: isVideo ? 'video' : 'image',
          sortOrder: imageFiles.length,
          featured: false
        });
      }
    }
    
    return imageFiles;
  } catch (error) {
    console.error('Error reading upload directory:', error);
    return [];
  }
}

// Function to insert images into the database
async function addImagesToDatabase(images) {
  // First clear existing images
  await pool.query('DELETE FROM gallery_images');
  
  let inserted = 0;
  
  for (const image of images) {
    try {
      const query = `
        INSERT INTO gallery_images 
        (image_url, category, alt, media_type, sort_order, featured) 
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
      `;
      
      const values = [
        image.imageUrl,
        image.category,
        image.alt,
        image.mediaType,
        image.sortOrder,
        image.featured
      ];
      
      const result = await pool.query(query, values);
      console.log(`Added image to gallery: ${image.alt} (ID: ${result.rows[0].id})`);
      inserted++;
    } catch (error) {
      console.error(`Error inserting image ${image.alt}:`, error);
    }
  }
  
  return inserted;
}

// Main function
async function main() {
  try {
    console.log('Starting gallery image import...');
    
    // Get all images from uploads directory
    const images = await getUploadedImages();
    console.log(`Found ${images.length} images in uploads directory`);
    
    if (images.length === 0) {
      console.log('No images found to import');
      process.exit(0);
    }
    
    // Add images to database
    const insertedCount = await addImagesToDatabase(images);
    console.log(`Successfully imported ${insertedCount} images to the gallery`);
    
    // Close the database connection
    await pool.end();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error in main function:', error);
    process.exit(1);
  }
}

// Run the main function
main();