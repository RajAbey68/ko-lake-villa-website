#!/usr/bin/env node

/**
 * Complete Ko Lake Villa Media Recovery
 * Finds and restores ALL authentic property images and videos
 */

import fs from 'fs';
import path from 'path';

async function apiRequest(method, endpoint, body = null) {
  const url = `http://localhost:5000${endpoint}`;
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(url, options);
  return response;
}

function findAllMedia() {
  const mediaFiles = [];
  
  function scanDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDirectory(fullPath);
        } else if (stat.size > 10000) { // Only files larger than 10KB
          const ext = path.extname(item).toLowerCase();
          if (['.jpg', '.jpeg', '.png', '.mp4', '.mov'].includes(ext)) {
            const relativePath = fullPath.replace('./uploads', '');
            
            // Determine category from path
            let category = 'All Villa';
            if (fullPath.includes('family-suite')) category = 'Family Suite';
            else if (fullPath.includes('triple-room')) category = 'Triple Room';
            else if (fullPath.includes('group-room')) category = 'Group Room';
            else if (fullPath.includes('pool-deck') || fullPath.includes('pool')) category = 'Pool & Outdoor';
            else if (fullPath.includes('dining-area') || fullPath.includes('dining')) category = 'Dining Area';
            else if (fullPath.includes('lake-garden')) category = 'Lake Garden';
            else if (fullPath.includes('roof-garden')) category = 'Roof Garden';
            else if (fullPath.includes('front-garden')) category = 'Front Garden';
            else if (fullPath.includes('koggala-lake')) category = 'Koggala Lake';
            else if (fullPath.includes('excursions')) category = 'Excursions';
            
            mediaFiles.push({
              filename: item,
              fullPath: fullPath,
              relativePath: relativePath,
              category: category,
              size: stat.size,
              mediaType: ext === '.mp4' || ext === '.mov' ? 'video' : 'image'
            });
          }
        }
      });
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
  }
  
  // Scan all relevant directories
  scanDirectory('./uploads');
  scanDirectory('./images');
  
  return mediaFiles;
}

function generateTags(filename, category, mediaType) {
  const baseTags = ['Ko Lake Villa', 'Ahangama', 'Galle', 'Sri Lanka'];
  
  if (mediaType === 'video') {
    baseTags.push('video tour', 'virtual tour');
  }
  
  switch (category) {
    case 'Family Suite':
      baseTags.push('family suite', 'master bedroom', 'luxury accommodation');
      break;
    case 'Triple Room':
      baseTags.push('triple room', 'guest room', 'accommodation');
      break;
    case 'Group Room':
      baseTags.push('group accommodation', 'large room', 'multiple guests');
      break;
    case 'Pool & Outdoor':
      baseTags.push('infinity pool', 'outdoor space', 'swimming', 'relaxation');
      break;
    case 'Dining Area':
      baseTags.push('dining', 'meals', 'restaurant');
      break;
    case 'Lake Garden':
      baseTags.push('garden', 'Koggala Lake', 'landscaping');
      break;
    case 'Roof Garden':
      baseTags.push('rooftop', 'terrace', 'views');
      break;
    case 'Front Garden':
      baseTags.push('entrance', 'arrival', 'garden');
      break;
    case 'Koggala Lake':
      baseTags.push('lake views', 'water activities', 'boat rides');
      break;
    case 'Excursions':
      baseTags.push('activities', 'tours', 'local attractions');
      break;
    default:
      baseTags.push('villa property', 'accommodation');
  }
  
  return baseTags.join(', ');
}

async function completeMediaRecovery() {
  console.log('🏝️ COMPLETE KO LAKE VILLA MEDIA RECOVERY');
  console.log('=========================================\n');
  
  try {
    const allMedia = findAllMedia();
    console.log(`Found ${allMedia.length} total media files`);
    
    // Get currently stored media to avoid duplicates
    const currentResponse = await apiRequest('GET', '/api/gallery');
    const currentMedia = currentResponse.ok ? await currentResponse.json() : [];
    console.log(`Currently in gallery: ${currentMedia.length} items`);
    
    // Filter out already stored media
    const newMedia = allMedia.filter(media => 
      !currentMedia.some(current => current.imageUrl.includes(media.filename))
    );
    
    console.log(`New media to restore: ${newMedia.length} items\n`);
    
    let restored = 0;
    let errors = 0;
    
    for (const media of newMedia) {
      try {
        const mediaData = {
          imageUrl: media.relativePath,
          category: media.category,
          title: `Ko Lake Villa - ${media.category}`,
          tags: generateTags(media.filename, media.category, media.mediaType),
          mediaType: media.mediaType,
          featured: false,
          sortOrder: restored + 1
        };
        
        const response = await apiRequest('POST', '/api/gallery', mediaData);
        
        if (response.ok) {
          restored++;
          console.log(`✅ Restored: ${media.filename} (${media.category}) [${media.mediaType}]`);
        } else {
          errors++;
          console.log(`❌ Failed: ${media.filename} - Status ${response.status}`);
        }
        
        // Small delay to prevent overwhelming the server
        await new Promise(resolve => setTimeout(resolve, 50));
        
      } catch (error) {
        errors++;
        console.log(`❌ Error restoring ${media.filename}: ${error.message}`);
      }
    }
    
    console.log('\n📊 COMPLETE RECOVERY SUMMARY:');
    console.log(`✅ Successfully restored: ${restored} media files`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📁 Total media files found: ${allMedia.length}`);
    
    // Final verification
    console.log('\n🔍 Final verification...');
    const finalResponse = await apiRequest('GET', '/api/gallery');
    if (finalResponse.ok) {
      const finalGallery = await finalResponse.json();
      console.log(`🎯 Gallery now contains: ${finalGallery.length} total items`);
      
      const categories = {};
      const mediaTypes = {};
      
      finalGallery.forEach(item => {
        categories[item.category] = (categories[item.category] || 0) + 1;
        mediaTypes[item.mediaType || 'image'] = (mediaTypes[item.mediaType || 'image'] || 0) + 1;
      });
      
      console.log('\nCategory distribution:');
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} items`);
      });
      
      console.log('\nMedia type distribution:');
      Object.entries(mediaTypes).forEach(([type, count]) => {
        console.log(`   ${type}: ${count} items`);
      });
    }
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR during complete recovery:', error);
  }
}

completeMediaRecovery();