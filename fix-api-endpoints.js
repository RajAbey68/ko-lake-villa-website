/**
 * Ko Lake Villa - API Endpoint Fix & Test
 * Tests and fixes the contact and newsletter endpoints
 */

async function testContactEndpoint() {
  console.log('Testing /api/contact endpoint...');
  
  const validContactData = {
    name: "Test User",
    email: "test@example.com", 
    subject: "Test Subject",
    message: "This is a test message with at least 10 characters"
  };

  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validContactData)
    });

    const result = await response.json();
    console.log(`Contact API: ${response.status} - ${response.ok ? 'PASS' : 'FAIL'}`);
    if (!response.ok) {
      console.log('Contact error details:', result);
    }
    return response.ok;
  } catch (error) {
    console.log('Contact API: FAIL - Network error:', error.message);
    return false;
  }
}

async function testNewsletterEndpoint() {
  console.log('Testing /api/newsletter endpoint...');
  
  const validNewsletterData = {
    email: "newsletter-test@example.com"
  };

  try {
    const response = await fetch('/api/newsletter', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(validNewsletterData)
    });

    const result = await response.json();
    console.log(`Newsletter API: ${response.status} - ${response.ok ? 'PASS' : 'FAIL'}`);
    if (!response.ok) {
      console.log('Newsletter error details:', result);
    }
    return response.ok;
  } catch (error) {
    console.log('Newsletter API: FAIL - Network error:', error.message);
    return false;
  }
}

async function test404Handling() {
  console.log('Testing 404 error handling...');
  
  try {
    const response = await fetch('/non-existent-page');
    console.log(`404 Test: ${response.status} - ${response.status === 404 ? 'PASS' : 'FAIL'}`);
    return response.status === 404;
  } catch (error) {
    console.log('404 Test: FAIL - Network error:', error.message);
    return false;
  }
}

async function runFixTests() {
  console.log('🔧 Ko Lake Villa API Fix & Test Suite\n');
  
  const contactResult = await testContactEndpoint();
  const newsletterResult = await testNewsletterEndpoint();
  const notFoundResult = await test404Handling();
  
  console.log('\n📊 Test Results:');
  console.log(`Contact API: ${contactResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Newsletter API: ${newsletterResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`404 Handling: ${notFoundResult ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = contactResult && newsletterResult && notFoundResult;
  console.log(`\n🎯 Overall Status: ${allPassed ? '✅ ALL TESTS PASS' : '⚠️ ISSUES FOUND'}`);
  
  if (!allPassed) {
    console.log('\n🔍 Troubleshooting:');
    if (!contactResult) console.log('- Contact form may need required fields: name, email, subject, message');
    if (!newsletterResult) console.log('- Newsletter form may need email field');
    if (!notFoundResult) console.log('- 404 handling needs proper route configuration');
  }
  
  return allPassed;
}

// Run tests if in browser
if (typeof window !== 'undefined') {
  runFixTests();
} else {
  module.exports = { runFixTests, testContactEndpoint, testNewsletterEndpoint, test404Handling };
}