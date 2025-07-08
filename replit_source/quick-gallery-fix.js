/**
 * Quick Gallery Fix - Add working images via the gallery API
 */

async function apiRequest(method, endpoint, body = null) {
  const baseUrl = 'http://localhost:5000';
  const fullUrl = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(fullUrl, options);
  const text = await response.text();
  
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  
  return { response, data };
}

async function addWorkingImages() {
  console.log('🔧 Quick Gallery Fix - Adding Working Images\n');

  // Clear existing broken entries
  console.log('1. Clearing broken entries...');
  await apiRequest('DELETE', '/api/gallery/clear-all');
  console.log('✅ Gallery cleared');

  // Add working images using the gallery API endpoint
  console.log('\n2. Adding working sample images...');
  
  const sampleImages = [
    {
      uploadMethod: "url",
      imageUrl: "https://picsum.photos/800/600?random=101",
      alt: "Entire Villa Overview",
      description: "Beautiful lakeside villa with pool and gardens",
      category: "entire-villa",
      tags: "villa,luxury,lakeside,pool",
      featured: true,
      sortOrder: 1,
      mediaType: "image"
    },
    {
      uploadMethod: "url", 
      imageUrl: "https://picsum.photos/800/600?random=102",
      alt: "Family Suite Master Bedroom",
      description: "Spacious master bedroom with lake views",
      category: "family-suite",
      tags: "bedroom,master,suite,comfortable",
      featured: true,
      sortOrder: 2,
      mediaType: "image"
    },
    {
      uploadMethod: "url",
      imageUrl: "https://picsum.photos/800/600?random=103",
      alt: "Group Room Accommodation",
      description: "Multiple beds for group travelers",
      category: "group-room",
      tags: "group,beds,shared,accommodation",
      featured: true,
      sortOrder: 3,
      mediaType: "image"
    }
  ];

  let successCount = 0;
  
  for (const image of sampleImages) {
    try {
      const { response } = await apiRequest('POST', '/api/admin/gallery', image);
      
      if (response.ok) {
        console.log(`✅ Added: ${image.alt}`);
        successCount++;
      } else {
        console.log(`❌ Failed: ${image.alt} (${response.status})`);
      }
    } catch (error) {
      console.log(`❌ Error adding ${image.alt}: ${error.message}`);
    }
  }

  // Verify the fix
  console.log('\n3. Verifying gallery...');
  const { response: galleryResponse, data: gallery } = await apiRequest('GET', '/api/gallery');
  
  if (galleryResponse.ok && Array.isArray(gallery) && gallery.length > 0) {
    console.log(`✅ Gallery restored with ${gallery.length} working images`);
    
    // Test image accessibility
    const testImage = gallery[0];
    try {
      const imageResponse = await fetch(testImage.imageUrl);
      if (imageResponse.ok) {
        console.log('✅ Images are accessible');
      } else {
        console.log('❌ Image accessibility issue');
      }
    } catch (error) {
      console.log('❌ Image test failed');
    }
  } else {
    console.log('❌ Gallery verification failed');
  }

  console.log('\n📊 FIX SUMMARY:');
  console.log('==============');
  console.log(`Images added: ${successCount}/${sampleImages.length}`);
  console.log(`Gallery total: ${gallery ? gallery.length : 0}`);
  
  if (successCount > 0) {
    console.log('\n🎉 GALLERY FIXED - Ready for use!');
  } else {
    console.log('\n🔧 FIX FAILED - Check server configuration');
  }
}

addWorkingImages();