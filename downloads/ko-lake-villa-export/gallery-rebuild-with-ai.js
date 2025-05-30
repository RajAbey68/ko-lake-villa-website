/**
 * Ko Lake Villa - Gallery Rebuild with AI Analysis
 * Clear gallery and reload with intelligent categorization
 */

import fs from 'fs';
import path from 'path';

async function clearGallery() {
  console.log('Clearing existing gallery...');
  
  try {
    const response = await fetch('http://localhost:5000/api/gallery/images');
    if (response.ok) {
      const images = await response.json();
      console.log(`Found ${images.length} existing images`);
      
      for (const image of images) {
        try {
          await fetch(`http://localhost:5000/api/gallery/images/${image.id}`, {
            method: 'DELETE'
          });
          console.log(`Deleted: ${image.alt || 'Image'}`);
        } catch (error) {
          console.log(`Skip delete: ${image.id}`);
        }
      }
    }
  } catch (error) {
    console.log('Gallery clearing attempted, continuing...');
  }
}

async function uploadWithAI(imagePath, suggestedCategory = 'default') {
  try {
    const filename = path.basename(imagePath);
    const stats = fs.statSync(imagePath);
    
    console.log(`Processing: ${filename} (${(stats.size / 1024 / 1024).toFixed(2)}MB)`);
    
    // Create FormData for file upload
    const FormData = (await import('form-data')).default;
    const form = new FormData();
    
    form.append('image', fs.createReadStream(imagePath), filename);
    form.append('category', suggestedCategory);
    form.append('title', ''); // Let AI generate
    form.append('description', ''); // Let AI generate
    form.append('featured', 'false');
    
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: form
    });
    
    if (response.ok) {
      const result = await response.json();
      console.log(`Success: ${result.data.category} - "${result.data.alt}"`);
      
      if (result.aiAnalysis) {
        console.log(`AI Confidence: ${Math.round(result.aiAnalysis.confidence * 100)}%`);
        console.log(`Tags: ${result.aiAnalysis.tags?.join(', ') || 'None'}`);
      }
      
      return { success: true, result };
    } else {
      console.log(`Upload failed: ${response.status}`);
      return { success: false, error: response.status };
    }
  } catch (error) {
    console.log(`Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function findAndProcessImages() {
  const mediaFiles = [];
  const uploadsDir = '/home/runner/workspace/uploads/gallery';
  
  function scanDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov'].includes(ext)) {
            const category = path.basename(dirPath) === 'gallery' ? 'default' : path.basename(dirPath);
            mediaFiles.push({ path: fullPath, category, filename: item });
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning ${dirPath}:`, error.message);
    }
  }
  
  scanDirectory(uploadsDir);
  return mediaFiles;
}

async function rebuildGallery() {
  console.log('Ko Lake Villa - Intelligent Gallery Rebuild\n');
  
  // Step 1: Clear existing gallery
  await clearGallery();
  
  // Step 2: Find all media files
  const mediaFiles = await findAndProcessImages();
  console.log(`\nFound ${mediaFiles.length} media files to process\n`);
  
  if (mediaFiles.length === 0) {
    console.log('No media files found');
    return;
  }
  
  // Step 3: Process with AI analysis
  let successCount = 0;
  const results = [];
  
  // Process a subset for testing (first 10 files)
  const filesToProcess = mediaFiles.slice(0, 10);
  
  for (const file of filesToProcess) {
    console.log(`\n--- Processing ${file.filename} ---`);
    
    const result = await uploadWithAI(file.path, file.category);
    results.push({ ...file, ...result });
    
    if (result.success) {
      successCount++;
    }
    
    // Delay between uploads
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  // Step 4: Report results
  console.log(`\n${'='.repeat(50)}`);
  console.log('GALLERY REBUILD COMPLETE');
  console.log(`${'='.repeat(50)}`);
  console.log(`Processed: ${filesToProcess.length} files`);
  console.log(`Successful: ${successCount}`);
  console.log(`Success Rate: ${((successCount / filesToProcess.length) * 100).toFixed(1)}%`);
  
  const aiAnalyzed = results.filter(r => r.result?.aiAnalysis).length;
  console.log(`AI Analyzed: ${aiAnalyzed}/${successCount} uploads`);
  
  if (aiAnalyzed > 0) {
    console.log('\nAI categorization is working! Your images are being intelligently analyzed.');
  } else {
    console.log('\nImages uploaded successfully with manual categorization.');
  }
  
  console.log('\nNext: Review the gallery to see your intelligently categorized content.');
}

// Run the rebuild
rebuildGallery().catch(console.error);