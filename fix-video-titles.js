/**
 * Fix Video Titles - Replace timestamp IDs with descriptive names
 */

async function fixVideoTitles() {
  console.log('🎬 Fixing video titles');
  
  try {
    const response = await fetch('http://localhost:5000/api/gallery');
    const videos = await response.json();
    console.log(`📋 Found ${videos.length} videos`);
    
    const titleMap = {
      '20250420_170537': 'Ko Lake Villa - Complete Property Tour',
      '20250420_170258': 'Ko Lake Villa - Lakeside Views',
      '20250420_170648': 'Ko Lake Villa - Garden & Pool Area',
      '20250420_170654': 'Ko Lake Villa - Interior Walkthrough',
      '20250420_170815': 'Ko Lake Villa - Accommodation Rooms',
      '20250420_170745': 'Ko Lake Villa - Lake Access & Grounds',
      '20250420_164235': 'Ko Lake Villa - Full Property Overview'
    };
    
    let fixedCount = 0;
    
    for (const video of videos) {
      const newTitle = titleMap[video.title];
      
      if (newTitle) {
        try {
          const updateResponse = await fetch(`http://localhost:5000/api/admin/gallery/${video.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: newTitle,
              alt: newTitle,
              description: `${newTitle} - authentic property video from Ko Lake Villa, Ahangama`
            })
          });
          
          if (updateResponse.ok) {
            console.log(`✅ Updated: ${video.title} → ${newTitle}`);
            fixedCount++;
          } else {
            console.log(`⚠️ Failed to update ${video.id}`);
          }
        } catch (error) {
          console.log(`❌ Error updating ${video.id}: ${error.message}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`\n📊 Fixed ${fixedCount} video titles`);
    return { success: true, fixedCount };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

fixVideoTitles().then(result => {
  if (result.success) {
    console.log('\n🎉 Video titles now show descriptive names');
  } else {
    console.log('\n💥 Failed to fix video titles');
  }
});