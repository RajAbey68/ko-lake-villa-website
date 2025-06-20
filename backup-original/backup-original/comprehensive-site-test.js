
/**
 * Ko Lake Villa - Complete Site Test Suite
 * Tests all functionality including pages, API endpoints, forms, and features
 */

class KoLakeVillaSiteTest {
  constructor() {
    this.baseUrl = 'http://0.0.0.0:5000';
    this.results = {
      passed: 0,
      failed: 0,
      total: 0,
      details: []
    };
  }

  async apiRequest(method, endpoint, body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      return response;
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error);
      return { status: 500, ok: false, error: error.message };
    }
  }

  logTest(category, testName, passed, details = '') {
    this.results.total++;
    if (passed) {
      this.results.passed++;
      console.log(`✅ ${category}: ${testName}`);
    } else {
      this.results.failed++;
      console.log(`❌ ${category}: ${testName} - ${details}`);
    }
    
    this.results.details.push({
      category,
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    });
  }

  // Test all main pages
  async testMainPages() {
    console.log('\n🏠 Testing Main Pages...');
    
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/accommodation', name: 'Accommodation' },
      { path: '/gallery', name: 'Gallery' },
      { path: '/dining', name: 'Dining' },
      { path: '/experiences', name: 'Experiences' },
      { path: '/contact', name: 'Contact' },
      { path: '/booking', name: 'Booking' },
      { path: '/faq', name: 'FAQ' },
      { path: '/deals', name: 'Deals' },
      { path: '/friends', name: 'Friends' }
    ];

    for (const page of pages) {
      try {
        const response = await fetch(`${this.baseUrl}${page.path}`);
        this.logTest('Pages', page.name, 
          response.status === 200,
          response.status !== 200 ? `Status: ${response.status}` : ''
        );
      } catch (error) {
        this.logTest('Pages', page.name, false, error.message);
      }
    }
  }

  // Test all API endpoints
  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    const endpoints = [
      { path: '/api/gallery', name: 'Gallery API' },
      { path: '/api/rooms', name: 'Rooms API' },
      { path: '/api/testimonials', name: 'Testimonials API' },
      { path: '/api/activities', name: 'Activities API' },
      { path: '/api/dining-options', name: 'Dining Options API' },
      { path: '/api/admin/pricing', name: 'Pricing API' },
      { path: '/health', name: 'Health Check' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await this.apiRequest('GET', endpoint.path);
        this.logTest('API', endpoint.name, 
          response.status === 200,
          response.status !== 200 ? `Status: ${response.status}` : ''
        );
      } catch (error) {
        this.logTest('API', endpoint.name, false, error.message);
      }
    }
  }

  // Test admin pages
  async testAdminPages() {
    console.log('\n🔐 Testing Admin Pages...');
    
    const adminPages = [
      { path: '/admin/login', name: 'Admin Login' },
      { path: '/admin/dashboard', name: 'Admin Dashboard' },
      { path: '/admin/gallery', name: 'Admin Gallery' },
      { path: '/admin/analytics', name: 'Admin Analytics' },
      { path: '/admin/roadmap', name: 'Admin Roadmap' }
    ];

    for (const page of adminPages) {
      try {
        const response = await fetch(`${this.baseUrl}${page.path}`);
        // Admin pages should either load (200) or redirect to login (302)
        const passed = response.status === 200 || response.status === 302;
        this.logTest('Admin', page.name, 
          passed,
          !passed ? `Status: ${response.status}` : ''
        );
      } catch (error) {
        this.logTest('Admin', page.name, false, error.message);
      }
    }
  }

  // Test gallery functionality
  async testGalleryFunctionality() {
    console.log('\n🖼️ Testing Gallery Functionality...');
    
    try {
      const response = await this.apiRequest('GET', '/api/gallery');
      const passed = response.status === 200;
      
      if (passed) {
        const data = await response.json();
        const isArray = Array.isArray(data);
        const hasImages = data.length > 0;
        
        this.logTest('Gallery', 'Gallery Data Retrieval', true, `${data.length} images found`);
        this.logTest('Gallery', 'Gallery Data Structure', isArray, isArray ? '' : 'Not an array');
        this.logTest('Gallery', 'Gallery Has Content', hasImages, hasImages ? '' : 'No images');
        
        if (hasImages) {
          const firstImage = data[0];
          const hasRequiredFields = firstImage.imageUrl && firstImage.category;
          this.logTest('Gallery', 'Image Data Structure', hasRequiredFields, 
            hasRequiredFields ? '' : 'Missing imageUrl or category');
            
          // Test categories
          const categories = [...new Set(data.map(img => img.category))];
          this.logTest('Gallery', 'Category Diversity', categories.length > 3, 
            `${categories.length} categories: ${categories.join(', ')}`);
        }
      } else {
        this.logTest('Gallery', 'Gallery Data Retrieval', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Gallery', 'Gallery Functionality', false, error.message);
    }
  }

  // Test booking system
  async testBookingSystem() {
    console.log('\n🏨 Testing Booking System...');
    
    try {
      // Test rooms endpoint
      const roomsResponse = await this.apiRequest('GET', '/api/rooms');
      this.logTest('Booking', 'Rooms Data', roomsResponse.status === 200, 
        roomsResponse.status !== 200 ? `Status: ${roomsResponse.status}` : '');
      
      // Test pricing endpoint
      const pricingResponse = await this.apiRequest('GET', '/api/admin/pricing');
      this.logTest('Booking', 'Pricing Data', pricingResponse.status === 200,
        pricingResponse.status !== 200 ? `Status: ${pricingResponse.status}` : '');
      
      if (pricingResponse.status === 200) {
        const pricingData = await pricingResponse.json();
        const hasRates = pricingData && pricingData.rates;
        this.logTest('Booking', 'Pricing Structure', hasRates,
          hasRates ? 'Rate structure valid' : 'Missing rates object');
      }
    } catch (error) {
      this.logTest('Booking', 'Booking System', false, error.message);
    }
  }

  // Test form functionality
  async testFormFunctionality() {
    console.log('\n📝 Testing Form Functionality...');
    
    // Test contact form submission
    try {
      const contactData = {
        name: "Test User",
        email: "test@kolakevilla.com",
        subject: "Website Test",
        message: "This is a test message from the automated test suite."
      };
      
      const response = await this.apiRequest('POST', '/api/contact', contactData);
      this.logTest('Forms', 'Contact Form', 
        response.status === 201 || response.status === 200,
        response.status !== 201 && response.status !== 200 ? `Status: ${response.status}` : ''
      );
    } catch (error) {
      this.logTest('Forms', 'Contact Form', false, error.message);
    }

    // Test booking form validation
    try {
      const bookingData = {
        customerName: "Test Booking",
        email: "booking@test.com",
        phone: "+94771234567",
        roomType: "KLV1",
        checkIn: "2025-07-01",
        checkOut: "2025-07-03",
        guestCount: 4
      };
      
      const response = await this.apiRequest('POST', '/api/bookings', bookingData);
      this.logTest('Forms', 'Booking Form', 
        response.status === 201 || response.status === 200 || response.status === 400,
        'Booking endpoint responsive'
      );
    } catch (error) {
      this.logTest('Forms', 'Booking Form', false, error.message);
    }
  }

  // Test content management
  async testContentManagement() {
    console.log('\n📋 Testing Content Management...');
    
    const contentEndpoints = [
      { path: '/api/testimonials', name: 'Testimonials' },
      { path: '/api/activities', name: 'Activities' },
      { path: '/api/dining-options', name: 'Dining Options' }
    ];
    
    for (const endpoint of contentEndpoints) {
      try {
        const response = await this.apiRequest('GET', endpoint.path);
        if (response.status === 200) {
          const data = await response.json();
          this.logTest('Content', endpoint.name, 
            Array.isArray(data) && data.length > 0,
            `${data.length} items loaded`
          );
        } else {
          this.logTest('Content', endpoint.name, false, `Status: ${response.status}`);
        }
      } catch (error) {
        this.logTest('Content', endpoint.name, false, error.message);
      }
    }
  }

  // Test static assets
  async testStaticAssets() {
    console.log('\n📄 Testing Static Assets...');
    
    const assets = [
      { path: '/sitemap.xml', name: 'Sitemap' },
      { path: '/robots.txt', name: 'Robots.txt' }
    ];

    for (const asset of assets) {
      try {
        const response = await fetch(`${this.baseUrl}${asset.path}`);
        this.logTest('Assets', asset.name, 
          response.status === 200,
          response.status !== 200 ? `Status: ${response.status}` : ''
        );
      } catch (error) {
        this.logTest('Assets', asset.name, false, error.message);
      }
    }
  }

  // Test performance
  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
      const startTime = Date.now();
      const response = await fetch(`${this.baseUrl}/`);
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      this.logTest('Performance', 'Homepage Load Time', 
        loadTime < 3000,
        `${loadTime}ms ${loadTime < 3000 ? '(Good)' : '(Slow)'}`
      );
      
      // Test API performance
      const apiStartTime = Date.now();
      const apiResponse = await this.apiRequest('GET', '/api/gallery');
      const apiEndTime = Date.now();
      const apiLoadTime = apiEndTime - apiStartTime;
      
      this.logTest('Performance', 'API Response Time', 
        apiLoadTime < 2000,
        `${apiLoadTime}ms ${apiLoadTime < 2000 ? '(Good)' : '(Slow)'}`
      );
      
    } catch (error) {
      this.logTest('Performance', 'Performance Testing', false, error.message);
    }
  }

  // Test security headers
  async testSecurity() {
    console.log('\n🔒 Testing Security...');
    
    try {
      const response = await fetch(`${this.baseUrl}/`);
      const headers = response.headers;
      
      // Check for security headers
      const hasXFrameOptions = headers.has('x-frame-options');
      const hasContentType = headers.has('content-type');
      
      this.logTest('Security', 'X-Frame-Options Header', hasXFrameOptions,
        hasXFrameOptions ? 'Present' : 'Missing');
      this.logTest('Security', 'Content-Type Header', hasContentType,
        hasContentType ? 'Present' : 'Missing');
        
    } catch (error) {
      this.logTest('Security', 'Security Headers', false, error.message);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🧪 Ko Lake Villa - Complete Site Test Suite Starting...\n');
    console.log('Testing Environment: Replit Development Server');
    console.log('Base URL: http://0.0.0.0:5000\n');
    
    await this.testMainPages();
    await this.testAPIEndpoints();
    await this.testAdminPages();
    await this.testGalleryFunctionality();
    await this.testBookingSystem();
    await this.testFormFunctionality();
    await this.testContentManagement();
    await this.testStaticAssets();
    await this.testPerformance();
    await this.testSecurity();
    
    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🏁 KO LAKE VILLA COMPLETE SITE TEST RESULTS');
    console.log('='.repeat(60));
    console.log(`✅ PASSED: ${this.results.passed}/${this.results.total}`);
    console.log(`❌ FAILED: ${this.results.failed}/${this.results.total}`);
    console.log(`📈 SUCCESS RATE: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.results.details
        .filter(result => !result.passed)
        .forEach(result => {
          console.log(`  • ${result.category}: ${result.test} - ${result.details}`);
        });
    }
    
    console.log('\n📊 RESULTS BY CATEGORY:');
    const categories = {};
    this.results.details.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = { passed: 0, total: 0 };
      }
      categories[result.category].total++;
      if (result.passed) categories[result.category].passed++;
    });
    
    Object.entries(categories).forEach(([category, stats]) => {
      const percentage = ((stats.passed / stats.total) * 100).toFixed(1);
      console.log(`  ${category}: ${stats.passed}/${stats.total} (${percentage}%)`);
    });
    
    console.log('\n🎯 SITE STATUS:');
    const successRate = (this.results.passed / this.results.total) * 100;
    
    if (successRate >= 95) {
      console.log('🟢 EXCELLENT - Site is production ready!');
    } else if (successRate >= 85) {
      console.log('🟡 GOOD - Minor issues need attention');
    } else if (successRate >= 70) {
      console.log('🟠 FAIR - Several issues need fixing');
    } else {
      console.log('🔴 NEEDS WORK - Critical issues found');
    }
    
    console.log('\n📝 RECOMMENDATIONS:');
    if (this.results.failed === 0) {
      console.log('🎉 All tests passed! Ko Lake Villa is working perfectly.');
      console.log('🚀 Ready for production deployment on Replit.');
    } else {
      console.log('🔧 Review failed tests above and fix issues.');
      console.log('💡 Focus on critical functionality first (Pages, API, Forms).');
    }
    
    console.log('='.repeat(60));
    
    return {
      passed: this.results.passed,
      failed: this.results.failed,
      total: this.results.total,
      successRate: successRate,
      details: this.results.details
    };
  }
}

// Run the comprehensive test suite
async function main() {
  const testSuite = new KoLakeVillaSiteTest();
  await testSuite.runAllTests();
}

// Auto-run if called directly
if (typeof window === 'undefined') {
  main().catch(console.error);
}

module.exports = KoLakeVillaSiteTest;
