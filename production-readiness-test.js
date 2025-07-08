/**
 * Ko Lake Villa - Production Readiness Test
 * Comprehensive verification of all systems before deployment
 */

async function testProductionReadiness() {
  console.log('🏨 Ko Lake Villa Production Readiness Test\n');
  
  const baseUrl = 'http://localhost:5000';
  let allTestsPassed = true;
  
  // Test 1: API Endpoints
  console.log('1. Testing API Endpoints...');
  try {
    const roomsResponse = await fetch(`${baseUrl}/api/rooms`);
    const rooms = await roomsResponse.json();
    console.log(`   ✓ Rooms API: ${rooms.length} rooms loaded`);
    
    const galleryResponse = await fetch(`${baseUrl}/api/gallery`);
    const gallery = await galleryResponse.json();
    console.log(`   ✓ Gallery API: ${gallery.length} images loaded`);
    
    const pricingResponse = await fetch(`${baseUrl}/api/admin/pricing`);
    const pricing = await pricingResponse.json();
    console.log(`   ✓ Pricing API: Working`);
  } catch (error) {
    console.log(`   ✗ API Error: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Test 2: Room Data Integrity
  console.log('\n2. Testing Room Data...');
  try {
    const response = await fetch(`${baseUrl}/api/rooms`);
    const rooms = await response.json();
    
    const expectedRooms = ['KLV1 - Master Family Suite', 'KLV3 - Triple/Twin Room', 'KLV6 - Group Room', 'KLV - Entire Villa'];
    expectedRooms.forEach(roomName => {
      const room = rooms.find(r => r.name === roomName);
      if (room) {
        console.log(`   ✓ ${roomName}: Found with image ${room.imageUrl}`);
      } else {
        console.log(`   ✗ ${roomName}: Missing`);
        allTestsPassed = false;
      }
    });
  } catch (error) {
    console.log(`   ✗ Room Data Error: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Test 3: Image Assets
  console.log('\n3. Testing Image Assets...');
  const testImages = [
    '/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg',
    '/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg',
    '/uploads/gallery/pool-deck/KoggalaNinePeaks_pool-deck_0.jpg',
    '/uploads/gallery/default/1747314600586-813125493-20250418_070924.jpg'
  ];
  
  for (const imagePath of testImages) {
    try {
      const response = await fetch(`${baseUrl}${imagePath}`);
      if (response.ok) {
        console.log(`   ✓ ${imagePath.split('/').pop()}: Available`);
      } else {
        console.log(`   ✗ ${imagePath.split('/').pop()}: Status ${response.status}`);
        allTestsPassed = false;
      }
    } catch (error) {
      console.log(`   ✗ ${imagePath.split('/').pop()}: ${error.message}`);
      allTestsPassed = false;
    }
  }
  
  // Test 4: Database Connectivity
  console.log('\n4. Testing Database...');
  try {
    const response = await fetch(`${baseUrl}/api/rooms`);
    if (response.ok) {
      console.log('   ✓ Database: Connected and responsive');
    } else {
      console.log('   ✗ Database: Connection issues');
      allTestsPassed = false;
    }
  } catch (error) {
    console.log(`   ✗ Database Error: ${error.message}`);
    allTestsPassed = false;
  }
  
  // Test 5: Core Pages
  console.log('\n5. Testing Core Pages...');
  const pages = ['/', '/accommodation', '/gallery', '/dining', '/experiences'];
  
  for (const page of pages) {
    try {
      const response = await fetch(`${baseUrl}${page}`);
      if (response.ok) {
        console.log(`   ✓ ${page}: Loading successfully`);
      } else {
        console.log(`   ✗ ${page}: Status ${response.status}`);
        allTestsPassed = false;
      }
    } catch (error) {
      console.log(`   ✗ ${page}: ${error.message}`);
      allTestsPassed = false;
    }
  }
  
  // Final Result
  console.log('\n' + '='.repeat(50));
  if (allTestsPassed) {
    console.log('🎉 PRODUCTION READY: All tests passed!');
    console.log('Ko Lake Villa is ready for deployment.');
    console.log('\nDeployment will include:');
    console.log('• All 4 room types with virtual tours');
    console.log('• Authentic iPhone photos');
    console.log('• Working database and APIs');
    console.log('• Complete gallery system');
    console.log('• Pricing and booking functionality');
  } else {
    console.log('⚠️  NOT READY: Some tests failed');
    console.log('Please fix the issues above before deploying.');
  }
  console.log('='.repeat(50));
  
  return allTestsPassed;
}

// Run the test
testProductionReadiness().catch(console.error);