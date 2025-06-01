/**
 * Fix Missing Cake Photos - Add them directly to the database
 */

async function apiRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(endpoint, options);
  return response.json();
}

async function addMissingCakePhotos() {
  console.log('🍰 Adding missing cake photos to gallery database...');
  
  const cakePhotos = [
    {
      imageUrl: "/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_0.jpg",
      alt: "Delicious Local Cake",
      title: "Sri Lankan Specialty Cake", 
      description: "Traditional Sri Lankan cake served in our dining area, made with authentic local ingredients and spices.",
      category: "dining-area",
      mediaType: "image",
      featured: false,
      sortOrder: 10
    },
    {
      imageUrl: "/uploads/gallery/dining-area/KoggalaNinePeaks_dining-area_1.jpg", 
      alt: "Traditional Sri Lankan Dessert",
      title: "Authentic Local Dessert",
      description: "Handmade traditional Sri Lankan dessert featuring coconut and local spices, served fresh in our dining area.",
      category: "dining-area", 
      mediaType: "image",
      featured: false,
      sortOrder: 11
    }
  ];

  try {
    for (const photo of cakePhotos) {
      console.log(`Adding: ${photo.title}...`);
      
      // Direct database insertion via gallery endpoint
      const response = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(photo)
      });
      
      if (response.ok) {
        console.log(`✅ Added: ${photo.title}`);
      } else {
        console.error(`❌ Failed to add: ${photo.title}`);
      }
    }
    
    console.log('🎉 Cake photos restoration complete!');
    console.log('Now refresh the Gallery Manager to see your dining area photos.');
    
  } catch (error) {
    console.error('Error adding cake photos:', error);
  }
}

// Run the fix
addMissingCakePhotos();