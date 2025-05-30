#!/usr/bin/env node

/**
 * Emergency Ko Lake Villa Gallery Restoration
 * Rebuilds gallery database from existing working image files
 */

import fs from 'fs';
import path from 'path';

// API request helper
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

// Scan for working image files
function findWorkingImages() {
  const galleryPath = './uploads/gallery';
  const workingImages = [];
  
  function scanDirectory(dirPath, category = 'default') {
    try {
      const items = fs.readdirSync(dirPath);
      
      items.forEach(item => {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Extract category from folder name
          const categoryName = path.basename(fullPath);
          scanDirectory(fullPath, categoryName);
        } else if (stat.isFile() && item.endsWith('.jpg') && stat.size > 1000) {
          // Only include files larger than 1KB (working images)
          const relativePath = fullPath.replace('./uploads', '');
          
          workingImages.push({
            filename: item,
            category: category,
            path: relativePath,
            size: stat.size
          });
        }
      });
    } catch (error) {
      console.error(`Error scanning ${dirPath}:`, error.message);
    }
  }
  
  scanDirectory(galleryPath);
  return workingImages;
}

// Generate appropriate tags for Ko Lake Villa images
function generateTags(filename, category) {
  const tags = ['Ko Lake Villa', 'Ahangama', 'Galle', 'Sri Lanka'];
  
  // Category-specific tags
  switch (category) {
    case 'family-suite':
      tags.push('family suite', 'accommodation', 'luxury room', 'master bedroom');
      break;
    case 'triple-room':
      tags.push('triple room', 'accommodation', 'guest room', 'twin beds');
      break;
    case 'group-room':
      tags.push('group room', 'accommodation', 'spacious', 'multiple guests');
      break;
    case 'pool-deck':
      tags.push('infinity pool', 'pool deck', 'swimming', 'relaxation');
      break;
    case 'dining-area':
      tags.push('dining', 'restaurant', 'meals', 'food service');
      break;
    case 'lake-garden':
      tags.push('garden', 'Koggala Lake', 'landscaping', 'outdoor space');
      break;
    case 'roof-garden':
      tags.push('rooftop', 'terrace', 'garden', 'views');
      break;
    case 'front-garden':
      tags.push('entrance', 'garden', 'landscaping', 'arrival');
      break;
    case 'excursions':
      tags.push('activities', 'tours', 'experiences', 'local attractions');
      break;
    default:
      tags.push('property', 'villa', 'accommodation');
  }
  
  return tags.join(', ');
}

// Main restoration function
async function restoreGallery() {
  console.log('🚨 EMERGENCY GALLERY RESTORATION STARTING...');
  
  try {
    const workingImages = findWorkingImages();
    console.log(`Found ${workingImages.length} working images to restore`);
    
    let restored = 0;
    let errors = 0;
    
    for (const image of workingImages) {
      try {
        const imageData = {
          imageUrl: image.path,
          category: image.category,
          title: `Ko Lake Villa - ${image.category.replace('-', ' ')}`,
          tags: generateTags(image.filename, image.category)
        };
        
        const response = await apiRequest('POST', '/api/gallery', imageData);
        
        if (response.ok) {
          restored++;
          console.log(`✅ Restored: ${image.filename} (${image.category})`);
        } else {
          errors++;
          console.log(`❌ Failed: ${image.filename} - ${response.status}`);
        }
      } catch (error) {
        errors++;
        console.log(`❌ Error restoring ${image.filename}:`, error.message);
      }
    }
    
    console.log('\n📊 RESTORATION SUMMARY:');
    console.log(`✅ Successfully restored: ${restored} images`);
    console.log(`❌ Errors: ${errors}`);
    console.log(`📁 Total working files found: ${workingImages.length}`);
    
    // Verify restoration
    console.log('\n🔍 Verifying gallery API...');
    const verifyResponse = await apiRequest('GET', '/api/gallery');
    if (verifyResponse.ok) {
      const galleryData = await verifyResponse.json();
      console.log(`✅ Gallery API working - ${galleryData.length} images accessible`);
    } else {
      console.log('❌ Gallery API verification failed');
    }
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR during restoration:', error);
  }
}

// Run restoration
restoreGallery();