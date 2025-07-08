// This script replaces all zyrosite.com images with actual uploaded images
// Execute with: node server/replaceGalleryImages.js

const fs = require('fs');

// Find all uploaded images
function getUploadedImages() {
  const uploadsDir = './uploads/gallery';
  console.log(`Looking for images in ${uploadsDir}`);
  
  try {
    if (!fs.existsSync(uploadsDir)) {
      console.error(`Uploads directory doesn't exist: ${uploadsDir}`);
      return [];
    }
    
    const categories = fs.readdirSync(uploadsDir);
    const images = [];
    
    for (const category of categories) {
      const categoryPath = `${uploadsDir}/${category}`;
      
      // Skip non-directories
      if (!fs.statSync(categoryPath).isDirectory()) continue;
      
      // Get all files in this category directory
      const files = fs.readdirSync(categoryPath);
      
      for (const file of files) {
        // Skip hidden files
        if (file.startsWith('.')) continue;
        
        const filePath = `${categoryPath}/${file}`;
        
        // Skip directories and empty files
        const stats = fs.statSync(filePath);
        if (!stats.isFile() || stats.size === 0) continue;
        
        // Determine if it's a video or image
        const isVideo = ['.mp4', '.mov', '.webm'].includes(
          file.substring(file.lastIndexOf('.')).toLowerCase()
        );
        
        // Create nice name from filename (remove timestamp part)
        let name = file;
        name = name.replace(/^\d+-\d+-/, ''); // Remove timestamp prefix
        name = name.replace(/\.[^/.]+$/, ""); // Remove extension
        name = name.split('_').join(' '); // Replace underscores with spaces
        
        // Add to images array
        images.push({
          path: `/uploads/gallery/${category}/${file}`,
          name: name,
          category: category,
          mediaType: isVideo ? 'video' : 'image'
        });
      }
    }
    
    return images;
  } catch (error) {
    console.error('Error reading uploads directory:', error);
    return [];
  }
}

// Find and modify storage.ts file
function replaceImagesInStorageFile() {
  const storageFilePath = './server/storage.ts';
  console.log(`Modifying storage file: ${storageFilePath}`);
  
  try {
    if (!fs.existsSync(storageFilePath)) {
      console.error(`Storage file not found: ${storageFilePath}`);
      return false;
    }
    
    // Get available images
    const uploadedImages = getUploadedImages();
    console.log(`Found ${uploadedImages.length} uploaded images`);
    
    if (uploadedImages.length === 0) {
      console.warn('No uploaded images found to use as replacements');
      return false;
    }
    
    // Read the storage file
    let content = fs.readFileSync(storageFilePath, 'utf8');
    
    // Replace all zyrosite.com URLs with our uploaded images
    let imageCount = 0;
    
    // First, find the galleryImages section
    const galleryImagesSection = content.match(/private initializeData\(\) {[\s\S]*?this\.galleryImages = new Map<number, GalleryImage>\(\);[\s\S]*?const galleryImagesData: Omit<GalleryImage, 'id'>\[\] = \[([\s\S]*?)\];/);
    
    if (!galleryImagesSection || !galleryImagesSection[1]) {
      console.error('Could not find gallery images section in storage.ts');
      return false;
    }
    
    const originalGalleryData = galleryImagesSection[1];
    
    // Generate replacement gallery images data
    let newGalleryData = '';
    
    for (let i = 0; i < uploadedImages.length; i++) {
      const image = uploadedImages[i];
      newGalleryData += `
      {
        imageUrl: "${image.path}",
        alt: "${image.name}",
        category: "${image.category}",
        mediaType: "${image.mediaType}",
        featured: ${i % 5 === 0}, // Make some images featured
        sortOrder: ${i + 1}
      },`;
    }
    
    // Replace the gallery data in the content
    const updatedContent = content.replace(originalGalleryData, newGalleryData);
    
    // Write the updated content back to the file
    fs.writeFileSync(storageFilePath, updatedContent, 'utf8');
    
    return true;
  } catch (error) {
    console.error('Error updating storage file:', error);
    return false;
  }
}

// Main execution
console.log('Starting gallery image replacement...');
const success = replaceImagesInStorageFile();

if (success) {
  console.log('Successfully replaced gallery images!');
  console.log('Please restart the server to see the changes.');
} else {
  console.error('Failed to replace gallery images.');
}