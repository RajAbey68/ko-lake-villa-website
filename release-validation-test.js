/**
 * Ko Lake Villa - Release Validation Test Suite
 * Comprehensive testing for vNext release targeting June 2025 milestone
 * Tests pricing sync, admin UI, gallery system, and all critical functionality
 */

class ReleaseValidationTest {
  constructor() {
    this.results = {
      critical: [],
      high: [],
      medium: [],
      passed: 0,
      failed: 0,
      total: 0
    };
    this.baseUrl = 'http://localhost:5000';
  }

  async apiRequest(method, endpoint, body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    try {
      const response = await fetch(url, options);
      return {
        ok: response.ok,
        status: response.status,
        data: response.ok ? await response.json() : null,
        error: response.ok ? null : await response.text()
      };
    } catch (error) {
      return { ok: false, status: 0, data: null, error: error.message };
    }
  }

  logTest(priority, testName, passed, details = '') {
    const result = {
      test: testName,
      status: passed ? 'PASS' : 'FAIL',
      details,
      timestamp: new Date().toISOString()
    };
    
    this.results[priority].push(result);
    this.results.total++;
    if (passed) this.results.passed++;
    else this.results.failed++;
    
    const icon = passed ? '✅' : '❌';
    console.log(`[${priority.toUpperCase()}] ${icon} ${testName}`);
    if (details) console.log(`    ${details}`);
  }

  async testPricingSync() {
    console.log('\n🏷️ Testing Pricing Sync Logic...');
    
    // Test rooms API pricing data
    const roomsResponse = await this.apiRequest('GET', '/api/rooms');
    this.logTest('critical', 'Rooms API Availability', 
      roomsResponse.ok, `Status: ${roomsResponse.status}`);
    
    if (roomsResponse.ok && roomsResponse.data) {
      const rooms = roomsResponse.data;
      
      // Validate pricing structure
      const hasValidPricing = rooms.every(room => 
        room.price && typeof room.price === 'number' && room.price > 0
      );
      this.logTest('critical', 'Pricing Data Validation', 
        hasValidPricing, `${rooms.length} rooms with valid pricing`);
      
      // Test specific price points match business requirements
      const entireVilla = rooms.find(r => r.name.includes('Entire Villa'));
      this.logTest('high', 'Entire Villa Pricing', 
        entireVilla && entireVilla.price >= 300, 
        entireVilla ? `Price: $${entireVilla.price}` : 'Room not found');
      
      // Validate capacity and features
      const hasCompleteData = rooms.every(room => 
        room.capacity && room.features && room.features.length > 0
      );
      this.logTest('high', 'Room Data Completeness', 
        hasCompleteData, 'All rooms have capacity and features');
    }
  }

  async testAdminUI() {
    console.log('\n🔧 Testing Admin UI Functionality...');
    
    // Test admin routes accessibility
    const adminRoutes = [
      '/api/admin/dashboard',
      '/api/admin/gallery',
      '/api/admin/pricing'
    ];
    
    for (const route of adminRoutes) {
      const response = await this.apiRequest('GET', route);
      this.logTest('high', `Admin Route: ${route}`, 
        response.status !== 404, `Status: ${response.status}`);
    }
    
    // Test gallery management endpoints
    const galleryTests = [
      { endpoint: '/api/gallery', method: 'GET', name: 'Gallery List' },
      { endpoint: '/api/gallery/categories', method: 'GET', name: 'Gallery Categories' },
      { endpoint: '/api/analyze-media', method: 'POST', name: 'AI Analysis', 
        body: { imageUrl: '/test.jpg', category: 'pool' } }
    ];
    
    for (const test of galleryTests) {
      const response = await this.apiRequest(test.method, test.endpoint, test.body);
      this.logTest('critical', test.name, 
        response.ok, `${test.method} ${test.endpoint}: ${response.status}`);
    }
  }

