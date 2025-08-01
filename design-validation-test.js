#!/usr/bin/env node

/**
 * COMPREHENSIVE DESIGN VALIDATION TEST
 * Tests all design requirements per user specifications
 */

const BASE_URL = 'https://ko-lake-villa-website.vercel.app';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testEndpoint(endpoint, description) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`🔍 Testing: ${description}`);
  console.log(`   URL: ${url}`);
  
  try {
    const response = await fetch(url);
    const isSuccess = response.status === 200;
    console.log(`   ${isSuccess ? '✅' : '❌'} Status: ${response.status}`);
    
    if (isSuccess) {
      const html = await response.text();
      return { success: true, html, status: response.status };
    }
    return { success: false, status: response.status };
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function validateDesignElements(html, pageName) {
  console.log(`\n🎨 VALIDATING DESIGN ELEMENTS: ${pageName.toUpperCase()}`);
  console.log('=' .repeat(60));
  
  const validations = [];
  
  // 1. Hero Text Alignment (Landing Page)
  if (pageName === 'landing') {
    const hasHeroText = html.includes('hero-text');
    const hasLeftMargin = html.includes('margin-left: 2rem') || html.includes('ml-8') || html.includes('ml-12');
    validations.push({
      test: 'Hero Text Left Alignment',
      result: hasHeroText && hasLeftMargin,
      details: hasHeroText ? 'Hero text class found' : 'Hero text class missing',
      requirement: 'Text aligned left with margin to prevent bleeding'
    });
  }
  
  // 2. Logo Validation
  const hasSalaLogo = html.includes('/images/sala-lake.jpg');
  const hasLogoAltText = html.includes('Lakeside Sala Pavilion') || html.includes('sala');
  validations.push({
    test: 'Correct Logo (Sala Lake Image)',
    result: hasSalaLogo,
    details: hasSalaLogo ? 'Sala lake image found' : 'Sala lake image missing',
    requirement: 'ONLY sala-lake.jpg as logo on every page'
  });
  
  // 3. Logo + Text Positioning
  const hasKoLakeVillaText = html.includes('Ko Lake Villa');
  const hasFlexLayout = html.includes('flex items-center') || html.includes('villa-brand');
  validations.push({
    test: 'Logo + Text Positioning',
    result: hasKoLakeVillaText && hasFlexLayout,
    details: `Text: ${hasKoLakeVillaText ? 'Found' : 'Missing'}, Layout: ${hasFlexLayout ? 'Found' : 'Missing'}`,
    requirement: '"Ko Lake Villa" to the immediate right of logo'
  });
  
  // 4. Video Elements (Gallery page)
  if (pageName === 'gallery') {
    const hasVideoTag = html.includes('<video');
    const hasPosterAttribute = html.includes('poster=');
    const hasVideoIcon = html.includes('Video className') || html.includes('w-5 h-5 text-red-600');
    validations.push({
      test: 'Video Thumbnails (Poster)',
      result: hasVideoTag && hasPosterAttribute,
      details: `Video tags: ${hasVideoTag ? 'Found' : 'Missing'}, Posters: ${hasPosterAttribute ? 'Found' : 'Missing'}`,
      requirement: 'Videos show thumbnails before playback'
    });
    
    validations.push({
      test: 'Video Icons Right Side',
      result: hasVideoIcon,
      details: hasVideoIcon ? 'Video icons found' : 'Video icons missing',
      requirement: 'Small video icons to the right of video titles'
    });
  }
  
  // 5. Mobile Responsiveness Indicators
  const hasResponsiveClasses = html.includes('@media') || html.includes('md:') || html.includes('sm:');
  validations.push({
    test: 'Mobile Responsive Design',
    result: hasResponsiveClasses,
    details: hasResponsiveClasses ? 'Responsive classes found' : 'Responsive classes missing',
    requirement: 'Design works on mobile/tablet screens'
  });
  
  // Print validation results
  validations.forEach(validation => {
    const status = validation.result ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${validation.test}`);
    console.log(`    📋 Requirement: ${validation.requirement}`);
    console.log(`    🔍 Details: ${validation.details}`);
    console.log('');
  });
  
  const passCount = validations.filter(v => v.result).length;
  const totalCount = validations.length;
  const passRate = ((passCount / totalCount) * 100).toFixed(1);
  
  console.log(`📊 SUMMARY: ${passCount}/${totalCount} validations passed (${passRate}%)`);
  
  return {
    passed: passCount,
    total: totalCount,
    passRate: parseFloat(passRate),
    validations
  };
}

async function runDesignValidation() {
  console.log('🎨 COMPREHENSIVE DESIGN VALIDATION TEST');
  console.log('Testing all design requirements per user specifications\n');
  console.log('=' .repeat(80));
  
  const testResults = [];
  
  // Test 1: Landing Page
  console.log('\n📍 TEST 1: LANDING PAGE DESIGN');
  const landingTest = await testEndpoint('/', 'Landing Page Load');
  if (landingTest.success) {
    const landingValidation = await validateDesignElements(landingTest.html, 'landing');
    testResults.push({ page: 'Landing', ...landingValidation });
  }
  
  // Test 2: Gallery Page
  console.log('\n📍 TEST 2: GALLERY PAGE DESIGN');
  const galleryTest = await testEndpoint('/gallery', 'Gallery Page Load');
  if (galleryTest.success) {
    const galleryValidation = await validateDesignElements(galleryTest.html, 'gallery');
    testResults.push({ page: 'Gallery', ...galleryValidation });
  }
  
  // Test 3: Any Admin Page (for header consistency)
  console.log('\n📍 TEST 3: HEADER CONSISTENCY CHECK');
  const headerTest = await testEndpoint('/accommodation', 'Accommodation Page Load');
  if (headerTest.success) {
    const headerValidation = await validateDesignElements(headerTest.html, 'header');
    testResults.push({ page: 'Header', ...headerValidation });
  }
  
  // Test 4: Mobile/Responsive Test (via User-Agent)
  console.log('\n📍 TEST 4: MOBILE RESPONSIVENESS');
  try {
    const mobileResponse = await fetch(`${BASE_URL}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2 Mobile/15E148 Safari/604.1'
      }
    });
    console.log(`   ✅ Mobile User-Agent Test: ${mobileResponse.status === 200 ? 'PASS' : 'FAIL'}`);
  } catch (error) {
    console.log(`   ❌ Mobile Test Error: ${error.message}`);
  }
  
  // Overall Summary
  console.log('\n' + '=' .repeat(80));
  console.log('🎯 OVERALL DESIGN VALIDATION SUMMARY');
  console.log('=' .repeat(80));
  
  testResults.forEach(result => {
    console.log(`📄 ${result.page}: ${result.passed}/${result.total} (${result.passRate}%)`);
  });
  
  const overallPassed = testResults.reduce((sum, r) => sum + r.passed, 0);
  const overallTotal = testResults.reduce((sum, r) => sum + r.total, 0);
  const overallRate = overallTotal > 0 ? ((overallPassed / overallTotal) * 100).toFixed(1) : 0;
  
  console.log(`\n🏆 OVERALL SCORE: ${overallPassed}/${overallTotal} (${overallRate}%)`);
  
  // Recommendations
  console.log('\n📋 NEXT STEPS FOR VALIDATION:');
  console.log('1. 🌐 Visit: https://ko-lake-villa-website.vercel.app/');
  console.log('2. 📱 Test on mobile device or browser mobile mode');
  console.log('3. 🎬 Visit gallery and test video thumbnails/icons');
  console.log('4. 🔍 Inspect element to verify CSS margins and positioning');
  console.log('5. 📸 Take screenshots for visual confirmation');
  
  if (overallRate >= 80) {
    console.log('\n✅ DESIGN VALIDATION: GOOD - Most requirements met');
  } else if (overallRate >= 60) {
    console.log('\n⚠️  DESIGN VALIDATION: NEEDS WORK - Some issues remain');
  } else {
    console.log('\n❌ DESIGN VALIDATION: CRITICAL ISSUES - Major fixes needed');
  }
  
  console.log('\n📝 Remember: Visual confirmation required for complete validation!');
}

runDesignValidation().catch(console.error); 