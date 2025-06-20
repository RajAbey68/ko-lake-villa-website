
/**
 * Ko Lake Villa - Live Deployment Diagnosis
 * Identifies specific failures in live environment vs development
 */

async function diagnoseLiveDeployment() {
  console.log('🔍 Ko Lake Villa - Live Deployment Diagnosis\n');
  console.log('='.repeat(60));
  
  const issues = {
    critical: [],
    major: [],
    minor: [],
    environment: []
  };
  
  const baseUrl = window.location.origin;
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  
  function logTest(priority, testName, passed, details = '') {
    totalTests++;
    if (passed) {
      passedTests++;
      console.log(`✅ ${testName}: ${details}`);
    } else {
      failedTests++;
      console.log(`❌ ${testName}: ${details}`);
      issues[priority].push({
        test: testName,
        issue: details,
        timestamp: new Date().toISOString()
      });
    }
  }
  
  // Test 1: API Connectivity
  console.log('🔌 Testing API Endpoints...');
  try {
    const apiTests = [
      { endpoint: '/api/rooms', name: 'Rooms API' },
      { endpoint: '/api/gallery', name: 'Gallery API' },
      { endpoint: '/api/activities', name: 'Activities API' },
      { endpoint: '/api/testimonials', name: 'Testimonials API' }
    ];
    
    for (const test of apiTests) {
      try {
        const response = await fetch(`${baseUrl}${test.endpoint}`);
        const data = await response.json();
        
        if (response.ok && Array.isArray(data)) {
          logTest('minor', test.name, true, `${data.length} items loaded`);
        } else {
          logTest('critical', test.name, false, `Status: ${response.status}, Data: ${typeof data}`);
        }
      } catch (error) {
        logTest('critical', test.name, false, `Network error: ${error.message}`);
      }
    }
  } catch (error) {
    logTest('critical', 'API Testing', false, `API test suite failed: ${error.message}`);
  }
  
  // Test 2: Page Routing
  console.log('\n🛣️ Testing Page Routes...');
  const routes = [
    { path: '/', name: 'Homepage' },
    { path: '/accommodation', name: 'Accommodation' },
    { path: '/gallery', name: 'Gallery' },
    { path: '/contact', name: 'Contact' },
    { path: '/experiences', name: 'Experiences' },
    { path: '/admin', name: 'Admin Console' }
  ];
  
  for (const route of routes) {
    try {
      const response = await fetch(`${baseUrl}${route.path}`);
      const isAdmin = route.path === '/admin';
      const expectedSuccess = isAdmin ? (response.status === 200 || response.status === 401) : response.ok;
      
      logTest('major', route.name, expectedSuccess, 
        `Status: ${response.status} ${isAdmin && response.status === 401 ? '(Protected - OK)' : ''}`);
    } catch (error) {
      logTest('major', route.name, false, `Route error: ${error.message}`);
    }
  }
  
  // Test 3: Environment-Specific Issues
  console.log('\n🌐 Testing Environment Configuration...');
  
  // Check if running in production mode
  const isDev = baseUrl.includes('localhost') || baseUrl.includes('127.0.0.1');
  const isReplit = baseUrl.includes('replit');
  
  logTest('environment', 'Environment Detection', true, 
    `Environment: ${isDev ? 'Development' : isReplit ? 'Replit Production' : 'Unknown Production'}`);
  
  // Test static file serving
  try {
    const faviconResponse = await fetch(`${baseUrl}/favicon.ico`);
    logTest('minor', 'Static File Serving', faviconResponse.ok, 
      `Favicon status: ${faviconResponse.status}`);
  } catch (error) {
    logTest('minor', 'Static File Serving', false, `Static files error: ${error.message}`);
  }
  
  // Test 4: Database Connectivity through API
  console.log('\n🗄️ Testing Database Operations...');
  try {
    const galleryResponse = await fetch(`${baseUrl}/api/gallery`);
    if (galleryResponse.ok) {
      const galleryData = await galleryResponse.json();
      const hasImages = Array.isArray(galleryData) && galleryData.length > 0;
      
      logTest('critical', 'Database - Gallery', hasImages, 
        hasImages ? `${galleryData.length} images in database` : 'No images found');
      
      if (hasImages) {
        const firstImage = galleryData[0];
        const hasRequiredFields = firstImage.id && firstImage.imageUrl;
        logTest('major', 'Database Schema', hasRequiredFields, 
          hasRequiredFields ? 'Image schema valid' : 'Missing required fields');
      }
    } else {
      logTest('critical', 'Database - Gallery', false, `Gallery API failed: ${galleryResponse.status}`);
    }
  } catch (error) {
    logTest('critical', 'Database Connectivity', false, `Database error: ${error.message}`);
  }
  
  // Test 5: Upload System
  console.log('\n📁 Testing Upload System...');
  try {
    const testFormData = new FormData();
    testFormData.append('test', 'validation');
    
    const uploadResponse = await fetch(`${baseUrl}/api/upload`, {
      method: 'POST',
      body: testFormData
    });
    
    // 400 is expected for validation error, 200 for success
    const uploadWorking = uploadResponse.status === 400 || uploadResponse.status === 200;
    logTest('major', 'Upload Endpoint', uploadWorking, 
      `Upload validation status: ${uploadResponse.status}`);
  } catch (error) {
    logTest('major', 'Upload System', false, `Upload error: ${error.message}`);
  }
  
  // Test 6: Frontend Framework
  console.log('\n⚛️ Testing Frontend Framework...');
  
  // Check if React is loaded
  const hasReact = window.React !== undefined;
  logTest('major', 'React Framework', hasReact, hasReact ? 'React loaded' : 'React not detected');
  
  // Check for Vite dev indicators
  const hasViteDevIndicators = document.querySelector('script[type="module"]') !== null;
  logTest('environment', 'Build System', true, 
    hasViteDevIndicators ? 'Vite development mode' : 'Production build mode');
  
  // Test 7: Performance Metrics
  console.log('\n⚡ Testing Performance...');
  
  const startTime = performance.now();
  try {
    const testResponse = await fetch(`${baseUrl}/api/rooms`);
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    logTest('minor', 'API Response Time', responseTime < 2000, 
      `Response time: ${responseTime.toFixed(0)}ms`);
  } catch (error) {
    logTest('minor', 'Performance Test', false, `Performance test failed: ${error.message}`);
  }
  
  // Generate Report
  console.log('\n' + '='.repeat(60));
  console.log('📊 LIVE DEPLOYMENT DIAGNOSIS RESULTS');
  console.log('='.repeat(60));
  
  console.log(`Total Tests: ${totalTests}`);
  console.log(`✅ Passed: ${passedTests}`);
  console.log(`❌ Failed: ${failedTests}`);
  console.log(`📈 Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
  
  // Critical Issues
  if (issues.critical.length > 0) {
    console.log('\n🚨 CRITICAL ISSUES (Must Fix):');
    issues.critical.forEach(issue => {
      console.log(`   • ${issue.test}: ${issue.issue}`);
    });
  }
  
  // Major Issues
  if (issues.major.length > 0) {
    console.log('\n⚠️ MAJOR ISSUES (Should Fix):');
    issues.major.forEach(issue => {
      console.log(`   • ${issue.test}: ${issue.issue}`);
    });
  }
  
  // Environment Info
  if (issues.environment.length > 0) {
    console.log('\n🌐 ENVIRONMENT INFO:');
    issues.environment.forEach(issue => {
      console.log(`   • ${issue.test}: ${issue.issue}`);
    });
  }
  
  // Recommendations
  console.log('\n🔧 RECOMMENDED ACTIONS:');
  
  if (issues.critical.length > 0) {
    console.log('1. 🚨 Fix critical API/database issues first');
    console.log('2. 🔄 Restart the application server');
    console.log('3. 🧪 Re-run this diagnostic test');
  } else if (issues.major.length > 0) {
    console.log('1. ⚠️ Address major routing/functionality issues');
    console.log('2. 📊 Monitor application performance');
    console.log('3. 🔍 Check server logs for detailed errors');
  } else {
    console.log('1. ✅ System appears to be working correctly');
    console.log('2. 📈 Monitor performance and error rates');
    console.log('3. 🎯 Consider optimizations for better performance');
  }
  
  // Environment-specific advice
  if (isDev) {
    console.log('\n💡 DEVELOPMENT ENVIRONMENT DETECTED:');
    console.log('   • Switch to production build for live deployment');
    console.log('   • Run: npm run build && npm run start');
  } else if (isReplit) {
    console.log('\n💡 REPLIT DEPLOYMENT DETECTED:');
    console.log('   • Use the Deploy button for production hosting');
    console.log('   • Configure run command in deployment settings');
  }
  
  return {
    totalTests,
    passedTests,
    failedTests,
    successRate: ((passedTests / totalTests) * 100).toFixed(1),
    issues,
    isProduction: !isDev,
    platform: isDev ? 'development' : isReplit ? 'replit' : 'unknown'
  };
}

// Make available globally
window.diagnoseLiveDeployment = diagnoseLiveDeployment;

// Auto-run if in browser console
if (typeof window !== 'undefined') {
  console.log('🔍 Ko Lake Villa Live Deployment Diagnostics Loaded');
  console.log('Run: diagnoseLiveDeployment() - to diagnose current issues');
}
