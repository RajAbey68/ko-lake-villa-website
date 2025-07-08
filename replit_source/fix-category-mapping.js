#!/usr/bin/env node

/**
 * Fix Category Mapping for Ko Lake Villa Gallery
 * Updates stored categories to match frontend filter expectations
 */

import fs from 'fs';

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

// Category mapping from stored names to frontend expected names
const categoryMapping = {
  'family-suite': 'Family Suite',
  'triple-room': 'Triple Room', 
  'group-room': 'Group Room',
  'pool-deck': 'Pool & Outdoor',
  'dining-area': 'Dining Area',
  'lake-garden': 'Lake Garden',
  'roof-garden': 'Roof Garden',
  'front-garden': 'Front Garden',
  'excursions': 'Excursions',
  'koggala-lake': 'Koggala Lake',
  'default': 'All Villa'
};

async function fixCategoryMapping() {
  console.log('🔧 FIXING CATEGORY MAPPING...');
  
  try {
    // Get all current gallery images
    const response = await apiRequest('GET', '/api/gallery');
    if (!response.ok) {
      console.error('Failed to fetch gallery images');
      return;
    }
    
    const images = await response.json();
    console.log(`Found ${images.length} images to update`);
    
    let updated = 0;
    let errors = 0;
    
    for (const image of images) {
      const oldCategory = image.category;
      const newCategory = categoryMapping[oldCategory] || oldCategory;
      
      if (newCategory !== oldCategory) {
        try {
          // Update the category
          const updateResponse = await apiRequest('PUT', `/api/gallery/${image.id}`, {
            ...image,
            category: newCategory
          });
          
          if (updateResponse.ok) {
            updated++;
            console.log(`✅ Updated: ${oldCategory} → ${newCategory}`);
          } else {
            errors++;
            console.log(`❌ Failed to update image ${image.id}: ${updateResponse.status}`);
          }
        } catch (error) {
          errors++;
          console.log(`❌ Error updating image ${image.id}:`, error.message);
        }
      }
    }
    
    console.log('\n📊 CATEGORY MAPPING SUMMARY:');
    console.log(`✅ Successfully updated: ${updated} images`);
    console.log(`❌ Errors: ${errors}`);
    
    // Verify the fix
    console.log('\n🔍 Verifying category distribution...');
    const verifyResponse = await apiRequest('GET', '/api/gallery');
    if (verifyResponse.ok) {
      const updatedImages = await verifyResponse.json();
      const categories = {};
      
      updatedImages.forEach(img => {
        categories[img.category] = (categories[img.category] || 0) + 1;
      });
      
      console.log('Current category distribution:');
      Object.entries(categories).forEach(([cat, count]) => {
        console.log(`   ${cat}: ${count} images`);
      });
    }
    
  } catch (error) {
    console.error('💥 CRITICAL ERROR during category mapping:', error);
  }
}

// Run the fix
fixCategoryMapping();