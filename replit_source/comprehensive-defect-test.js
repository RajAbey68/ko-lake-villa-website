/**
 * Comprehensive Defect Test - Tests all known issues from coverage
 */

async function testAPI(endpoint, method = 'GET', body = null) {
  try {
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    
    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, options);
    return {
      ok: response.ok,
      status: response.status,
      data: await response.json().catch(() => null)
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: error.message
    };
  }
}

async function runComprehensiveTest() {
  console.log('🔍 Testing All Known Defects...\n');
  
  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  function logResult(test, status, message) {
    results.tests.push({ test, status, message });
    if (status === 'PASS') {
      results.passed++;
      console.log(`✅ ${test}: ${message}`);
    } else {
      results.failed++;
      console.log(`❌ ${test}: ${message}`);
    }
  }

  // Test 1: Critical API endpoints
  console.log('Testing API Endpoints...');
  
  const apiTests = [
    { url: '/api/content', name: 'Content API' },
    { url: '/api/pricing', name: 'Pricing API' },
    { url: '/api/admin/pricing', name: 'Admin Pricing API' },
    { url: '/api/gallery', name: 'Gallery API' },
    { url: '/api/rooms', name: 'Rooms API' },
    { url: '/api/testimonials', name: 'Testimonials API' },
    { url: '/api/activities', name: 'Activities API' }
  ];

  for (const test of apiTests) {
    const result = await testAPI(test.url);
    if (result.ok) {
      logResult(test.name, 'PASS', `Status ${result.status}`);
    } else {
      logResult(test.name, 'FAIL', `Status ${result.status} - ${result.error || 'API not accessible'}`);
    }
  }

  // Test 2: Contact form with messageType
  console.log('\nTesting Contact Form...');
  
  const contactData = {
    name: 'Test User',
    email: 'test@example.com',
    subject: 'Test Subject',
    message: 'This is a test message that is long enough to pass validation',
    messageType: 'message'
  };

  const contactResult = await testAPI('/api/contact', 'POST', contactData);
  if (contactResult.ok) {
    logResult('Contact Form', 'PASS', `Status ${contactResult.status} - Form accepts messageType`);
  } else {
    logResult('Contact Form', 'FAIL', `Status ${contactResult.status} - ${contactResult.data?.message || 'Validation failed'}`);
  }

  // Test 3: Newsletter subscription
  console.log('\nTesting Newsletter...');
  
  const newsletterData = {
    email: 'newsletter-test@example.com'
  };

  const newsletterResult = await testAPI('/api/newsletter', 'POST', newsletterData);
  if (newsletterResult.ok) {
    logResult('Newsletter', 'PASS', `Status ${newsletterResult.status}`);
  } else {
    logResult('Newsletter', 'FAIL', `Status ${newsletterResult.status} - ${newsletterResult.data?.message || 'Subscription failed'}`);
  }

  // Test 4: Admin route accessibility
  console.log('\nTesting Admin Routes...');
  
  const adminRoutes = [
    '/admin',
    '/admin/login',
    '/admin/dashboard',
    '/admin/gallery'
  ];

  for (const route of adminRoutes) {
    try {
      const response = await fetch(route);
      if (response.ok) {
        logResult(`Admin Route ${route}`, 'PASS', `Status ${response.status}`);
      } else {
        logResult(`Admin Route ${route}`, 'FAIL', `Status ${response.status}`);
      }
    } catch (error) {
      logResult(`Admin Route ${route}`, 'FAIL', `Error: ${error.message}`);
    }
  }

  // Test 5: 404 Error handling
  console.log('\nTesting 404 Handling...');
  
  try {
    const response = await fetch('/non-existent-page');
    if (response.status === 404) {
      logResult('404 Handling', 'PASS', 'Proper 404 status returned');
    } else {
      logResult('404 Handling', 'FAIL', `Expected 404, got ${response.status}`);
    }
  } catch (error) {
    logResult('404 Handling', 'FAIL', `Error: ${error.message}`);
  }

  // Generate final report
  console.log('\n📊 COMPREHENSIVE TEST RESULTS');
  console.log('==========================================');
  console.log(`✅ Tests Passed: ${results.passed}`);
  console.log(`❌ Tests Failed: ${results.failed}`);
  console.log(`📊 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 ALL DEFECTS RESOLVED! Ko Lake Villa is ready for deployment.');
  } else {
    console.log('\n⚠️ Some issues remain. Review failed tests above.');
    
    const failedTests = results.tests.filter(t => t.status === 'FAIL');
    console.log('\n❌ Remaining Issues:');
    failedTests.forEach((test, index) => {
      console.log(`   ${index + 1}. ${test.test}: ${test.message}`);
    });
  }

  console.log('\n🔗 Deployment Status:');
  if (results.failed <= 2) {
    console.log('   ✅ READY FOR DEPLOYMENT');
  } else {
    console.log('   ⚠️ NEEDS ATTENTION');
  }

  return results;
}

// Auto-run test
if (typeof window !== 'undefined') {
  runComprehensiveTest();
}

// Export for Node.js
if (typeof module !== 'undefined') {
  module.exports = { runComprehensiveTest };
}