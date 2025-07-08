const fs = require('fs');
const path = require('path');

// Configuration
const UPLOAD_DIR = path.join(process.cwd(), 'uploads');
const GALLERY_DIR = path.join(UPLOAD_DIR, 'gallery');

// Create directories if they don't exist
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}
if (!fs.existsSync(GALLERY_DIR)) {
  fs.mkdirSync(GALLERY_DIR, { recursive: true });
}

// Available categories
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

// Import a single image
function importImage(imagePath, category, description = '', featured = false) {
  // Validate inputs
  if (!fs.existsSync(imagePath)) {
    console.error(`Error: Image file not found: ${imagePath}`);
    return false;
  }
  
  if (!CATEGORIES.includes(category)) {
    console.error(`Error: Invalid category. Must be one of: ${CATEGORIES.join(', ')}`);
    console.error(`You provided: "${category}"`);
    return false;
  }
  
  // Create category directory
  const categoryDir = path.join(GALLERY_DIR, category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }
  
  // Generate unique filename
  const originalFilename = path.basename(imagePath);
  const timestamp = Date.now();
  const uniqueSuffix = timestamp + '-' + Math.round(Math.random() * 1e9);
  const safeFilename = originalFilename.replace(/[^a-zA-Z0-9.-]/g, '_');
  const newFilename = uniqueSuffix + '-' + safeFilename;
  
  // Destination path
  const destPath = path.join(categoryDir, newFilename);
  
  try {
    // Copy the file
    fs.copyFileSync(imagePath, destPath);
    
    // Create gallery entry for database
    const galleryEntry = {
      id: timestamp,
      imageUrl: `/uploads/gallery/${category}/${newFilename}`,
      alt: path.basename(originalFilename, path.extname(originalFilename)),
      description: description || `${category} image`,
      category: category,
      featured: featured,
      mediaType: 'image',
      sortOrder: 0,
      importDate: new Date().toISOString()
    };
    
    // Save entry to log file
    const logDir = path.join(UPLOAD_DIR, 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    const logFile = path.join(logDir, 'image-uploads.json');
    let uploads = [];
    
    if (fs.existsSync(logFile)) {
      try {
        uploads = JSON.parse(fs.readFileSync(logFile, 'utf8'));
      } catch (error) {
        console.error('Error reading upload log:', error);
      }
    }
    
    uploads.push(galleryEntry);
    fs.writeFileSync(logFile, JSON.stringify(uploads, null, 2), 'utf8');
    
    console.log(`✅ Successfully imported: ${originalFilename}`);
    console.log(`   Saved to: ${destPath}`);
    console.log(`   Category: ${category}`);
    return true;
  } catch (error) {
    console.error(`Error importing image:`, error);
    return false;
  }
}

// Main function
function main() {
  const args = process.argv.slice(2);
  
  if (args.length < 2) {
    console.log('Ko Lake Villa - Image Uploader');
    console.log('==============================');
    console.log('Usage: node upload-image.js <image-path> <category> [description] [featured]');
    console.log(`Available categories: ${CATEGORIES.join(', ')}`);
    console.log('Example: node upload-image.js ./my-photo.jpg "Family Suite" "Beautiful view" true');
    return;
  }
  
  const imagePath = args[0];
  const category = args[1];
  const description = args[2] || '';
  const featured = args[3] === 'true';
  
  importImage(imagePath, category, description, featured);
}

main();