/**
 * Ko Lake Villa - Intelligent Gallery Rebuild
 * Clear existing gallery and reload with AI-powered categorization
 */

import fs from 'fs';
import path from 'path';
import { FormData } from 'formdata-node';

async function apiRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`http://localhost:5000${endpoint}`, options);
  return response;
}

async function uploadFile(filePath, category = 'default') {
  const form = new FormData();
  
  // Read the file
  const fileBuffer = fs.readFileSync(filePath);
  const filename = path.basename(filePath);
  
  form.append('image', fileBuffer, filename);
  form.append('category', category);
  form.append('title', ''); // Let AI generate
  form.append('description', ''); // Let AI generate
  form.append('featured', 'false');
  
  try {
    const response = await fetch('http://localhost:5000/api/upload', {
      method: 'POST',
      body: form
    });
    
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      const error = await response.text();
      throw new Error(`Upload failed: ${response.status} - ${error}`);
    }
  } catch (error) {
    console.error(`Failed to upload ${filename}:`, error.message);
    return null;
  }
}

function findAllMediaFiles() {
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
          if (['.jpg', '.jpeg', '.png', '.webp', '.mp4', '.mov', '.avi'].includes(ext)) {
            mediaFiles.push({
              path: fullPath,
              filename: item,
              category: path.basename(dirPath) === 'gallery' ? 'default' : path.basename(dirPath),
              size: stat.size,
              isVideo: ['.mp4', '.mov', '.avi'].includes(ext)
            });
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

async function clearExistingGallery() {
  console.log('🗑️ Clearing existing gallery...');
  
  try {
    const response = await apiRequest('GET', '/api/gallery/images');
    
    if (response.ok) {
      const images = await response.json();
      console.log(`Found ${images.length} existing images to clear`);
      
      let deletedCount = 0;
      for (const image of images) {
        try {
          const deleteResponse = await apiRequest('DELETE', `/api/gallery/images/${image.id}`);
          if (deleteResponse.ok) {
            deletedCount++;
            console.log(`Deleted: ${image.alt || image.imageUrl}`);
          }
        } catch (error) {
          console.error(`Failed to delete image ${image.id}:`, error.message);
        }
      }
      
      console.log(`✅ Successfully deleted ${deletedCount}/${images.length} images`);
    } else {
      console.log('⚠️ Could not fetch existing images, proceeding with upload');
    }
  } catch (error) {
    console.error('Error clearing gallery:', error.message);
  }
}

async function intelligentGalleryRebuild() {
  console.log('🤖 Starting Intelligent Gallery Rebuild for Ko Lake Villa\n');
  
  // Step 1: Find all media files
  console.log('📁 Scanning for media files...');
  const mediaFiles = findAllMediaFiles();
  
  console.log(`Found ${mediaFiles.length} media files:`);
  mediaFiles.forEach(file => {
    console.log(`  • ${file.filename} (${file.category}) - ${(file.size / 1024 / 1024).toFixed(2)}MB ${file.isVideo ? '🎥' : '📷'}`);
  });
  
  if (mediaFiles.length === 0) {
    console.log('❌ No media files found. Please upload some images first.');
    return;
  }
  
  // Step 2: Clear existing gallery
  await clearExistingGallery();
  
  // Step 3: Upload with AI analysis
  console.log('\n🔄 Starting intelligent upload and categorization...');
  
  let successCount = 0;
  let errorCount = 0;
  const analysisResults = [];
  
  for (const file of mediaFiles) {
    console.log(`\n📤 Processing: ${file.filename}`);
    
    const result = await uploadFile(file.path, file.category);
    
    if (result) {
      successCount++;
      analysisResults.push({
        filename: file.filename,
        originalCategory: file.category,
        aiCategory: result.data.category,
        aiTitle: result.data.alt,
        aiDescription: result.data.description,
        aiTags: result.data.tags,
        confidence: result.aiAnalysis ? result.aiAnalysis.confidence : null,
        hasAI: !!result.aiAnalysis
      });
      
      console.log(`  ✅ Success: ${result.data.category} - "${result.data.alt}"`);
      if (result.aiAnalysis) {
        console.log(`     🤖 AI Confidence: ${Math.round(result.aiAnalysis.confidence * 100)}%`);
      }
    } else {
      errorCount++;
      console.log(`  ❌ Failed to upload ${file.filename}`);
    }
    
    // Small delay to avoid overwhelming the system
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Step 4: Generate analysis report
  console.log('\n' + '='.repeat(60));
  console.log('INTELLIGENT GALLERY REBUILD REPORT');
  console.log('='.repeat(60));
  
  console.log(`📊 Upload Summary:`);
  console.log(`  • Total files processed: ${mediaFiles.length}`);
  console.log(`  • Successfully uploaded: ${successCount}`);
  console.log(`  • Failed uploads: ${errorCount}`);
  console.log(`  • Success rate: ${((successCount / mediaFiles.length) * 100).toFixed(1)}%`);
  
  const aiAnalyzedCount = analysisResults.filter(r => r.hasAI).length;
  console.log(`\n🤖 AI Analysis Summary:`);
  console.log(`  • AI-analyzed files: ${aiAnalyzedCount}/${successCount}`);
  console.log(`  • AI analysis rate: ${((aiAnalyzedCount / successCount) * 100).toFixed(1)}%`);
  
  // Category distribution
  const categoryStats = {};
  analysisResults.forEach(result => {
    const category = result.aiCategory || result.originalCategory;
    categoryStats[category] = (categoryStats[category] || 0) + 1;
  });
  
  console.log(`\n📂 Category Distribution:`);
  Object.entries(categoryStats)
    .sort(([,a], [,b]) => b - a)
    .forEach(([category, count]) => {
      console.log(`  • ${category}: ${count} files`);
    });
  
  // AI confidence analysis
  const confidenceScores = analysisResults
    .filter(r => r.confidence !== null)
    .map(r => r.confidence);
  
  if (confidenceScores.length > 0) {
    const avgConfidence = confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length;
    const highConfidence = confidenceScores.filter(c => c > 0.8).length;
    
    console.log(`\n📈 AI Confidence Analysis:`);
    console.log(`  • Average confidence: ${(avgConfidence * 100).toFixed(1)}%`);
    console.log(`  • High confidence (>80%): ${highConfidence}/${confidenceScores.length} files`);
  }
  
  console.log(`\n🎯 Next Steps:`);
  console.log(`  • Review AI-generated categories and tags`);
  console.log(`  • Adjust any misclassified content`);
  console.log(`  • Set featured images for key categories`);
  console.log(`  • Test gallery display and filtering`);
  
  console.log(`\n✅ Gallery rebuild complete! Visit the gallery to see your intelligently categorized media.`);
}

// Execute the rebuild
intelligentGalleryRebuild().catch(console.error);