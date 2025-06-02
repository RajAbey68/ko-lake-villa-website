
/**
 * Quick Ko Lake Villa Deployment Test
 * Run this to verify your deployment is working
 */

async function testDeployment() {
  console.log('🧪 Testing Ko Lake Villa Deployment...\n');
  
  const baseUrl = window.location.origin;
  const tests = [];
  
  // Test essential endpoints
  const endpoints = [
    '/',
    '/api/rooms',
    '/api/gallery', 
    '/api/testimonials',
    '/health'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      const passed = response.ok;
      tests.push({
        endpoint,
        status: response.status,
        passed
      });
      console.log(`${passed ? '✅' : '❌'} ${endpoint}: ${response.status}`);
    } catch (error) {
      tests.push({
        endpoint,
        status: 'ERROR',
        passed: false,
        error: error.message
      });
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
  
  const passed = tests.filter(t => t.passed).length;
  const total = tests.length;
  
  console.log(`\n📊 Results: ${passed}/${total} tests passed`);
  
  if (passed === total) {
    console.log('🎉 Deployment successful! Ko Lake Villa is live.');
  } else {
    console.log('🔧 Some issues found. Check the failed endpoints above.');
  }
  
  return tests;
}

// Run the test
testDeployment();
