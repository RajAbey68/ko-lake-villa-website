
async function testGalleryFunctionality() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🖼️ Testing Gallery Functionality...\n');
  
  let passed = 0;
  let failed = 0;
  
  function logTest(test, status, details = '') {
    const statusColor = status === 'PASS' ? '✅' : '❌';
    console.log(`${statusColor} ${test}${details ? ` - ${details}` : ''}`);
    if (status === 'PASS') passed++; else failed++;
  }
  
  // Test 1: Gallery API
  try {
    const response = await fetch(`${baseUrl}/api/gallery`);
    const data = await response.json();
    
    if (response.ok && Array.isArray(data)) {
      logTest('Gallery API', 'PASS', `${data.length} images loaded`);
    } else {
      logTest('Gallery API', 'FAIL', `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Gallery API', 'FAIL', error.message);
  }
  
  // Test 2: Category filtering
  try {
    const response = await fetch(`${baseUrl}/api/gallery?category=family-suite`);
    const data = await response.json();
    
    if (response.ok && Array.isArray(data)) {
      logTest('Category filtering', 'PASS', `Filtered results returned`);
    } else {
      logTest('Category filtering', 'FAIL', `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Category filtering', 'FAIL', error.message);
  }
  
  // Test 3: Admin gallery route
  try {
    const response = await fetch(`${baseUrl}/admin/gallery`);
    
    if (response.ok) {
      logTest('Admin gallery route', 'PASS', 'Route accessible');
    } else {
      logTest('Admin gallery route', 'FAIL', `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Admin gallery route', 'FAIL', error.message);
  }
  
  // Test 4: Public gallery route
  try {
    const response = await fetch(`${baseUrl}/gallery`);
    
    if (response.ok) {
      logTest('Public gallery route', 'PASS', 'Route accessible');
    } else {
      logTest('Public gallery route', 'FAIL', `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Public gallery route', 'FAIL', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('GALLERY FIX TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 ALL GALLERY ISSUES FIXED!');
  } else if (failed <= 1) {
    console.log('\n✅ GALLERY MOSTLY WORKING - Minor issues remain');
  } else {
    console.log('\n⚠️ GALLERY NEEDS MORE WORK');
  }
}

// Run the test
testGalleryFunctionality().catch(console.error);
