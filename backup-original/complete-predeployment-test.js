/**
 * Ko Lake Villa - Complete Pre-Deployment Test Suite
 * Comprehensive validation of all systems before production deployment
 */

class PreDeploymentTests {
  constructor() {
    this.results = {
      critical: { passed: 0, failed: 0, tests: [] },
      high: { passed: 0, failed: 0, tests: [] },
      medium: { passed: 0, failed: 0, tests: [] },
      low: { passed: 0, failed: 0, tests: [] }
    };
    this.baseUrl = window.location.origin;
  }

  async apiRequest(endpoint, method = 'GET', body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      return {
        ok: response.ok,
        status: response.status,
        data: await response.json().catch(() => null),
        headers: Object.fromEntries(response.headers.entries())
      };
    } catch (error) {
      return {
        ok: false,
        status: 0,
        error: error.message
      };
    }
  }

  logTest(priority, testName, passed, details = '') {
    const result = { testName, passed, details, timestamp: new Date().toISOString() };
    this.results[priority].tests.push(result);
    
    if (passed) {
      this.results[priority].passed++;
      console.log(`✅ [${priority.toUpperCase()}] ${testName}: PASS - ${details}`);
    } else {
      this.results[priority].failed++;
      console.log(`❌ [${priority.toUpperCase()}] ${testName}: FAIL - ${details}`);
    }
  }

  async testCriticalAPIs() {
    console.log('🔍 Testing Critical API Endpoints...');
    
    const criticalAPIs = [
      { endpoint: '/api/content', name: 'Content API' },
      { endpoint: '/api/pricing', name: 'Pricing API' },
      { endpoint: '/api/admin/pricing', name: 'Admin Pricing API' },
      { endpoint: '/api/gallery', name: 'Gallery API' },
      { endpoint: '/api/rooms', name: 'Rooms API' },
      { endpoint: '/api/testimonials', name: 'Testimonials API' },
      { endpoint: '/api/activities', name: 'Activities API' },
      { endpoint: '/api/status', name: 'Health Check API' }
    ];

    for (const api of criticalAPIs) {
      const result = await this.apiRequest(api.endpoint);
      if (result.ok) {
        this.logTest('critical', api.name, true, `Status ${result.status}`);
      } else {
        this.logTest('critical', api.name, false, `Status ${result.status} - ${result.error || 'Not accessible'}`);
      }
    }
  }

  async testFormSubmissions() {
    console.log('🔍 Testing Form Submissions...');
    
    // Contact form test
    const contactData = {
      name: 'Test User',
      email: 'test@example.com',
      subject: 'Pre-deployment Test',
      message: 'This is a comprehensive test message to verify form validation and submission functionality works correctly.',
      messageType: 'message'
    };

    const contactResult = await this.apiRequest('/api/contact', 'POST', contactData);
    if (contactResult.ok) {
      this.logTest('critical', 'Contact Form Submission', true, `Status ${contactResult.status} - Form accepts all fields including messageType`);
    } else {
      this.logTest('critical', 'Contact Form Submission', false, `Status ${contactResult.status} - ${contactResult.data?.message || 'Validation failed'}`);
    }

    // Newsletter subscription test
    const newsletterData = {
      email: `predeployment-test-${Date.now()}@example.com`
    };

    const newsletterResult = await this.apiRequest('/api/newsletter', 'POST', newsletterData);
    if (newsletterResult.ok) {
      this.logTest('high', 'Newsletter Subscription', true, `Status ${newsletterResult.status}`);
    } else {
      this.logTest('high', 'Newsletter Subscription', false, `Status ${newsletterResult.status} - ${newsletterResult.data?.message || 'Subscription failed'}`);
    }

    // Booking inquiry test
    const bookingData = {
      name: 'Test Guest',
      email: 'booking-test@example.com',
      checkInDate: '2025-07-01',
      checkOutDate: '2025-07-05',
      guests: 2,
      roomType: 'KLV1',
      specialRequests: 'Pre-deployment test booking'
    };

    const bookingResult = await this.apiRequest('/api/booking', 'POST', bookingData);
    if (bookingResult.ok) {
      this.logTest('high', 'Booking Form Submission', true, `Status ${bookingResult.status}`);
    } else {
      this.logTest('high', 'Booking Form Submission', false, `Status ${bookingResult.status} - ${bookingResult.data?.message || 'Booking failed'}`);
    }
  }

  async testPageRouting() {
    console.log('🔍 Testing Page Routing...');
    
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/accommodation', name: 'Accommodation Page' },
      { path: '/gallery', name: 'Gallery Page' },
      { path: '/contact', name: 'Contact Page' },
      { path: '/booking', name: 'Booking Page' },
      { path: '/experiences', name: 'Experiences Page' },
      { path: '/dining', name: 'Dining Page' }
    ];

    for (const page of pages) {
      try {
        const response = await fetch(`${this.baseUrl}${page.path}`);
        if (response.ok) {
          this.logTest('high', page.name, true, `Status ${response.status}`);
        } else {
          this.logTest('high', page.name, false, `Status ${response.status}`);
        }
      } catch (error) {
        this.logTest('high', page.name, false, `Error: ${error.message}`);
      }
    }
  }

  async testAdminRoutes() {
    console.log('🔍 Testing Admin Routes...');
    
    const adminRoutes = [
      { path: '/admin', name: 'Admin Landing' },
      { path: '/admin/login', name: 'Admin Login' },
      { path: '/admin/dashboard', name: 'Admin Dashboard' },
      { path: '/admin/gallery', name: 'Gallery Manager' }
    ];

    for (const route of adminRoutes) {
      try {
        const response = await fetch(`${this.baseUrl}${route.path}`);
        if (response.ok) {
          this.logTest('medium', route.name, true, `Status ${response.status}`);
        } else {
          this.logTest('medium', route.name, false, `Status ${response.status}`);
        }
      } catch (error) {
        this.logTest('medium', route.name, false, `Error: ${error.message}`);
      }
    }
  }

  async testErrorHandling() {
    console.log('🔍 Testing Error Handling...');
    
    // Test 404 handling
    try {
      const response = await fetch(`${this.baseUrl}/non-existent-page-${Date.now()}`);
      if (response.status === 404) {
        this.logTest('medium', '404 Error Handling', true, 'Proper 404 status returned');
      } else {
        this.logTest('medium', '404 Error Handling', false, `Expected 404, got ${response.status}`);
      }
    } catch (error) {
      this.logTest('medium', '404 Error Handling', false, `Error: ${error.message}`);
    }

    // Test API 404 handling
    const apiResult = await this.apiRequest('/api/non-existent-endpoint');
    if (apiResult.status === 404) {
      this.logTest('medium', 'API 404 Handling', true, 'API returns proper 404 for non-existent endpoints');
    } else {
      this.logTest('medium', 'API 404 Handling', false, `Expected 404, got ${apiResult.status}`);
    }
  }

  async testDatabaseConnectivity() {
    console.log('🔍 Testing Database Connectivity...');
    
    const dbTests = [
      { endpoint: '/api/rooms', operation: 'Rooms Query' },
      { endpoint: '/api/testimonials', operation: 'Testimonials Query' },
      { endpoint: '/api/activities', operation: 'Activities Query' }
    ];

    for (const test of dbTests) {
      const result = await this.apiRequest(test.endpoint);
      if (result.ok && Array.isArray(result.data)) {
        this.logTest('critical', test.operation, true, `Database accessible, returns ${result.data.length} records`);
      } else if (result.ok) {
        this.logTest('medium', test.operation, false, 'Database accessible but returns invalid format');
      } else {
        this.logTest('critical', test.operation, false, `Database connection failed: ${result.status}`);
      }
    }
  }

  async testSecurityHeaders() {
    console.log('🔍 Testing Security Headers...');
    
    const response = await fetch(`${this.baseUrl}/`);
    const headers = Object.fromEntries(response.headers.entries());
    
    // Check for security headers
    if (headers['x-content-type-options']) {
      this.logTest('low', 'X-Content-Type-Options Header', true, 'Security header present');
    } else {
      this.logTest('low', 'X-Content-Type-Options Header', false, 'Missing security header');
    }

    if (headers['x-frame-options'] || headers['content-security-policy']) {
      this.logTest('low', 'Clickjacking Protection', true, 'Frame protection headers present');
    } else {
      this.logTest('low', 'Clickjacking Protection', false, 'Missing frame protection');
    }
  }

  async testPerformance() {
    console.log('🔍 Testing Performance...');
    
    const startTime = performance.now();
    
    // Test page load time
    await fetch(`${this.baseUrl}/`);
    const loadTime = performance.now() - startTime;
    
    if (loadTime < 2000) {
      this.logTest('medium', 'Page Load Performance', true, `Load time: ${loadTime.toFixed(2)}ms`);
    } else if (loadTime < 5000) {
      this.logTest('medium', 'Page Load Performance', false, `Slow load time: ${loadTime.toFixed(2)}ms`);
    } else {
      this.logTest('high', 'Page Load Performance', false, `Very slow load time: ${loadTime.toFixed(2)}ms`);
    }

    // Test API response time
    const apiStartTime = performance.now();
    await this.apiRequest('/api/rooms');
    const apiTime = performance.now() - apiStartTime;
    
    if (apiTime < 1000) {
      this.logTest('low', 'API Response Time', true, `Response time: ${apiTime.toFixed(2)}ms`);
    } else {
      this.logTest('low', 'API Response Time', false, `Slow API response: ${apiTime.toFixed(2)}ms`);
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Complete Pre-Deployment Tests...\n');
    
    await this.testCriticalAPIs();
    await this.testFormSubmissions();
    await this.testPageRouting();
    await this.testAdminRoutes();
    await this.testErrorHandling();
    await this.testDatabaseConnectivity();
    await this.testSecurityHeaders();
    await this.testPerformance();
    
    this.generateDeploymentReport();
  }

  generateDeploymentReport() {
    console.log('\n📊 PRE-DEPLOYMENT TEST REPORT');
    console.log('==========================================');
    
    const priorities = ['critical', 'high', 'medium', 'low'];
    let totalPassed = 0;
    let totalFailed = 0;
    let criticalIssues = 0;
    
    priorities.forEach(priority => {
      const results = this.results[priority];
      totalPassed += results.passed;
      totalFailed += results.failed;
      
      if (priority === 'critical') {
        criticalIssues = results.failed;
      }
      
      const icon = priority === 'critical' ? '🚨' : 
                   priority === 'high' ? '⚠️' : 
                   priority === 'medium' ? '⚡' : '💡';
      
      console.log(`${icon} ${priority.toUpperCase()}: ${results.passed} passed, ${results.failed} failed`);
      
      if (results.failed > 0) {
        const failedTests = results.tests.filter(t => !t.passed);
        failedTests.forEach(test => {
          console.log(`   ❌ ${test.testName}: ${test.details}`);
        });
      }
    });

    console.log('\n📋 SUMMARY:');
    console.log(`   ✅ Total Passed: ${totalPassed}`);
    console.log(`   ❌ Total Failed: ${totalFailed}`);
    console.log(`   📊 Success Rate: ${((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)}%`);
    
    console.log('\n🎯 DEPLOYMENT DECISION:');
    if (criticalIssues === 0 && totalFailed <= 3) {
      console.log('   ✅ READY FOR DEPLOYMENT');
      console.log('   🚀 All critical systems operational');
      console.log('   📈 Minor issues can be addressed post-deployment');
    } else if (criticalIssues === 0) {
      console.log('   ⚠️ CONDITIONAL DEPLOYMENT');
      console.log('   🔧 Address high-priority issues if possible');
      console.log('   📋 Monitor closely after deployment');
    } else {
      console.log('   ❌ DEPLOYMENT NOT RECOMMENDED');
      console.log('   🚨 Critical issues must be resolved first');
      console.log('   🛠️ Fix critical failures before proceeding');
    }

    console.log('\n🔗 Next Steps:');
    if (criticalIssues === 0) {
      console.log('   1. ✅ Deploy to production environment');
      console.log('   2. 📊 Monitor error logs and performance');
      console.log('   3. 🔄 Run post-deployment validation');
    } else {
      console.log('   1. 🛠️ Fix critical issues identified above');
      console.log('   2. 🔄 Re-run pre-deployment tests');
      console.log('   3. ✅ Deploy when all critical tests pass');
    }

    return {
      ready: criticalIssues === 0,
      criticalIssues,
      totalFailed,
      successRate: ((totalPassed / (totalPassed + totalFailed)) * 100).toFixed(1)
    };
  }
}

// Auto-run tests
async function runPreDeploymentTests() {
  const testSuite = new PreDeploymentTests();
  await testSuite.runAllTests();
  return testSuite.results;
}

// Execute if in browser
if (typeof window !== 'undefined') {
  console.log('Ko Lake Villa - Pre-Deployment Test Suite');
  console.log('=========================================');
  runPreDeploymentTests();
}

// Export for Node.js
if (typeof module !== 'undefined') {
  module.exports = { runPreDeploymentTests, PreDeploymentTests };
}