/**
 * Fix Gallery Branding - Replace KoggalaNinePeaks with Ko Lake Villa
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

async function fixGalleryBranding() {
  console.log('Fixing gallery branding from KoggalaNinePeaks to Ko Lake Villa...');
  
  try {
    // Get all gallery items
    const gallery = await apiRequest('GET', '/api/gallery');
    console.log(`Found ${gallery.length} gallery items`);
    
    let updated = 0;
    
    for (const item of gallery) {
      let needsUpdate = false;
      let newTitle = item.title;
      let newDescription = item.description;
      
      // Fix title
      if (item.title && item.title.includes('KoggalaNinePeaks')) {
        newTitle = item.title.replace(/KoggalaNinePeaks/g, 'Ko Lake Villa');
        needsUpdate = true;
      }
      
      // Fix description  
      if (item.description && item.description.includes('KoggalaNinePeaks')) {
        newDescription = item.description.replace(/KoggalaNinePeaks/g, 'Ko Lake Villa');
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log(`Updating item ${item.id}: ${item.title} -> ${newTitle}`);
        
        await apiRequest('PATCH', `/api/gallery/${item.id}`, {
          title: newTitle,
          description: newDescription
        });
        
        updated++;
      }
    }
    
    console.log(`Updated ${updated} gallery items with correct Ko Lake Villa branding`);
    
  } catch (error) {
    console.error('Error fixing gallery branding:', error);
  }
}

fixGalleryBranding();