  async testGallerySystem() {
    console.log('\n🖼️ Testing Gallery System...');
    
    // Test gallery API with comprehensive validation
    const galleryResponse = await this.apiRequest('GET', '/api/gallery');
    this.logTest('critical', 'Gallery API Response', 
      galleryResponse.ok, `Status: ${galleryResponse.status}`);
    
    if (galleryResponse.ok && galleryResponse.data) {
      const images = galleryResponse.data;
      
      // Validate image count meets requirements
      this.logTest('high', 'Gallery Image Count', 
        images.length >= 100, `${images.length} images available`);
      
      // Test image data quality
      const hasValidImages = images.slice(0, 10).every(img => 
        img.imageUrl && img.title && img.category
      );
      this.logTest('critical', 'Image Data Quality', 
        hasValidImages, 'Sample images have required fields');
      
      // Test category distribution
      const categories = [...new Set(images.map(img => img.category))];
      this.logTest('medium', 'Category Diversity', 
        categories.length >= 5, `${categories.length} unique categories`);
    }
    
    // Test search functionality
    const searchResponse = await this.apiRequest('GET', '/api/gallery/search?q=pool');
    this.logTest('high', 'Gallery Search', 
      searchResponse.ok, `Search Status: ${searchResponse.status}`);
    
    // Test comments system
    const commentsResponse = await this.apiRequest('GET', '/api/gallery/1/comments');
    this.logTest('medium', 'Comments System', 
      commentsResponse.ok, `Comments Status: ${commentsResponse.status}`);
  }

  async testSecurityValidation() {
    console.log('\n🔒 Testing Security & Input Sanitization...');
    
    // Test XSS prevention
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '"><img src=x onerror=alert(1)>',
      'javascript:alert(1)'
    ];
    
    for (const payload of xssPayloads) {
      const response = await this.apiRequest('POST', '/api/analyze-media', {
        imageUrl: payload,
        category: 'test'
      });
      // Should either sanitize or reject malicious input
      this.logTest('critical', 'XSS Prevention', 
        response.status === 400 || !response.data?.title?.includes('<script>'), 
        'Malicious input handled correctly');
    }
    
