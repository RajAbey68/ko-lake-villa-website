// Direct upload script for Ko Lake Villa gallery images
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const GALLERY_DIR = path.join(UPLOAD_DIR, 'gallery');
const LOG_FILE = path.join(UPLOAD_DIR, 'upload-log.json');

// Create directories if they don't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(GALLERY_DIR)) {
  fs.mkdirSync(GALLERY_DIR, { recursive: true });
}

// Sample category list
const CATEGORIES = [
  'Family Suite',
  'Group Room',
  'Triple Room',
  'Dining Area',
  'Pool Deck',
  'Lake Garden',
  'Roof Garden',
  'Front Garden and Entrance',
  'Koggala Lake Ahangama and Surrounding',
  'Excursions'
];

// Import images from a directory
async function importImagesFromDirectory(sourceDir, category) {
  console.log(`Importing images from: ${sourceDir}`);
  console.log(`Category: ${category}`);
  
  if (!fs.existsSync(sourceDir)) {
    console.error(`Error: Source directory does not exist: ${sourceDir}`);
    return;
  }
  
  // Validate category
  if (!CATEGORIES.includes(category)) {
    console.error(`Error: Invalid category. Must be one of: ${CATEGORIES.join(', ')}`);
    return;
  }
  
  // Create category directory if it doesn't exist
  const categoryDir = path.join(GALLERY_DIR, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  // Read the directory
  const files = fs.readdirSync(sourceDir);
  const imageFiles = files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(ext);
  });
  
  console.log(`Found ${imageFiles.length} image files`);
  
  if (imageFiles.length === 0) {
    console.log('No image files found.');
    return;
  }
  
  // Process each image
  const importedImages = [];
  
  for (const imageFile of imageFiles) {
    const sourcePath = path.join(sourceDir, imageFile);
    
    // Create a unique filename
    const timestamp = Date.now();
    const uniqueSuffix = timestamp + '-' + Math.round(Math.random() * 1e9);
    const safeFilename = imageFile.replace(/[^a-zA-Z0-9.-]/g, '_');
    const newFilename = uniqueSuffix + '-' + safeFilename;
    
    const destPath = path.join(categoryDir, newFilename);
    
    // Copy the file
    fs.copyFileSync(sourcePath, destPath);
    
    // Create gallery entry
    const galleryEntry = {
      id: timestamp,
      imageUrl: `/uploads/gallery/${category}/${newFilename}`,
      alt: path.basename(imageFile, path.extname(imageFile)),
      description: `${category} - ${path.basename(imageFile, path.extname(imageFile))}`,
      category: category,
      featured: false,
      mediaType: 'image',
      sortOrder: 0,
      importDate: new Date().toISOString()
    };
    
    importedImages.push(galleryEntry);
    console.log(`Imported: ${imageFile} -> ${newFilename}`);
  }
  
  // Save to log file
  let existingLog = [];
  if (fs.existsSync(LOG_FILE)) {
    try {
      const logData = fs.readFileSync(LOG_FILE, 'utf8');
      existingLog = JSON.parse(logData);
    } catch (error) {
      console.error('Error reading log file:', error);
    }
  }
  
  const updatedLog = [...existingLog, ...importedImages];
  fs.writeFileSync(LOG_FILE, JSON.stringify(updatedLog, null, 2));
  
  console.log(`Successfully imported ${importedImages.length} images`);
  console.log(`Images stored in: ${categoryDir}`);
  console.log(`Log file updated: ${LOG_FILE}`);
  
  return importedImages;
}

// Command line argument parsing
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Usage: node upload-to-gallery.js <source-directory> <category>');
    console.log(`Available categories: ${CATEGORIES.join(', ')}`);
    return;
  }
  
  const sourceDir = args[0];
  const category = args[1];
  
  try {
    await importImagesFromDirectory(sourceDir, category);
  } catch (error) {
    console.error('Error during import:', error);
  }
}

main();