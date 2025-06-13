/**
 * Emergency Gallery Restore - Check what happened to images and restore them
 */

async function emergencyGalleryRestore() {
  console.log('🚨 Emergency Gallery Restore - Checking what happened to your images');
  
  const baseUrl = 'http://localhost:5000';
  
  try {
    // Check current gallery state
    const response = await fetch(`${baseUrl}/api/gallery`);
    const galleryItems = await response.json();
    
    console.log(`\n📊 Current Gallery State:`);
    console.log(`Total items: ${galleryItems.length}`);
    
    const images = galleryItems.filter(item => item.type === 'image');
    const videos = galleryItems.filter(item => item.type === 'video');
    
    console.log(`Images: ${images.length}`);
    console.log(`Videos: ${videos.length}`);
    
    console.log(`\n📋 Current Gallery Contents:`);
    galleryItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.type.toUpperCase()}: ${item.title || 'No title'}`);
      console.log(`   File: ${item.imageUrl || item.videoUrl}`);
      console.log(`   Category: ${item.category || 'No category'}`);
    });
    
    // Check if files exist in filesystem
    const fs = require('fs');
    const path = require('path');
    
    console.log(`\n🔍 Checking file system for missing images...`);
    
    // Check uploads directory
    const uploadsDir = './uploads/gallery';
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      console.log(`Found ${files.length} files in uploads/gallery directory`);
      
      const imageFiles = files.filter(file => 
        file.toLowerCase().match(/\.(jpg|jpeg|png|gif|webp)$/i)
      );
      const videoFiles = files.filter(file => 
        file.toLowerCase().match(/\.(mp4|mov|avi|mkv)$/i)
      );
      
      console.log(`Image files on disk: ${imageFiles.length}`);
      console.log(`Video files on disk: ${videoFiles.length}`);
      
      // Show first 10 image files
      console.log(`\n📁 Sample image files found:`);
      imageFiles.slice(0, 10).forEach(file => {
        console.log(`  - ${file}`);
      });
      
      // Check if files in database exist on disk
      console.log(`\n🔍 Checking database entries against filesystem:`);
      galleryItems.forEach(item => {
        const filePath = item.imageUrl || item.videoUrl;
        if (filePath) {
          const fileName = filePath.replace('/uploads/gallery/', '');
          const exists = files.includes(fileName);
          console.log(`${exists ? '✅' : '❌'} ${fileName} - ${exists ? 'EXISTS' : 'MISSING'}`);
        }
      });
      
    } else {
      console.log('❌ uploads/gallery directory not found!');
    }
    
  } catch (error) {
    console.error('Error checking gallery:', error.message);
  }
}

emergencyGalleryRestore();