/**
 * Restore Cake Photos to Gallery Database
 * Uses the storage system to properly add the existing cake photos
 */

const fs = require('fs');
const path = require('path');

// Import the storage system
async function restoreCakePhotos() {
  console.log('Restoring cake photos to gallery...');
  
  const cakePhotos = [
    {
      imageUrl: "/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_0.jpg",
      alt: "Delicious Local Cake",
      title: "Sri Lankan Specialty Cake",
      description: "Traditional Sri Lankan cake served in our dining area, made with authentic local ingredients and spices.",
      category: "dining-area",
      mediaType: "image",
      featured: false,
      sortOrder: 3,
      displaySize: "medium",
      fileSize: 77917
    },
    {
      imageUrl: "/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_1.jpg",
      alt: "Traditional Sri Lankan Dessert", 
      title: "Authentic Local Dessert",
      description: "Handmade traditional Sri Lankan dessert featuring coconut and local spices, served fresh in our dining area.",
      category: "dining-area",
      mediaType: "image",
      featured: false,
      sortOrder: 4,
      displaySize: "medium",
      fileSize: 53328
    }
  ];

  try {
    for (const photo of cakePhotos) {
      const response = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: path.basename(photo.imageUrl),
          category: photo.category,
          alt: photo.alt,
          description: photo.description,
          existingPath: photo.imageUrl
        })
      });
      
      if (response.ok) {
        console.log(`✅ Added: ${photo.title}`);
      } else {
        console.log(`❌ Failed: ${photo.title}`);
      }
    }
    
    console.log('Cake photos restoration complete!');
  } catch (error) {
    console.error('Error:', error);
  }
}

// For Node.js execution
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { restoreCakePhotos };
}

// For browser execution
if (typeof window !== 'undefined') {
  window.restoreCakePhotos = restoreCakePhotos;
}