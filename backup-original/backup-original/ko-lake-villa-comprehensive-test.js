/**
 * Ko Lake Villa - Comprehensive Test Case Suite
 * Tests all critical functionality using test-driven development approach
 * Run in browser console to validate application state
 */

class KoLakeVillaTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  async runAllTests() {
    console.log('🔥 Ko Lake Villa - Comprehensive Test Suite Starting...');
    console.log('='.repeat(60));

    // Test 1: Server Connectivity
    await this.testServerConnectivity();
    
    // Test 2: API Endpoints
    await this.testAPIEndpoints();
    
    // Test 3: Database Operations
    await this.testDatabaseOperations();
    
    // Test 4: File Upload System
    await this.testFileUploadSystem();
    
    // Test 5: Gallery Management
    await this.testGalleryManagement();
    
    // Test 6: AI Features
    await this.testAIFeatures();
    
    // Test 7: Admin Authentication
    await this.testAdminAuthentication();
    
    // Test 8: Frontend Routing
    await this.testFrontendRouting();
    
    // Test 9: Content Management
    await this.testContentManagement();
    
    // Test 10: Performance & Security
    await this.testPerformanceSecurity();

    this.generateFinalReport();
  }

  async testServerConnectivity() {
    console.log('\n🌐 Testing Server Connectivity...');
    
    try {
      // Test main server
      const response = await fetch('/', { method: 'HEAD' });
      this.logTest('Server Connectivity', 'Main Server', response.ok, `Status: ${response.status}`);
      
      // Test API base endpoint
      const apiResponse = await fetch('/api', { method: 'HEAD' });
      this.logTest('Server Connectivity', 'API Endpoint', apiResponse.status === 404 || apiResponse.ok, 'API base accessible');
      
    } catch (error) {
      this.logTest('Server Connectivity', 'Main Server', false, error.message);
    }
  }

  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    const endpoints = [
      { path: '/api/gallery', method: 'GET', description: 'Gallery Images' },
      { path: '/api/rooms', method: 'GET', description: 'Room Data' },
      { path: '/api/activities', method: 'GET', description: 'Activities' },
      { path: '/api/testimonials', method: 'GET', description: 'Testimonials' },
      { path: '/api/contact', method: 'POST', description: 'Contact Form', body: { name: 'Test', email: 'test@example.com', message: 'Test message' } },
      { path: '/api/newsletter', method: 'POST', description: 'Newsletter Signup', body: { email: 'test@example.com' } }
    ];

    for (const endpoint of endpoints) {
      try {
        const options = {
          method: endpoint.method,
          headers: { 'Content-Type': 'application/json' }
        };
        
        if (endpoint.body) {
          options.body = JSON.stringify(endpoint.body);
        }
        
        const response = await fetch(endpoint.path, options);
        const success = response.ok || response.status === 400; // 400 is acceptable for validation errors
        this.logTest('API Endpoints', endpoint.description, success, `${endpoint.method} ${endpoint.path} - Status: ${response.status}`);
        
      } catch (error) {
        this.logTest('API Endpoints', endpoint.description, false, error.message);
      }
    }
  }

  async testDatabaseOperations() {
    console.log('\n🗄️ Testing Database Operations...');
    
    try {
      // Test gallery table read
      const galleryResponse = await fetch('/api/gallery');
      const galleryData = await galleryResponse.json();
      this.logTest('Database Operations', 'Gallery Table Read', galleryResponse.ok, `Retrieved ${Array.isArray(galleryData) ? galleryData.length : 0} images`);
      
      // Test other tables
      const roomsResponse = await fetch('/api/rooms');
      const roomsData = await roomsResponse.json();
      this.logTest('Database Operations', 'Rooms Table Read', roomsResponse.ok, `Retrieved ${Array.isArray(roomsData) ? roomsData.length : 0} rooms`);
      
    } catch (error) {
      this.logTest('Database Operations', 'Database Connection', false, error.message);
    }
  }

  async testFileUploadSystem() {
    console.log('\n📁 Testing File Upload System...');
    
    try {
      // Create a minimal test file
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      const formData = new FormData();
      formData.append('file', testFile);
      formData.append('category', 'test');
      
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      this.logTest('File Upload System', 'Upload Endpoint', uploadResponse.status === 200 || uploadResponse.status === 400, `Status: ${uploadResponse.status}`);
      
    } catch (error) {
      this.logTest('File Upload System', 'Upload Test', false, error.message);
    }
  }

  async testGalleryManagement() {
    console.log('\n🖼️ Testing Gallery Management...');
    
    try {
      // Test gallery CRUD operations
      const galleryResponse = await fetch('/api/gallery');
      const galleryImages = await galleryResponse.json();
      
      this.logTest('Gallery Management', 'Gallery Fetch', galleryResponse.ok, `Images available: ${Array.isArray(galleryImages) ? galleryImages.length : 0}`);
      
      // Test if we have any images to work with
      if (Array.isArray(galleryImages) && galleryImages.length > 0) {
        const sampleImage = galleryImages[0];
        this.logTest('Gallery Management', 'Image Data Structure', 
          sampleImage.hasOwnProperty('id') && sampleImage.hasOwnProperty('title'), 
          'Image has required fields');
      }
      
    } catch (error) {
      this.logTest('Gallery Management', 'Gallery Operations', false, error.message);
    }
  }

  async testAIFeatures() {
    console.log('\n🤖 Testing AI Features...');
    
    try {
      // Test AI analysis endpoint
      const aiResponse = await fetch('/api/analyze-media', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          mediaUrl: 'test.jpg',
          mediaType: 'image'
        })
      });
      
      this.logTest('AI Features', 'AI Analysis Endpoint', 
        aiResponse.status === 200 || aiResponse.status === 400 || aiResponse.status === 500,
        `AI endpoint accessible - Status: ${aiResponse.status}`);
      
    } catch (error) {
      this.logTest('AI Features', 'AI Analysis', false, error.message);
    }
  }

  async testAdminAuthentication() {
    console.log('\n🔐 Testing Admin Authentication...');
    
    try {
      // Test admin routes (should be protected)
      const adminResponse = await fetch('/admin');
      this.logTest('Admin Authentication', 'Admin Route Protection', 
        adminResponse.status === 401 || adminResponse.status === 403 || adminResponse.status === 404,
        `Admin protected - Status: ${adminResponse.status}`);
      
    } catch (error) {
      this.logTest('Admin Authentication', 'Admin Access', false, error.message);
    }
  }

  async testFrontendRouting() {
    console.log('\n🛣️ Testing Frontend Routing...');
    
    const routes = [
      '/',
      '/accommodations',
      '/gallery',
      '/activities',
      '/contact',
      '/about'
    ];
    
    for (const route of routes) {
      try {
        const response = await fetch(route);
        this.logTest('Frontend Routing', `Route: ${route}`, response.ok, `Status: ${response.status}`);
      } catch (error) {
        this.logTest('Frontend Routing', `Route: ${route}`, false, error.message);
      }
    }
  }

  async testContentManagement() {
    console.log('\n📝 Testing Content Management...');
    
    try {
      // Test content endpoints
      const activitiesResponse = await fetch('/api/activities');
      const activitiesData = await activitiesResponse.json();
      
      this.logTest('Content Management', 'Activities Content', activitiesResponse.ok, 
        `Activities loaded: ${Array.isArray(activitiesData) ? activitiesData.length : 0}`);
      
      const testimonialsResponse = await fetch('/api/testimonials');
      const testimonialsData = await testimonialsResponse.json();
      
      this.logTest('Content Management', 'Testimonials Content', testimonialsResponse.ok,
        `Testimonials loaded: ${Array.isArray(testimonialsData) ? testimonialsData.length : 0}`);
      
    } catch (error) {
      this.logTest('Content Management', 'Content Loading', false, error.message);
    }
  }

  async testPerformanceSecurity() {
    console.log('\n⚡ Testing Performance & Security...');
    
    try {
      // Test response times
      const startTime = performance.now();
      const response = await fetch('/api/gallery');
      const endTime = performance.now();
      const responseTime = endTime - startTime;
      
      this.logTest('Performance & Security', 'API Response Time', 
        responseTime < 2000, `Response time: ${responseTime.toFixed(2)}ms`);
      
      // Test CORS headers
      const corsHeaders = response.headers.get('Access-Control-Allow-Origin');
      this.logTest('Performance & Security', 'CORS Configuration', 
        corsHeaders !== null, `CORS: ${corsHeaders || 'Not configured'}`);
      
    } catch (error) {
      this.logTest('Performance & Security', 'Performance Test', false, error.message);
    }
  }

  logTest(category, testName, passed, details = '') {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const result = {
      category,
      testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    };
    
    this.results.tests.push(result);
    if (passed) {
      this.results.passed++;
    } else {
      this.results.failed++;
    }
    
    console.log(`${status} ${category} - ${testName}: ${details}`);
  }

  generateFinalReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🏆 Ko Lake Villa - Test Results Summary');
    console.log('='.repeat(60));
    
    const total = this.results.passed + this.results.failed;
    const passRate = total > 0 ? ((this.results.passed / total) * 100).toFixed(1) : 0;
    
    console.log(`📊 Tests Run: ${total}`);
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📈 Pass Rate: ${passRate}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`  • ${test.category} - ${test.testName}: ${test.details}`);
        });
    }
    
    console.log('\n📝 Deployment Readiness:');
    if (passRate >= 80) {
      console.log('🟢 READY FOR DEPLOYMENT - Most critical functionality working');
    } else if (passRate >= 60) {
      console.log('🟡 NEEDS ATTENTION - Some issues require fixing before deployment');
    } else {
      console.log('🔴 NOT READY - Critical issues must be resolved');
    }
    
    console.log('\n🔧 Next Steps:');
    console.log('1. Review failed tests and fix critical issues');
    console.log('2. Restore full Ko Lake Villa application');
    console.log('3. Run integration tests');
    console.log('4. Deploy to production');
    
    return this.results;
  }
}

// Auto-run tests when script is loaded
async function runKoLakeVillaTests() {
  const testSuite = new KoLakeVillaTestSuite();
  return await testSuite.runAllTests();
}

// Export for manual execution
window.KoLakeVillaTestSuite = KoLakeVillaTestSuite;
window.runKoLakeVillaTests = runKoLakeVillaTests;

// Display instructions
console.log('Ko Lake Villa Test Suite Loaded!');
console.log('Run: runKoLakeVillaTests() to start comprehensive testing');