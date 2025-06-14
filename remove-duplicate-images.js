/**
 * Remove Duplicate Images from Gallery Database
 * Identifies and removes duplicate image entries to ensure each unique image appears only once
 */

async function removeDuplicateImages() {
  console.log('🔍 Removing Duplicate Images from Gallery...\n');
  
  const baseUrl = 'http://localhost:5000';
  const results = {
    totalImages: 0,
    duplicatesFound: 0,
    duplicatesRemoved: 0,
    errors: []
  };

  try {
    // Fetch all gallery images
    const response = await fetch(`${baseUrl}/api/gallery`);
    const allImages = await response.json();
    
    results.totalImages = allImages.length;
    console.log(`Total images in gallery: ${allImages.length}`);
    
    // Group images by imageUrl to find duplicates
    const imageGroups = {};
    allImages.forEach(image => {
      const url = image.imageUrl;
      if (!imageGroups[url]) {
        imageGroups[url] = [];
      }
      imageGroups[url].push(image);
    });
    
    // Find groups with more than one image (duplicates)
    const duplicateGroups = Object.entries(imageGroups).filter(([url, images]) => images.length > 1);
    
    console.log(`\nDuplicate groups found: ${duplicateGroups.length}`);
    
    for (const [url, duplicateImages] of duplicateGroups) {
      console.log(`\nProcessing duplicates for: ${url}`);
      console.log(`Found ${duplicateImages.length} copies:`);
      
      duplicateImages.forEach((img, index) => {
        console.log(`  ${index + 1}. ID: ${img.id}, Title: "${img.title}", Category: ${img.category}`);
      });
      
      // Keep the best quality entry (prefer featured, then by category priority, then lowest ID)
      const categoryPriority = {
        'entire-villa': 1,
        'family-suite': 2, 
        'pool-deck': 3,
        'lake-garden': 4,
        'roof-garden': 5,
        'dining-area': 6,
        'front-garden': 7,
        'group-room': 8,
        'triple-room': 9,
        'koggala-lake': 10,
        'excursions': 11,
        'events': 12,
        'friends': 13,
        'default': 99
      };
      
      // Sort to find the best image to keep
      const sortedImages = duplicateImages.sort((a, b) => {
        // Prefer featured images
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        
        // Then by category priority
        const aPriority = categoryPriority[a.category] || 50;
        const bPriority = categoryPriority[b.category] || 50;
        if (aPriority !== bPriority) return aPriority - bPriority;
        
        // Finally by ID (keep older entry)
        return a.id - b.id;
      });
      
      const keepImage = sortedImages[0];
      const removeImages = sortedImages.slice(1);
      
      console.log(`  → Keeping: ID ${keepImage.id} (${keepImage.category})`);
      console.log(`  → Removing: ${removeImages.map(img => `ID ${img.id}`).join(', ')}`);
      
      // Remove duplicate images
      for (const imageToRemove of removeImages) {
        try {
          const deleteResponse = await fetch(`${baseUrl}/api/admin/gallery/${imageToRemove.id}`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json'
            }
          });
          
          if (deleteResponse.ok) {
            console.log(`    ✅ Removed duplicate ID ${imageToRemove.id}`);
            results.duplicatesRemoved++;
          } else {
            const error = `Failed to remove ID ${imageToRemove.id}: ${deleteResponse.status}`;
            console.log(`    ❌ ${error}`);
            results.errors.push(error);
          }
        } catch (error) {
          const errorMsg = `Error removing ID ${imageToRemove.id}: ${error.message}`;
          console.log(`    ❌ ${errorMsg}`);
          results.errors.push(errorMsg);
        }
      }
      
      results.duplicatesFound += removeImages.length;
    }
    
    // Also check for similar images with slight filename differences
    console.log('\n🔍 Checking for similar filename patterns...');
    
    const filenameGroups = {};
    allImages.forEach(image => {
      const filename = image.imageUrl.split('/').pop() || '';
      // Extract base name without extension and size modifiers
      const baseName = filename
        .replace(/\.(jpg|jpeg|png|gif|webp)$/i, '')
        .replace(/_thumb|_small|_medium|_large|_\d+x\d+/i, '')
        .replace(/\-\d{13}\-\d+\-/, '-'); // Remove timestamp patterns
      
      if (!filenameGroups[baseName]) {
        filenameGroups[baseName] = [];
      }
      filenameGroups[baseName].push(image);
    });
    
    const similarGroups = Object.entries(filenameGroups).filter(([baseName, images]) => images.length > 1);
    
    if (similarGroups.length > 0) {
      console.log(`Found ${similarGroups.length} groups with similar filenames (review manually):`);
      similarGroups.forEach(([baseName, images]) => {
        console.log(`\n  Base: ${baseName}`);
        images.forEach(img => {
          console.log(`    - ${img.imageUrl} (ID: ${img.id}, Category: ${img.category})`);
        });
      });
    }
    
  } catch (error) {
    console.error('Error in duplicate removal process:', error);
    results.errors.push(error.message);
  }
  
  // Generate final report
  console.log('\n📊 DUPLICATE REMOVAL REPORT');
  console.log('='.repeat(50));
  console.log(`Original image count: ${results.totalImages}`);
  console.log(`Duplicates found: ${results.duplicatesFound}`);
  console.log(`Duplicates removed: ${results.duplicatesRemoved}`);
  console.log(`Errors encountered: ${results.errors.length}`);
  
  if (results.errors.length > 0) {
    console.log('\nErrors:');
    results.errors.forEach(error => console.log(`  - ${error}`));
  }
  
  const finalCount = results.totalImages - results.duplicatesRemoved;
  console.log(`\nFinal image count: ${finalCount}`);
  
  if (results.duplicatesRemoved > 0) {
    console.log('\n✅ Duplicate removal completed. Gallery now shows unique images only.');
    console.log('Please refresh the gallery page to see the changes.');
  } else {
    console.log('\n✅ No duplicates found to remove. Gallery is already clean.');
  }
  
  return results;
}

// Run the duplicate removal
removeDuplicateImages().catch(console.error);