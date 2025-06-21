
/**
 * Ko Lake Villa - Comprehensive Project Test Suite
 * Tests all major functionality and displays Pass/Fail results
 */

class KoLakeVillaProjectTest {
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
      return { status: 500, ok: false };
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

  // Test Core Pages
  async testCorePages() {
    console.log('\n📄 Testing Core Pages...');
    
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/accommodation', name: 'Accommodation Page' },
      { path: '/gallery', name: 'Gallery Page' },
      { path: '/dining', name: 'Dining Page' },
      { path: '/experiences', name: 'Experiences Page' },
      { path: '/contact', name: 'Contact Page' },
      { path: '/booking', name: 'Booking Page' },
      { path: '/faq', name: 'FAQ Page' }
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

  // Test API Endpoints
  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    const endpoints = [
      { path: '/api/gallery', name: 'Gallery API' },
      { path: '/api/rooms', name: 'Rooms API' },
      { path: '/api/testimonials', name: 'Testimonials API' },
      { path: '/api/activities', name: 'Activities API' },
      { path: '/api/dining-options', name: 'Dining Options API' },
      { path: '/api/admin/pricing', name: 'Pricing API' }
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

  // Test Admin Access
  async testAdminAccess() {
    console.log('\n🔐 Testing Admin Access...');
    
    const adminPages = [
      { path: '/admin/login', name: 'Admin Login Page' },
      { path: '/admin/dashboard', name: 'Admin Dashboard' },
      { path: '/admin/gallery', name: 'Admin Gallery' },
      { path: '/admin/calendar', name: 'Admin Calendar' }
    ];

    for (const page of adminPages) {
      try {
        const response = await fetch(`${this.baseUrl}${page.path}`);
        // Admin pages should either load (200) or redirect to login
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

  // Test Gallery Functionality
  async testGalleryFunctionality() {
    console.log('\n🖼️ Testing Gallery Functionality...');
    
    try {
      // Test gallery data retrieval
      const response = await this.apiRequest('GET', '/api/gallery');
      const passed = response.status === 200;
      
      if (passed) {
        const data = await response.json();
        const isArray = Array.isArray(data);
        const hasImages = data.length > 0;
        
        this.logTest('Gallery', 'Gallery Data Retrieval', true, `${data.length} images found`);
        this.logTest('Gallery', 'Gallery Data Structure', isArray, isArray ? '' : 'Not an array');
        this.logTest('Gallery', 'Gallery Has Content', hasImages, hasImages ? '' : 'No images');
        
        // Test image structure
        if (hasImages) {
          const firstImage = data[0];
          const hasRequiredFields = firstImage.imageUrl && firstImage.category;
          this.logTest('Gallery', 'Image Data Structure', hasRequiredFields, 
            hasRequiredFields ? '' : 'Missing imageUrl or category');
        }
      } else {
        this.logTest('Gallery', 'Gallery Data Retrieval', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Gallery', 'Gallery Functionality', false, error.message);
    }
  }

  // Test Pricing System
  async testPricingSystem() {
    console.log('\n💰 Testing Pricing System...');
    
    try {
      const response = await this.apiRequest('GET', '/api/admin/pricing');
      const passed = response.status === 200;
      
      if (passed) {
        const data = await response.json();
        const hasRates = data && data.rates;
        const hasRoomTypes = hasRates && data.rates.knp && data.rates.knp1 && data.rates.knp3 && data.rates.knp6;
        
        this.logTest('Pricing', 'Pricing API Access', true);
        this.logTest('Pricing', 'Pricing Data Structure', hasRates, hasRates ? '' : 'Missing rates object');
        this.logTest('Pricing', 'All Room Types Present', hasRoomTypes, 
          hasRoomTypes ? '' : 'Missing room type data');
          
        // Test pricing calculation logic
        if (hasRoomTypes) {
          const knpRate = data.rates.knp;
          const hasWeekdayRates = knpRate.sun && knpRate.mon && knpRate.tue;
          this.logTest('Pricing', 'Weekday Rates Complete', hasWeekdayRates,
            hasWeekdayRates ? '' : 'Missing weekday rates');
        }
      } else {
        this.logTest('Pricing', 'Pricing API Access', false, `Status: ${response.status}`);
      }
    } catch (error) {
      this.logTest('Pricing', 'Pricing System', false, error.message);
    }
  }

  // Test Form Functionality
  async testFormFunctionality() {
    console.log('\n📝 Testing Form Functionality...');
    
    // Test contact form
    try {
      const contactData = {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Subject",
        message: "Test message"
      };
      
      const response = await this.apiRequest('POST', '/api/contact', contactData);
      this.logTest('Forms', 'Contact Form Submission', 
        response.status === 201 || response.status === 200,
        response.status !== 201 && response.status !== 200 ? `Status: ${response.status}` : ''
      );
    } catch (error) {
      this.logTest('Forms', 'Contact Form Submission', false, error.message);
    }

    // Test booking form
    try {
      const bookingData = {
        customerName: "Test Booking",
        email: "booking@example.com",
        phone: "+94771234567",
        roomType: "KLV1",
        checkIn: "2025-07-01",
        checkOut: "2025-07-03",
        guestCount: 4
      };
      
      const response = await this.apiRequest('POST', '/api/bookings', bookingData);
      this.logTest('Forms', 'Booking Form Submission', 
        response.status === 201 || response.status === 200,
        response.status !== 201 && response.status !== 200 ? `Status: ${response.status}` : ''
      );
    } catch (error) {
      this.logTest('Forms', 'Booking Form Submission', false, error.message);
    }
  }

  // Test Static Assets
  async testStaticAssets() {
    console.log('\n📋 Testing Static Assets...');
    
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

  // Test Database Connectivity
  async testDatabaseConnectivity() {
    console.log('\n🗄️ Testing Database Connectivity...');
    
    try {
      // Test database through gallery API (which requires DB)
      const response = await this.apiRequest('GET', '/api/gallery');
      this.logTest('Database', 'Database Connection', 
        response.status === 200,
        response.status !== 200 ? 'Database connection failed' : 'Connected successfully'
      );
    } catch (error) {
      this.logTest('Database', 'Database Connection', false, error.message);
    }
  }

  // Test Version Information
  async testVersionInfo() {
    console.log('\n📦 Testing Version Information...');
    
    try {
      // Check if version endpoint exists
      const response = await this.apiRequest('GET', '/api/version');
      if (response.status === 200) {
        const data = await response.json();
        this.logTest('Version', 'Version API Available', true, `Version: ${data.version || 'Unknown'}`);
      } else {
        this.logTest('Version', 'Version API Available', false, 'No version endpoint');
      }
    } catch (error) {
      this.logTest('Version', 'Version Information', false, error.message);
    }
  }

  // Test Performance
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
      
      // Test gallery performance
      const galleryStartTime = Date.now();
      const galleryResponse = await this.apiRequest('GET', '/api/gallery');
      const galleryEndTime = Date.now();
      const galleryLoadTime = galleryEndTime - galleryStartTime;
      
      this.logTest('Performance', 'Gallery API Response Time', 
        galleryLoadTime < 2000,
        `${galleryLoadTime}ms ${galleryLoadTime < 2000 ? '(Good)' : '(Slow)'}`
      );
      
    } catch (error) {
      this.logTest('Performance', 'Performance Testing', false, error.message);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🧪 Ko Lake Villa - Comprehensive Project Test Suite Starting...\n');
    console.log('Testing Environment: Replit Development Server');
    console.log('Base URL: http://0.0.0.0:5000\n');
    
    await this.testCorePages();
    await this.testAPIEndpoints();
    await this.testAdminAccess();
    await this.testGalleryFunctionality();
    await this.testPricingSystem();
    await this.testFormFunctionality();
    await this.testStaticAssets();
    await this.testDatabaseConnectivity();
    await this.testVersionInfo();
    await this.testPerformance();
    
    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🏁 KO LAKE VILLA PROJECT TEST RESULTS');
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
    
    console.log('\n🎯 PROJECT STATUS:');
    const successRate = (this.results.passed / this.results.total) * 100;
    
    if (successRate >= 95) {
      console.log('🟢 EXCELLENT - Project is production ready!');
    } else if (successRate >= 85) {
      console.log('🟡 GOOD - Minor issues need attention');
    } else if (successRate >= 70) {
      console.log('🟠 FAIR - Several issues need fixing');
    } else {
      console.log('🔴 NEEDS WORK - Critical issues found');
    }
    
    console.log('\n📝 RECOMMENDATIONS:');
    if (this.results.failed === 0) {
      console.log('🎉 All tests passed! Your Ko Lake Villa project is working perfectly.');
      console.log('🚀 Ready for deployment on Replit.');
    } else {
      console.log('🔧 Review failed tests above and fix issues before deployment.');
      console.log('💡 Focus on critical functionality first (Pages, API, Database).');
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

// Run the test suite
async function main() {
  const testSuite = new KoLakeVillaProjectTest();
  await testSuite.runAllTests();
}

// Auto-run if called directly
if (typeof window === 'undefined') {
  main().catch(console.error);
}

module.exports = KoLakeVillaProjectTest;
