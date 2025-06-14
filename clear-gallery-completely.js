/**
 * Clear Gallery Completely
 * Removes all gallery entries for fresh start
 */

async function apiRequest(method, endpoint, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' }
  };
  
  if (body) options.body = JSON.stringify(body);
  
  const response = await fetch(`http://localhost:5000${endpoint}`, options);
  return response.json();
}

async function clearGalleryCompletely() {
  console.log('🧹 Clearing gallery completely for fresh start...');
  
  try {
    // Get all gallery entries
    const gallery = await apiRequest('GET', '/api/gallery');
    console.log(`Found ${gallery.length} gallery entries to remove`);
    
    // Delete all entries
    let deleted = 0;
    for (const image of gallery) {
      try {
        await apiRequest('DELETE', `/api/admin/gallery/${image.id}`);
        deleted++;
        if (deleted % 10 === 0) {
          console.log(`Deleted ${deleted}/${gallery.length} entries...`);
        }
      } catch (error) {
        console.log(`Warning: Could not delete image ${image.id}`);
      }
    }
    
    // Verify empty gallery
    const finalGallery = await apiRequest('GET', '/api/gallery');
    
    console.log('\n✅ Gallery cleared completely!');
    console.log(`📊 Final count: ${finalGallery.length} images`);
    console.log('🎯 Ready for fresh image uploads through admin interface');
    console.log('📝 You can now manually upload and organize your images');
    
  } catch (error) {
    console.error('Clear error:', error);
  }
}

clearGalleryCompletely();