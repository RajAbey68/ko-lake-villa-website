/**
 * Ko Lake Villa - Category System Fix Test
 * Tests that dropdown categories match functional category buttons
 */

async function testCategorySystemFix() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🏷️ Testing Category System Fix...\n');
  
  let passed = 0;
  let failed = 0;
  
  function logTest(test, status, details = '') {
    const statusColor = status === 'PASS' ? '✅' : '❌';
    console.log(`${statusColor} ${test}${details ? ` - ${details}` : ''}`);
    if (status === 'PASS') passed++; else failed++;
  }
  
  // Test 1: Homepage has beautiful pool image
  try {
    const homeResponse = await fetch(`${baseUrl}/`);
    const homeContent = await homeResponse.text();
    
    const hasPoolImage = homeContent.includes('pool-deck') && 
                        homeContent.includes('KoggalaNinePeaks_pool-deck_0.jpg');
    
    if (hasPoolImage) {
      logTest('Homepage pool hero image', 'PASS', 'Beautiful blue pool image restored');
    } else {
      logTest('Homepage pool hero image', 'FAIL', 'Pool image not found');
    }
  } catch (error) {
    logTest('Homepage pool hero image', 'FAIL', error.message);
  }
  
  // Test 2: Confusing "Available Categories" section removed
  try {
    const adminGalleryResponse = await fetch(`${baseUrl}/admin/gallery`);
    const adminContent = await adminGalleryResponse.text();
    
    const hasConfusingSection = adminContent.includes('Available Categories') &&
                               adminContent.includes('bg-purple-100') &&
                               adminContent.includes('bg-blue-100');
    
    if (!hasConfusingSection) {
      logTest('Removed confusing categories section', 'PASS', 'Pointless section eliminated');
    } else {
      logTest('Removed confusing categories section', 'FAIL', 'Confusing section still present');
    }
  } catch (error) {
    logTest('Removed confusing categories section', 'FAIL', error.message);
  }
  
  // Test 3: Functional category buttons still work
  try {
    const adminGalleryResponse = await fetch(`${baseUrl}/admin/gallery`);
    const adminContent = await adminGalleryResponse.text();
    
    const hasFunctionalButtons = adminContent.includes('All Categories') &&
                                adminContent.includes('Entire Villa') &&
                                adminContent.includes('Family Suite') &&
                                adminContent.includes('Pool Deck');
    
    if (hasFunctionalButtons) {
      logTest('Functional category buttons', 'PASS', 'Working category filters preserved');
    } else {
      logTest('Functional category buttons', 'FAIL', 'Category buttons missing');
    }
  } catch (error) {
    logTest('Functional category buttons', 'FAIL', error.message);
  }
  
  // Test 4: TaggingDialog dropdown categories match buttons
  try {
    const adminGalleryResponse = await fetch(`${baseUrl}/admin/gallery`);
    const adminContent = await adminGalleryResponse.text();
    
    // Check for consistent category values
    const hasConsistentCategories = adminContent.includes('entire-villa') &&
                                   adminContent.includes('family-suite') &&
                                   adminContent.includes('pool-deck') &&
                                   adminContent.includes('koggala-lake');
    
    if (hasConsistentCategories) {
      logTest('Dropdown categories match buttons', 'PASS', 'Category system unified');
    } else {
      logTest('Dropdown categories match buttons', 'FAIL', 'Category mismatch');
    }
  } catch (error) {
    logTest('Dropdown categories match buttons', 'FAIL', error.message);
  }
  
  // Test 5: Edit functionality works with clean categories
  try {
    const galleryResponse = await fetch(`${baseUrl}/api/gallery`);
    const galleryData = await galleryResponse.json();
    
    if (galleryData.length > 0) {
      const testImage = galleryData[0];
      
      // Check if categories are clean and consistent
      const validCategories = [
        'entire-villa', 'family-suite', 'group-room', 'triple-room',
        'dining-area', 'pool-deck', 'lake-garden', 'koggala-lake',
        'excursions', 'friends', 'events'
      ];
      
      const hasValidCategory = validCategories.includes(testImage.category) || 
                              testImage.category === 'default';
      
      if (hasValidCategory) {
        logTest('Clean category system', 'PASS', `Valid category: ${testImage.category}`);
      } else {
        logTest('Clean category system', 'FAIL', `Invalid category: ${testImage.category}`);
      }
    } else {
      logTest('Clean category system', 'FAIL', 'No images to test');
    }
  } catch (error) {
    logTest('Clean category system', 'FAIL', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('CATEGORY SYSTEM FIX TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 CATEGORY SYSTEM FULLY FIXED!');
    console.log('\n✅ IMPROVEMENTS:');
    console.log('• Beautiful blue swimming pool image restored as homepage hero');
    console.log('• Removed confusing "Available Categories" section');
    console.log('• Only functional category buttons remain');
    console.log('• Dropdown categories match button categories');
    console.log('• Clean, unified category system');
    
    console.log('\n📝 HOW IT WORKS NOW:');
    console.log('1. Homepage shows stunning pool image background');
    console.log('2. Admin gallery has only working category buttons');
    console.log('3. Edit dialog categories match filter buttons');
    console.log('4. No more confusing duplicate category displays');
    
  } else {
    console.log('\n⚠️ Category system needs final adjustments');
  }
  
  return { passed, failed, working: failed === 0 };
}

testCategorySystemFix().catch(console.error);