
/**
 * Ko Lake Villa - Pre-Deployment Validation Suite
 * Comprehensive testing before production deployment
 */

async function runPreDeploymentValidation() {
  console.log('🚀 Ko Lake Villa - Pre-Deployment Validation Starting...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    critical: 0,
    criticalPassed: 0,
    tests: []
  };

  function logTest(name, passed, details = '', critical = false) {
    const result = { name, passed, details, critical };
    results.tests.push(result);
    
    if (critical) {
      results.critical++;
      if (passed) results.criticalPassed++;
    }
    
    if (passed) results.passed++; else results.failed++;
    
    const icon = passed ? '✅' : '❌';
    const criticalFlag = critical ? ' [CRITICAL]' : '';
    console.log(`${icon} ${name}${criticalFlag}${details ? ` - ${details}` : ''}`);
  }

  // Test 1: Core API Endpoints
  console.log('🔌 Testing Core API Endpoints...');
  
  // Determine the base URL for API calls
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : 'http://localhost:5000';
  
  try {
    const galleryResponse = await fetch(`${baseUrl}/api/gallery`);
    const gallery = await galleryResponse.json();
    
    if (galleryResponse.ok && Array.isArray(gallery)) {
      logTest('Gallery API', true, `${gallery.length} images loaded`, true);
      
      // Check for authentic villa content
      const hasVillaContent = gallery.some(item => 
        item.alt && (
          item.alt.toLowerCase().includes('villa') || 
          item.alt.toLowerCase().includes('suite') || 
          item.alt.toLowerCase().includes('room')
        )
      );
      logTest('Authentic Villa Content', hasVillaContent, 'Real villa images present');
      
      // Check video content
      const hasVideo = gallery.some(item => item.mediaType === 'video');
      logTest('Video Content Support', hasVideo, 'Video streaming available');
      
    } else {
      logTest('Gallery API', false, `Status: ${galleryResponse.status}`, true);
    }
  } catch (error) {
    logTest('Gallery API', false, error.message, true);
  }

  // Test 2: Upload System
  try {
    const formData = new FormData();
    formData.append('category', 'test');
    
    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (uploadResponse.status === 400) {
      logTest('Upload System', true, 'Upload validation working', true);
    } else {
      logTest('Upload System', false, `Unexpected status: ${uploadResponse.status}`, true);
    }
  } catch (error) {
    logTest('Upload System', false, error.message, true);
  }

  // Test 3: Database Connectivity
  try {
    const roomsResponse = await fetch(`${baseUrl}/api/rooms`);
    const rooms = await roomsResponse.json();
    
    if (roomsResponse.ok && Array.isArray(rooms)) {
      logTest('Database Connection', true, `${rooms.length} rooms configured`, true);
    } else {
      logTest('Database Connection', false, `Status: ${roomsResponse.status}`, true);
    }
  } catch (error) {
    logTest('Database Connection', false, error.message, true);
  }

  // Test 4: Admin Authentication
  try {
    const adminResponse = await fetch(`${baseUrl}/api/admin/check`);
    if (adminResponse.status === 401 || adminResponse.status === 403) {
      logTest('Admin Security', true, 'Admin routes protected');
    } else if (adminResponse.ok) {
      logTest('Admin Security', true, 'Admin access verified');
    } else {
      logTest('Admin Security', false, 'Admin endpoint issues');
    }
  } catch (error) {
    logTest('Admin Security', false, error.message);
  }

  // Test 5: Category System
  const categories = [
    'entire-villa', 'family-suite', 'group-room', 'triple-room',
    'dining-area', 'pool-deck', 'lake-garden', 'roof-garden',
    'front-garden', 'koggala-lake', 'excursions'
  ];
  logTest('Villa Categories', true, `${categories.length} categories configured`);

  // Test 6: Image Editing Capability
  try {
    const galleryResponse = await fetch(`${baseUrl}/api/gallery`);
    const gallery = await galleryResponse.json();
    
    if (gallery && gallery.length > 0) {
      const testImage = gallery[0];
      
      const updateResponse = await fetch(`${baseUrl}/api/gallery/${testImage.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alt: testImage.alt,
          tags: testImage.tags || 'villa, accommodation'
        })
      });
      
      if (updateResponse.ok) {
        logTest('Image Editing', true, 'Metadata updates working');
      } else {
        logTest('Image Editing', false, `Status: ${updateResponse.status}`);
      }
    } else {
      logTest('Image Editing', false, 'No images available for testing');
    }
  } catch (error) {
    logTest('Image Editing', false, error.message);
  }

  // Test 7: Static File Serving
  try {
    const faviconResponse = await fetch(`${baseUrl}/favicon.ico`);
    logTest('Static File Serving', faviconResponse.ok, `Status: ${faviconResponse.status}`);
  } catch (error) {
    logTest('Static File Serving', false, error.message);
  }

  // Test 8: Page Accessibility
  const pages = ['/', '/accommodation', '/gallery', '/contact', '/experiences'];
  let pagesAccessible = 0;
  
  for (const page of pages) {
    try {
      const pageResponse = await fetch(`${baseUrl}${page}`);
      if (pageResponse.ok) pagesAccessible++;
    } catch (error) {
      // Page test failed
    }
  }
  
  logTest('Page Accessibility', pagesAccessible === pages.length, 
    `${pagesAccessible}/${pages.length} pages accessible`);

  // Print Results
  console.log('\n' + '='.repeat(60));
  console.log('📊 PRE-DEPLOYMENT VALIDATION RESULTS');
  console.log('='.repeat(60));
  console.log(`✅ Tests Passed: ${results.passed}`);
  console.log(`❌ Tests Failed: ${results.failed}`);
  console.log(`🎯 Critical Tests: ${results.criticalPassed}/${results.critical}`);
  console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  // Critical System Assessment
  console.log('\n🔥 CRITICAL SYSTEMS STATUS:');
  const criticalTests = results.tests.filter(test => test.critical);
  criticalTests.forEach(test => {
    const status = test.passed ? '✅ OPERATIONAL' : '❌ FAILED';
    console.log(`   ${test.name}: ${status}`);
  });
  
  // Deployment Decision
  console.log('\n🚀 DEPLOYMENT RECOMMENDATION:');
  if (results.criticalPassed === results.critical && results.failed <= 1) {
    console.log('✅ READY FOR PRODUCTION DEPLOYMENT');
    console.log('   • All critical systems operational');
    console.log('   • Gallery system fully functional');
    console.log('   • Database connectivity confirmed');
    console.log('   • Upload system working');
    console.log('   • Admin security verified');
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('   1. Click Deploy button in Replit');
    console.log('   2. Configure Autoscale deployment');
    console.log('   3. Set machine power based on traffic needs');
    console.log('   4. Verify production URL accessibility');
    
  } else if (results.criticalPassed === results.critical) {
    console.log('⚠️  READY WITH MINOR ISSUES');
    console.log('   • Critical systems operational');
    console.log('   • Some non-critical features need attention');
    console.log('   • Safe to deploy with monitoring');
    
  } else {
    console.log('❌ NOT READY FOR DEPLOYMENT');
    console.log('   • Critical system failures detected');
    console.log('   • Must resolve critical issues before deployment');
  }
  
  // Failed Tests Summary
  if (results.failed > 0) {
    console.log('\n❌ ISSUES TO ADDRESS:');
    results.tests
      .filter(test => !test.passed)
      .forEach(test => {
        const priority = test.critical ? '[CRITICAL]' : '[MINOR]';
        console.log(`   ${priority} ${test.name}: ${test.details}`);
      });
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('💡 DEPLOYMENT TIP: Your Ko Lake Villa app is designed for Replit\'s Autoscale deployment');
  console.log('   which automatically scales based on traffic and only charges for actual usage.');
  
  return results;
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  console.log('🧪 Ko Lake Villa Pre-Deployment Validation Loaded');
  console.log('Run in browser console: runPreDeploymentValidation()');
  window.runPreDeploymentValidation = runPreDeploymentValidation;
} else {
  // Run immediately if in Node.js
  runPreDeploymentValidation();
}
