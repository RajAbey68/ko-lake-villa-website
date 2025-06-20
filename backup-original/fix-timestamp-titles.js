/**
 * Fix Timestamp Titles Only - Replace numeric IDs with proper titles
 */

async function fixTimestampTitles() {
  console.log('🔧 Fixing timestamp titles only');
  
  try {
    const response = await fetch('http://localhost:5000/api/gallery');
    const images = await response.json();
    console.log(`📋 Found ${images.length} gallery items`);
    
    let fixedCount = 0;
    
    for (const image of images) {
      // Only fix clear timestamp IDs (13+ digits)
      const isTimestamp = /^\d{13,}$/.test(image.title);
      
      if (isTimestamp) {
        console.log(`❌ Timestamp title: ${image.title}`);
        
        let newTitle = 'Ko Lake Villa';
        
        if (image.category === 'family-suite') {
          newTitle = 'Master Family Suite';
        } else if (image.category === 'triple-room') {
          newTitle = 'Triple Room';
        } else if (image.category === 'group-room') {
          newTitle = 'Group Room';
        } else if (image.category === 'pool-deck') {
          newTitle = 'Swimming Pool';
        } else if (image.category === 'dining-area') {
          newTitle = 'Dining Area';
        } else if (image.category === 'koggala-lake') {
          newTitle = 'Lake Views';
        }
        
        // Simple update - only title and alt
        const updateData = {
          title: newTitle,
          alt: newTitle
        };
        
        try {
          const updateResponse = await fetch(`http://localhost:5000/api/admin/gallery/${image.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updateData)
          });
          
          if (updateResponse.ok) {
            console.log(`✅ Fixed: ${image.title} → ${newTitle}`);
            fixedCount++;
          } else {
            console.log(`⚠️ Failed ${image.id}: ${updateResponse.status}`);
          }
        } catch (error) {
          console.log(`❌ Error ${image.id}: ${error.message}`);
        }
        
        // Small delay to prevent server overload
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }
    
    console.log(`\n📊 Fixed ${fixedCount} timestamp titles`);
    return { success: true, fixedCount };
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return { success: false, error: error.message };
  }
}

fixTimestampTitles().then(result => {
  if (result.success) {
    console.log('\n🎉 Timestamp titles fixed successfully');
  } else {
    console.log('\n💥 Failed to fix titles');
  }
});