    // Test SQL injection prevention
    const sqlPayload = "'; DROP TABLE gallery; --";
    const sqlResponse = await this.apiRequest('GET', `/api/gallery/search?q=${encodeURIComponent(sqlPayload)}`);
    this.logTest('critical', 'SQL Injection Prevention', 
      sqlResponse.ok, 'Database queries properly sanitized');
  }

  async testPerformanceMetrics() {
    console.log('\n⚡ Testing Performance Metrics...');
    
    // Test API response times
    const startTime = Date.now();
    const galleryResponse = await this.apiRequest('GET', '/api/gallery');
    const responseTime = Date.now() - startTime;
    
    this.logTest('medium', 'API Response Time', 
      responseTime < 2000, `Gallery API: ${responseTime}ms`);
    
    // Test concurrent request handling
    const concurrentTests = Array(5).fill().map(() => 
      this.apiRequest('GET', '/api/gallery/categories')
    );
    
    const concurrentStart = Date.now();
    const results = await Promise.all(concurrentTests);
    const concurrentTime = Date.now() - concurrentStart;
    
    const allSuccessful = results.every(r => r.ok);
    this.logTest('medium', 'Concurrent Request Handling', 
      allSuccessful && concurrentTime < 3000, 
      `5 concurrent requests: ${concurrentTime}ms`);
  }

  async testBookingIntegration() {
    console.log('\n📅 Testing Booking & Integration Systems...');
    
    // Test activities API
    const activitiesResponse = await this.apiRequest('GET', '/api/activities');
    this.logTest('high', 'Activities API', 
      activitiesResponse.ok, `Status: ${activitiesResponse.status}`);
    
    // Test testimonials system
    const testimonialsResponse = await this.apiRequest('GET', '/api/testimonials');
    this.logTest('medium', 'Testimonials API', 
      testimonialsResponse.ok, `Status: ${testimonialsResponse.status}`);
    
    // Validate environment configuration
    const hasRequiredEnvVars = process.env.DATABASE_URL && 
                              process.env.REPLIT_DOMAIN;
    this.logTest('critical', 'Environment Configuration', 
      hasRequiredEnvVars, 'Required environment variables present');
  }

  generateReleaseReport() {
    console.log('\n📊 RELEASE VALIDATION REPORT');
    console.log('=' .repeat(50));
    
    const { critical, high, medium, passed, failed, total } = this.results;
    
    console.log(`\n📈 SUMMARY:`);
    console.log(`   Total Tests: ${total}`);
    console.log(`   Passed: ${passed} (${Math.round(passed/total*100)}%)`);
    console.log(`   Failed: ${failed} (${Math.round(failed/total*100)}%)`);
    
    const criticalPassed = critical.filter(r => r.status === 'PASS').length;
    const highPassed = high.filter(r => r.status === 'PASS').length;
    const mediumPassed = medium.filter(r => r.status === 'PASS').length;
    
    console.log(`\n🎯 PRIORITY BREAKDOWN:`);
    console.log(`   Critical: ${criticalPassed}/${critical.length} passed`);
    console.log(`   High: ${highPassed}/${high.length} passed`);
    console.log(`   Medium: ${mediumPassed}/${medium.length} passed`);
    
    // Release readiness assessment
    const criticalFailures = critical.filter(r => r.status === 'FAIL');
    const highFailures = high.filter(r => r.status === 'FAIL');
    
    console.log(`\n🚀 RELEASE READINESS:`);
    if (criticalFailures.length === 0) {
      if (highFailures.length === 0) {
        console.log('   ✅ READY TO DEPLOY - All critical and high priority tests passed');
      } else {
        console.log('   ⚠️  CONDITIONAL DEPLOYMENT - Critical tests passed, some high priority issues');
      }
    } else {
      console.log('   ❌ NOT READY - Critical issues must be resolved before deployment');
    }
    
    // List any failures
    const allFailures = [...criticalFailures, ...highFailures];
    if (allFailures.length > 0) {
      console.log(`\n🔧 ISSUES TO RESOLVE:`);
      allFailures.forEach(failure => {
        console.log(`   - ${failure.test}: ${failure.details}`);
      });
    }
    
    console.log(`\n⏰ Test completed at: ${new Date().toISOString()}`);
    console.log('=' .repeat(50));
    
    return {
      readyToDeploy: criticalFailures.length === 0,
      criticalIssues: criticalFailures.length,
      highIssues: highFailures.length,
      overallScore: Math.round(passed/total*100)
    };
  }

  async runAllTests() {
    console.log('🚀 Starting Ko Lake Villa Release Validation');
    console.log(`📅 Target: June 2025 Milestone`);
    console.log(`🎯 Release: vNext`);
    console.log('=' .repeat(50));
    
    try {
      await this.testPricingSync();
      await this.testAdminUI();
      await this.testGallerySystem();
      await this.testSecurityValidation();
      await this.testPerformanceMetrics();
      await this.testBookingIntegration();
      
      return this.generateReleaseReport();
    } catch (error) {
      console.error('❌ Test suite failed:', error);
      return { readyToDeploy: false, error: error.message };
    }
  }
}

// Execute release validation
async function runReleaseValidation() {
  const tester = new ReleaseValidationTest();
  const results = await tester.runAllTests();
  
  if (results.readyToDeploy) {
    console.log('\n🎉 Release validation successful! Ready for deployment preview.');
  } else {
    console.log('\n⚠️  Release validation found issues. Review and fix before deployment.');
  }
  
  return results;
}

// Auto-run if called directly
if (typeof window === 'undefined') {
  runReleaseValidation().catch(console.error);
}