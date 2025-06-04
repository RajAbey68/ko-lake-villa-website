/**
 * Ko Lake Villa - Production Deployment Test
 * Validates all functionality before final deployment
 */

async function runProductionDeploymentTest() {
  console.log('🔥 Ko Lake Villa - Production Deployment Test');
  console.log('='.repeat(50));
  
  const results = {
    passed: 0,
    failed: 0,
    critical: 0,
    tests: []
  };

  function logTest(name, passed, details = '', critical = false) {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${name}: ${details}`);
    
    results.tests.push({ name, passed, details, critical });
    if (passed) {
      results.passed++;
    } else {
      results.failed++;
      if (critical) results.critical++;
    }
  }

  // Test 1: Server Connectivity
  try {
    const response = await fetch('/');
    logTest('Server Connectivity', response.ok, `Status: ${response.status}`, true);
  } catch (error) {
    logTest('Server Connectivity', false, error.message, true);
  }

  // Test 2: Gallery API with Authentic Data
  try {
    const response = await fetch('/api/gallery');
    const images = await response.json();
    const hasAuthenticData = Array.isArray(images) && images.length > 0;
    logTest('Gallery API', hasAuthenticData, `${images.length} authentic property images`, true);
    
    if (hasAuthenticData) {
      const sampleImage = images[0];
      const hasRequiredFields = sampleImage.id && sampleImage.title && sampleImage.imageUrl;
      logTest('Gallery Data Structure', hasRequiredFields, 'Images have required fields');
    }
  } catch (error) {
    logTest('Gallery API', false, error.message, true);
  }

  // Test 3: Room Data
  try {
    const response = await fetch('/api/rooms');
    const rooms = await response.json();
    logTest('Rooms API', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Rooms API', false, error.message);
  }

  // Test 4: Activities Data
  try {
    const response = await fetch('/api/activities');
    const activities = await response.json();
    logTest('Activities API', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Activities API', false, error.message);
  }

  // Test 5: Testimonials Data
  try {
    const response = await fetch('/api/testimonials');
    const testimonials = await response.json();
    logTest('Testimonials API', response.ok, `Status: ${response.status}`);
  } catch (error) {
    logTest('Testimonials API', false, error.message);
  }

  // Test 6: File Upload System
  try {
    const testFile = new File(['test'], 'test.jpg', { type: 'image/jpeg' });
    const formData = new FormData();
    formData.append('file', testFile);
    formData.append('category', 'test');
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    logTest('Upload System', response.status < 500, `Upload endpoint accessible: ${response.status}`);
  } catch (error) {
    logTest('Upload System', false, error.message);
  }

  // Test 7: Contact Form
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        message: 'Test message'
      })
    });
    
    logTest('Contact Form', response.status < 500, `Contact form: ${response.status}`);
  } catch (error) {
    logTest('Contact Form', false, error.message);
  }

  // Test 8: Newsletter Signup
  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com' })
    });
    
    logTest('Newsletter Signup', response.status < 500, `Newsletter: ${response.status}`);
  } catch (error) {
    logTest('Newsletter Signup', false, error.message);
  }

  // Test 9: Page Routes
  const routes = ['/', '/accommodations', '/gallery', '/activities', '/contact', '/about'];
  for (const route of routes) {
    try {
      const response = await fetch(route);
      logTest(`Route ${route}`, response.ok, `Status: ${response.status}`);
    } catch (error) {
      logTest(`Route ${route}`, false, error.message);
    }
  }

  // Test 10: Static Assets
  try {
    const response = await fetch('/uploads');
    logTest('Static Assets', response.status !== 404, `Uploads accessible: ${response.status}`);
  } catch (error) {
    logTest('Static Assets', false, error.message);
  }

  // Generate Final Report
  console.log('\n' + '='.repeat(50));
  console.log('📊 DEPLOYMENT TEST RESULTS');
  console.log('='.repeat(50));
  
  const total = results.passed + results.failed;
  const passRate = total > 0 ? ((results.passed / total) * 100).toFixed(1) : 0;
  
  console.log(`Tests Run: ${total}`);
  console.log(`Passed: ${results.passed}`);
  console.log(`Failed: ${results.failed}`);
  console.log(`Critical Failures: ${results.critical}`);
  console.log(`Pass Rate: ${passRate}%`);
  
  // Deployment Decision
  console.log('\n📋 DEPLOYMENT STATUS:');
  if (results.critical === 0 && passRate >= 90) {
    console.log('🟢 READY FOR DEPLOYMENT');
    console.log('All critical systems operational');
  } else if (results.critical === 0 && passRate >= 75) {
    console.log('🟡 DEPLOYMENT WITH CAUTION');
    console.log('Most systems working, minor issues present');
  } else {
    console.log('🔴 NOT READY FOR DEPLOYMENT');
    console.log('Critical issues must be resolved');
  }
  
  // Failed tests
  if (results.failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.tests
      .filter(test => !test.passed)
      .forEach(test => {
        console.log(`• ${test.name}: ${test.details}`);
      });
  }
  
  return results;
}

// Execute test
runProductionDeploymentTest();