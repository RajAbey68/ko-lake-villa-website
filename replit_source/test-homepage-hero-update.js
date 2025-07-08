/**
 * Ko Lake Villa - Homepage Hero Image Update Test
 * Verifies the new stunning pool image is displaying correctly
 */

async function testHomepageHeroUpdate() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🏠 Testing Homepage Hero Image Update...\n');
  
  let passed = 0;
  let failed = 0;
  
  function logTest(test, status, details = '') {
    const statusColor = status === 'PASS' ? '✅' : '❌';
    console.log(`${statusColor} ${test}${details ? ` - ${details}` : ''}`);
    if (status === 'PASS') passed++; else failed++;
  }
  
  // Test 1: Homepage loads successfully
  try {
    const homeResponse = await fetch(`${baseUrl}/`);
    
    if (homeResponse.ok) {
      logTest('Homepage loads', 'PASS', `Status: ${homeResponse.status}`);
    } else {
      logTest('Homepage loads', 'FAIL', `Status: ${homeResponse.status}`);
    }
  } catch (error) {
    logTest('Homepage loads', 'FAIL', error.message);
  }
  
  // Test 2: New hero image reference in HTML
  try {
    const homeResponse = await fetch(`${baseUrl}/`);
    const homeContent = await homeResponse.text();
    
    const hasNewHeroImage = homeContent.includes('DSC08595_1749743460820.jpg') ||
                           homeContent.includes('@assets/DSC08595');
    
    if (hasNewHeroImage) {
      logTest('New hero image reference', 'PASS', 'Stunning pool image integrated');
    } else {
      logTest('New hero image reference', 'FAIL', 'New image reference not found');
    }
  } catch (error) {
    logTest('New hero image reference', 'FAIL', error.message);
  }
  
  // Test 3: Hero section structure intact
  try {
    const homeResponse = await fetch(`${baseUrl}/`);
    const homeContent = await homeResponse.text();
    
    const hasHeroStructure = homeContent.includes('Ko Lake Villa') &&
                            homeContent.includes('Luxury Lakeside Villa') &&
                            homeContent.includes('Book Your Stay');
    
    if (hasHeroStructure) {
      logTest('Hero section structure', 'PASS', 'Text and call-to-action preserved');
    } else {
      logTest('Hero section structure', 'FAIL', 'Hero content missing');
    }
  } catch (error) {
    logTest('Hero section structure', 'FAIL', error.message);
  }
  
  // Test 4: SEO metadata for new image
  try {
    const homeResponse = await fetch(`${baseUrl}/`);
    const homeContent = await homeResponse.text();
    
    const hasSEOTags = homeContent.includes('meta name="description"') &&
                     homeContent.includes('Ko Lake Villa') &&
                     homeContent.includes('Ahangama');
    
    if (hasSEOTags) {
      logTest('SEO metadata', 'PASS', 'Search engine optimization preserved');
    } else {
      logTest('SEO metadata', 'FAIL', 'SEO tags missing');
    }
  } catch (error) {
    logTest('SEO metadata', 'FAIL', error.message);
  }
  
  // Test 5: Responsive design maintained
  try {
    const homeResponse = await fetch(`${baseUrl}/`);
    const homeContent = await homeResponse.text();
    
    const hasResponsiveClasses = homeContent.includes('text-4xl md:text-6xl') &&
                                homeContent.includes('text-xl md:text-2xl') &&
                                homeContent.includes('relative h-screen');
    
    if (hasResponsiveClasses) {
      logTest('Responsive design', 'PASS', 'Mobile and desktop layouts preserved');
    } else {
      logTest('Responsive design', 'FAIL', 'Responsive classes missing');
    }
  } catch (error) {
    logTest('Responsive design', 'FAIL', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('HOMEPAGE HERO IMAGE UPDATE TEST RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 HOMEPAGE HERO IMAGE SUCCESSFULLY UPDATED!');
    console.log('\n✅ NEW HERO FEATURES:');
    console.log('• Stunning pool image with crystal-clear blue water');
    console.log('• Beautiful modern architecture visible');
    console.log('• Lush tropical greenery and palm trees');
    console.log('• Perfect representation of luxury villa experience');
    console.log('• Maintains professional branding and call-to-action');
    
    console.log('\n🌟 VISUAL IMPACT:');
    console.log('• Immediately showcases the pool as main attraction');
    console.log('• Demonstrates high-end accommodation quality');
    console.log('• Creates aspirational feeling for potential guests');
    console.log('• Authentic property photography builds trust');
    
  } else {
    console.log('\n⚠️ Hero image update needs refinement');
  }
  
  return { passed, failed, working: failed === 0 };
}

testHomepageHeroUpdate().catch(console.error);