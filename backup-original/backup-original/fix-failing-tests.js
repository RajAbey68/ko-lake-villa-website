/**
 * Fix Failing Tests - Address authentication and API validation issues
 */

async function fixFailingTests() {
  console.log('🔧 Fixing failing deployment tests');
  
  const baseUrl = 'http://localhost:5000';
  
  // Test 1: Fix contact API validation
  console.log('\n1. Testing contact API with valid data...');
  try {
    const contactResponse = await fetch(`${baseUrl}/api/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        phone: '+94123456789',
        message: 'Test inquiry for Ko Lake Villa',
        subject: 'Test Contact'
      })
    });
    
    console.log(`Contact API: ${contactResponse.status} - ${contactResponse.ok ? 'PASS' : 'FAIL'}`);
    if (!contactResponse.ok) {
      const error = await contactResponse.text();
      console.log(`Contact error details: ${error}`);
    }
  } catch (error) {
    console.log(`Contact API error: ${error.message}`);
  }
  
  // Test 2: Fix newsletter API validation
  console.log('\n2. Testing newsletter API with valid data...');
  try {
    const newsletterResponse = await fetch(`${baseUrl}/api/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        name: 'Test Subscriber'
      })
    });
    
    console.log(`Newsletter API: ${newsletterResponse.status} - ${newsletterResponse.ok ? 'PASS' : 'FAIL'}`);
    if (!newsletterResponse.ok) {
      const error = await newsletterResponse.text();
      console.log(`Newsletter error details: ${error}`);
    }
  } catch (error) {
    console.log(`Newsletter API error: ${error.message}`);
  }
  
  // Test 3: Check 404 handling
  console.log('\n3. Testing 404 error handling...');
  try {
    const notFoundResponse = await fetch(`${baseUrl}/nonexistent-page-test-404`);
    console.log(`404 test: ${notFoundResponse.status} - Expected 404, got ${notFoundResponse.status}`);
    
    if (notFoundResponse.status === 404) {
      console.log('✅ 404 handling works correctly');
    } else {
      console.log('❌ 404 handling needs fixing - returns 200 instead of 404');
    }
  } catch (error) {
    console.log(`404 test error: ${error.message}`);
  }
  
  // Test 4: Check admin routes accessibility (they should redirect to login, not 404)
  console.log('\n4. Testing admin routes (should redirect, not 404)...');
  const adminRoutes = [
    '/admin',
    '/admin/login', 
    '/admin/dashboard',
    '/admin/content',
    '/admin/gallery'
  ];
  
  for (const route of adminRoutes) {
    try {
      const response = await fetch(`${baseUrl}${route}`, {
        redirect: 'manual' // Don't follow redirects automatically
      });
      
      if (route === '/admin/login') {
        console.log(`${route}: ${response.status} - ${response.status === 200 ? 'PASS' : 'FAIL'} (login page should be accessible)`);
      } else {
        console.log(`${route}: ${response.status} - ${response.status !== 404 ? 'PASS' : 'FAIL'} (should redirect or show content, not 404)`);
      }
    } catch (error) {
      console.log(`${route}: ERROR - ${error.message}`);
    }
  }
  
  console.log('\n📊 Test analysis complete');
}

fixFailingTests();