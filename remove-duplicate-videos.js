/**
 * Remove Duplicate Videos - Clean up repeated content in gallery view
 */

async function removeDuplicateVideos() {
  console.log('🧹 Removing duplicate videos from gallery');
  
  try {
    const response = await fetch('http://localhost:5000/api/gallery');
    const videos = await response.json();
    console.log(`📋 Found ${videos.length} videos`);
    
    let deletedCount = 0;
    
    for (const video of videos) {
      // Remove the duplicate "copy" version of 20250420_170258
      if (video.imageUrl && video.imageUrl.includes('20250420_170258 (copy)')) {
        console.log(`❌ Removing duplicate: ${video.title}`);
        
        try {
          const deleteResponse = await fetch(`http://localhost:5000/api/gallery/${video.id}`, {
            method: 'DELETE'
          });
          
          if (deleteResponse.ok) {
            deletedCount++;
            console.log(`✅ Deleted duplicate: ${video.title}`);
          } else {
            console.log(`⚠️ Failed to delete ${video.id}: ${deleteResponse.status}`);
          }
        } catch (error) {
          console.log(`❌ Error deleting ${video.id}: ${error.message}`);
        }
      } else {
        console.log(`✅ Keeping: ${video.title}`);
      }
    }
    
    console.log(`\n📊 Removed ${deletedCount} duplicate videos`);
    return { success: true, deletedCount };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

removeDuplicateVideos().then(result => {
  if (result.success) {
    console.log('\n🎉 Gallery now shows unique videos only');
  } else {
    console.log('\n💥 Failed to remove duplicates');
  }
});