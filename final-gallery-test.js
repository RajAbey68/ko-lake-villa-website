/**
 * Ko Lake Villa - Final Gallery Test Suite
 * Complete verification of all gallery functionality before deployment
 */

async function finalGalleryTest() {
  console.log('🚀 Running Final Gallery Test Suite...');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };
  
  function logTest(test, status, details = '') {
    const result = { test, status, details };
    results.tests.push(result);
    if (status === 'PASS') {
      results.passed++;
      console.log(`✅ ${test}: PASS ${details}`);
    } else {
      results.failed++;
      console.log(`❌ ${test}: FAIL ${details}`);
    }
  }
  
  // Test 1: Gallery API and Data Loading
  try {
    const response = await fetch('/api/gallery');
    const images = await response.json();
    
    if (response.ok && images.length > 0) {
      logTest('Gallery API', 'PASS', `- ${images.length} items loaded`);
      
      const videos = images.filter(img => img.mediaType === 'video');
      const photos = images.filter(img => img.mediaType === 'image');
      
      logTest('Media Types', 'PASS', `- ${videos.length} videos, ${photos.length} images`);
    } else {
      logTest('Gallery API', 'FAIL', '- No data returned');
    }
  } catch (error) {
    logTest('Gallery API', 'FAIL', `- ${error.message}`);
  }
  
  // Test 2: Click Handler Verification
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const imageElements = document.querySelectorAll('button[type="button"]');
  const editButtons = document.querySelectorAll('button[aria-label*="Edit"]');
  
  if (imageElements.length > 0) {
    logTest('Media Click Elements', 'PASS', `- ${imageElements.length} clickable elements found`);
  } else {
    logTest('Media Click Elements', 'FAIL', '- No clickable elements found');
  }
  
  if (editButtons.length > 0) {
    logTest('Edit Buttons', 'PASS', `- ${editButtons.length} edit buttons found`);
  } else {
    logTest('Edit Buttons', 'FAIL', '- No edit buttons found');
  }
  
  // Test 3: Modal State Testing
  let modalTestPassed = false;
  
  // Listen for modal changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        const modals = document.querySelectorAll('[role="dialog"]');
        if (modals.length > 0) {
          modalTestPassed = true;
        }
      }
    });
  });
  
  observer.observe(document.body, { childList: true, subtree: true });
  
  // Test modal opening
  if (imageElements.length > 0) {
    const firstElement = imageElements[0];
    firstElement.click();
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (modalTestPassed) {
      logTest('Modal Opening', 'PASS', '- Modal opens on click');
    } else {
      logTest('Modal Opening', 'FAIL', '- Modal does not open');
    }
  }
  
  observer.disconnect();
  
  // Test 4: Video File Access
  try {
    const videoResponse = await fetch('/uploads/gallery/default/1747345835546-656953027-20250420_170537.mp4', { method: 'HEAD' });
    if (videoResponse.ok) {
      logTest('Video File Access', 'PASS', '- Video files accessible');
    } else {
      logTest('Video File Access', 'FAIL', `- Status: ${videoResponse.status}`);
    }
  } catch (error) {
    logTest('Video File Access', 'FAIL', `- ${error.message}`);
  }
  
  // Test 5: Edit Dialog State
  if (editButtons.length > 0) {
    const firstEditButton = editButtons[0];
    firstEditButton.click();
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const editDialogs = document.querySelectorAll('[role="dialog"]');
    if (editDialogs.length > 0) {
      logTest('Edit Dialog', 'PASS', '- Edit dialog opens');
    } else {
      logTest('Edit Dialog', 'FAIL', '- Edit dialog does not open');
    }
  }
  
  // Test 6: Console Error Check
  let hasErrors = false;
  const originalError = console.error;
  console.error = (...args) => {
    hasErrors = true;
    originalError.apply(console, args);
  };
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  console.error = originalError;
  
  if (!hasErrors) {
    logTest('Console Errors', 'PASS', '- No JavaScript errors');
  } else {
    logTest('Console Errors', 'FAIL', '- JavaScript errors detected');
  }
  
  // Generate Final Report
  console.log('\n📊 FINAL TEST RESULTS:');
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
  
  console.log('\n📋 Detailed Results:');
  results.tests.forEach(test => {
    console.log(`${test.status === 'PASS' ? '✅' : '❌'} ${test.test}: ${test.details}`);
  });
  
  // Deployment Readiness
  const deploymentReady = results.failed === 0;
  console.log(`\n🚀 DEPLOYMENT STATUS: ${deploymentReady ? 'READY' : 'NOT READY'}`);
  
  if (deploymentReady) {
    console.log('✅ All tests passed - Gallery is ready for deployment!');
  } else {
    console.log('❌ Some tests failed - Review issues before deployment');
  }
  
  return {
    ready: deploymentReady,
    passed: results.passed,
    failed: results.failed,
    tests: results.tests
  };
}

// Auto-run test
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', finalGalleryTest);
} else {
  finalGalleryTest();
}

// Make function available globally
window.finalGalleryTest = finalGalleryTest;

console.log('Final gallery test loaded. Will run automatically or call finalGalleryTest()');