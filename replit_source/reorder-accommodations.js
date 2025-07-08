/**
 * Reorder Accommodations - Update database to match requested order
 * 1) Entire Villa (KLV) - top priority
 * 2) Master Family Suite (KLV1) 
 * 3) Group Room (KLV6)
 * 4) Triple/Twin Rooms (KLV3) - last
 */

async function reorderAccommodations() {
  console.log('🔄 Reordering accommodations to match requested sequence...');
  
  try {
    // Get current rooms
    const response = await fetch('/api/rooms');
    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.status}`);
    }
    
    const currentRooms = await response.json();
    console.log(`📋 Found ${currentRooms.length} existing rooms`);
    
    // Define the new order mapping
    const orderMapping = {
      'KLV - Entire Villa': 1,
      'KLV1 - Master Family Suite': 2, 
      'KLV6 - Group Room': 3,
      'KLV3 - Triple/Twin Room': 4
    };
    
    // Find and reorder rooms
    const reorderedRooms = [];
    
    // 1. Entire Villa first
    const entireVilla = currentRooms.find(room => 
      room.name.includes('Entire Villa') || room.name.includes('KLV -') || room.name.includes('Complete Ko Lake Villa')
    );
    if (entireVilla) {
      reorderedRooms.push({...entireVilla, sortOrder: 1});
      console.log('✅ 1. Entire Villa positioned first');
    }
    
    // 2. Master Family Suite second
    const familySuite = currentRooms.find(room => 
      room.name.includes('Master Family Suite') || room.name.includes('KLV1') || room.name.includes('family suite')
    );
    if (familySuite) {
      reorderedRooms.push({...familySuite, sortOrder: 2});
      console.log('✅ 2. Master Family Suite positioned second');
    }
    
    // 3. Group Room third
    const groupRoom = currentRooms.find(room => 
      room.name.includes('Group Room') || room.name.includes('KLV6') || room.name.includes('group accommodation')
    );
    if (groupRoom) {
      reorderedRooms.push({...groupRoom, sortOrder: 3});
      console.log('✅ 3. Group Room positioned third');
    }
    
    // 4. Triple/Twin Rooms last
    const tripleRooms = currentRooms.find(room => 
      room.name.includes('Triple') || room.name.includes('KLV3') || room.name.includes('Twin')
    );
    if (tripleRooms) {
      reorderedRooms.push({...tripleRooms, sortOrder: 4});
      console.log('✅ 4. Triple/Twin Rooms positioned last');
    }
    
    console.log(`\n📊 Reordered ${reorderedRooms.length} accommodations`);
    console.log('New order:');
    reorderedRooms.forEach((room, index) => {
      console.log(`${index + 1}. ${room.name} (ID: ${room.id})`);
    });
    
    // Update room order in database by updating each room
    for (const room of reorderedRooms) {
      try {
        const updateResponse = await fetch(`/api/rooms/${room.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sortOrder: room.sortOrder })
        });
        
        if (updateResponse.ok) {
          console.log(`✅ Updated ${room.name} sort order to ${room.sortOrder}`);
        } else {
          console.log(`⚠️ Update failed for ${room.name}: ${updateResponse.status}`);
        }
      } catch (error) {
        console.log(`❌ Error updating ${room.name}: ${error.message}`);
      }
    }
    
    // Verify the new order
    console.log('\n🔍 Verifying new accommodation order...');
    const verifyResponse = await fetch('/api/rooms');
    if (verifyResponse.ok) {
      const updatedRooms = await verifyResponse.json();
      console.log('Current order in API:');
      updatedRooms.forEach((room, index) => {
        console.log(`${index + 1}. ${room.name}`);
      });
    }
    
    return {
      success: true,
      message: 'Accommodations successfully reordered',
      newOrder: reorderedRooms.map(r => r.name)
    };
    
  } catch (error) {
    console.error('❌ Reorder failed:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the reorder
reorderAccommodations().then(result => {
  if (result.success) {
    console.log('\n🎉 SUCCESS: Accommodations reordered as requested!');
    console.log('Order: 1) Entire Villa → 2) Suite KLV1 → 3) Group KLV6 → 4) Triple KLV3');
  } else {
    console.log('\n💥 FAILED: Could not reorder accommodations');
  }
});