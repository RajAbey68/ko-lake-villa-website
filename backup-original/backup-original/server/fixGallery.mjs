import fs from 'fs';
import path from 'path';
import { Pool } from '@neondatabase/serverless';
import { fileURLToPath } from 'url';
import { config } from 'dotenv';
import ws from 'ws';

// Initialize environment variables
config();

// Required for Neon database
import { neonConfig } from '@neondatabase/serverless';
neonConfig.webSocketConstructor = ws;

// Set up file paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cwd = process.cwd();

// Connect to the database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Function to get all image files from the uploads directory
async function getUploadedImages() {
  const uploadsDir = path.join(cwd, 'uploads');
  console.log(`Looking for images in: ${uploadsDir}`);
  
  try {
    // Create the directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      console.log(`Creating uploads directory: ${uploadsDir}`);
      fs.mkdirSync(uploadsDir, { recursive: true });
      fs.mkdirSync(path.join(uploadsDir, 'gallery'), { recursive: true });
      fs.mkdirSync(path.join(uploadsDir, 'gallery', 'default'), { recursive: true });
      return [];
    }
    
    // Find all image and video files recursively
    const imageFiles = [];
    const processDirectory = async (dir, category = 'default') => {
      const entries = await fs.promises.readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const entryPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          // Process subdirectory with category name from directory
          const subCategory = entry.name;
          await processDirectory(entryPath, subCategory);
        } else if (entry.isFile()) {
          // Skip hidden files, .DS_Store, etc.
          if (entry.name.startsWith('.')) continue;
          
          const stats = await fs.promises.stat(entryPath);
          if (stats.size === 0) continue; // Skip empty files
          
          // Determine file type
          const ext = path.extname(entry.name).toLowerCase();
          const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(ext);
          const isImage = ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
          
          if (!isImage && !isVideo) continue; // Skip non-media files
          
          // Create a database-friendly path relative to uploads folder
          const relativePath = path.relative(cwd, entryPath);
          const dbImagePath = `/${relativePath.replace(/\\/g, '/')}`;
          
          // Create a nice display name from filename
          // Remove timestamps and clean up filename
          let name = entry.name;
          // Remove any numbers and dashes at the beginning (from timestamp)
          name = name.replace(/^\d+-\d+-/, '');
          // Remove extension
          name = name.replace(/\.[^/.]+$/, ""); 
          // Replace underscores with spaces
          name = name.split('_').join(' '); 
          // Capitalize words
          name = name.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
          
          console.log(`Found media file: ${dbImagePath}`);
          
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
    };
    
    // Start processing from the uploads/gallery directory
    const galleryDir = path.join(uploadsDir, 'gallery');
    if (fs.existsSync(galleryDir)) {
      await processDirectory(galleryDir);
    } else {
      // Fallback to just using the uploads directory
      await processDirectory(uploadsDir);
    }
    
    return imageFiles;
  } catch (error) {
    console.error('Error reading uploads directory:', error);
    return [];
  }
}

// Function to clear existing gallery and add new images
async function updateGallery(images) {
  try {
    // First, delete all existing images from the gallery
    console.log('Removing all existing gallery entries...');
    const deleteResult = await pool.query('DELETE FROM gallery_images');
    console.log(`Deleted ${deleteResult.rowCount} existing gallery entries`);
    
    // No images to add
    if (images.length === 0) {
      console.log('No images found to add to gallery');
      return 0;
    }
    
    // Add each image to the gallery
    let insertedCount = 0;
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
        console.log(`Added to gallery: ${image.alt} (ID: ${result.rows[0].id})`);
        insertedCount++;
      } catch (error) {
        console.error(`Error inserting image ${image.alt}:`, error);
      }
    }
    
    return insertedCount;
  } catch (error) {
    console.error('Database error:', error);
    return 0;
  }
}

// Main function
async function main() {
  try {
    console.log('Starting gallery cleanup and image import...');
    
    // Get all valid images from uploads directory
    const images = await getUploadedImages();
    console.log(`Found ${images.length} valid media files in uploads directory`);
    
    // Update the gallery with these images
    const insertedCount = await updateGallery(images);
    console.log(`Successfully added ${insertedCount} images to the gallery`);
    
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