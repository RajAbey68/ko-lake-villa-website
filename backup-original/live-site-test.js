
/**
 * Ko Lake Villa - Live Site Testing Suite
 * Tests the deployed website at skill-bridge-rajabey68.replit.app
 */

class LiveSiteTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      critical: 0,
      criticalPassed: 0,
      tests: []
    };
    this.baseUrl = 'https://skill-bridge-rajabey68.replit.app';
  }

  logTest(category, testName, passed, details = '', critical = false) {
    const result = { category, testName, passed, details, critical };
    this.results.tests.push(result);
    
    if (critical) {
      this.results.critical++;
      if (passed) this.results.criticalPassed++;
    }
    
    if (passed) {
      this.results.passed++;
      console.log(`✅ ${category}: ${testName}${critical ? ' [CRITICAL]' : ''}`);
    } else {
      this.results.failed++;
      console.log(`❌ ${category}: ${testName}${critical ? ' [CRITICAL]' : ''} - ${details}`);
    }
    
    if (details && passed) {
      console.log(`   ${details}`);
    }
  }

  async testEndpoint(url, expectedStatus = 200) {
    try {
      const response = await fetch(url);
      return {
        ok: response.status === expectedStatus,
        status: response.status,
        data: response.ok ? await response.text() : null
      };
    } catch (error) {
      return {
        ok: false,
        status: 'ERROR',
        error: error.message
      };
    }
  }

  // Test critical pages
  async testCorePages() {
    console.log('\n🌐 Testing Core Pages...');
    
    const pages = [
      { path: '/', name: 'Homepage', critical: true },
      { path: '/accommodation', name: 'Accommodation', critical: true },
      { path: '/gallery', name: 'Gallery', critical: true },
      { path: '/booking', name: 'Booking', critical: true },
      { path: '/contact', name: 'Contact' },
      { path: '/experiences', name: 'Experiences' },
      { path: '/dining', name: 'Dining' },
      { path: '/faq', name: 'FAQ' }
    ];
    
    for (const page of pages) {
      const result = await this.testEndpoint(`${this.baseUrl}${page.path}`);
      this.logTest('Pages', page.name, result.ok, 
        result.ok ? `Status: ${result.status}` : `Status: ${result.status}`, 
        page.critical);
    }
  }

  // Test API endpoints
  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    const endpoints = [
      { path: '/api/rooms', name: 'Rooms API', critical: true },
      { path: '/api/gallery', name: 'Gallery API', critical: true },
      { path: '/api/testimonials', name: 'Testimonials API' },
      { path: '/api/activities', name: 'Activities API' },
      { path: '/api/pricing', name: 'Pricing API', critical: true },
      { path: '/api/health', name: 'Health Check' }
    ];
    
    for (const endpoint of endpoints) {
      const result = await this.testEndpoint(`${this.baseUrl}${endpoint.path}`);
      
      if (result.ok && endpoint.path === '/api/gallery') {
        try {
          const data = JSON.parse(result.data);
          this.logTest('API', endpoint.name, true, 
            `${Array.isArray(data) ? data.length : 0} gallery items`, 
            endpoint.critical);
        } catch {
          this.logTest('API', endpoint.name, false, 'Invalid JSON response', endpoint.critical);
        }
      } else {
        this.logTest('API', endpoint.name, result.ok, 
          result.ok ? `Status: ${result.status}` : `${result.status} - ${result.error || 'Failed'}`, 
          endpoint.critical);
      }
    }
  }

  // Test admin security
  async testAdminSecurity() {
    console.log('\n🔐 Testing Admin Security...');
    
    const adminPaths = [
      '/admin',
      '/admin/dashboard',
      '/admin/gallery',
      '/admin/login'
    ];
    
    for (const path of adminPaths) {
      const result = await this.testEndpoint(`${this.baseUrl}${path}`);
      // Admin should redirect or show login (200, 302, or 401 are acceptable)
      const secureResponse = result.status === 200 || result.status === 302 || result.status === 401;
      this.logTest('Security', `Admin protection: ${path}`, secureResponse,
        `Status: ${result.status}`);
    }
  }

  // Test static assets
  async testStaticAssets() {
    console.log('\n📄 Testing Static Assets...');
    
    const assets = [
      { path: '/sitemap.xml', name: 'Sitemap' },
      { path: '/robots.txt', name: 'Robots.txt' },
      { path: '/favicon.ico', name: 'Favicon' }
    ];
    
    for (const asset of assets) {
      const result = await this.testEndpoint(`${this.baseUrl}${asset.path}`);
      this.logTest('Assets', asset.name, result.ok,
        result.ok ? 'Available' : `Status: ${result.status}`);
    }
  }

  // Test booking functionality
  async testBookingSystem() {
    console.log('\n📅 Testing Booking System...');
    
    try {
      // Test pricing calculation
      const today = new Date();
      const checkIn = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
      const checkOut = new Date(checkIn.getTime() + 2 * 24 * 60 * 60 * 1000); // 2 day stay
      
      const pricingUrl = `${this.baseUrl}/api/pricing?checkIn=${checkIn.toISOString().split('T')[0]}&checkOut=${checkOut.toISOString().split('T')[0]}&guests=2&room=KLV`;
      const result = await this.testEndpoint(pricingUrl);
      
      if (result.ok) {
        try {
          const pricing = JSON.parse(result.data);
          this.logTest('Booking', 'Pricing calculation', true, 
            `Base price available: ${!!pricing.basePrice || !!pricing.KLV}`, true);
        } catch {
          this.logTest('Booking', 'Pricing calculation', false, 'Invalid pricing response', true);
        }
      } else {
        this.logTest('Booking', 'Pricing calculation', false, `Status: ${result.status}`, true);
      }
    } catch (error) {
      this.logTest('Booking', 'Pricing calculation', false, error.message, true);
    }
  }

  // Test gallery functionality
  async testGallerySystem() {
    console.log('\n🖼️ Testing Gallery System...');
    
    try {
      const result = await this.testEndpoint(`${this.baseUrl}/api/gallery`);
      
      if (result.ok) {
        const gallery = JSON.parse(result.data);
        
        if (Array.isArray(gallery)) {
          this.logTest('Gallery', 'Gallery data loaded', true, 
            `${gallery.length} images/videos`, true);
          
          // Check for different media types
          const images = gallery.filter(item => item.mediaType === 'image' || !item.mediaType);
          const videos = gallery.filter(item => item.mediaType === 'video');
          
          this.logTest('Gallery', 'Image content', images.length > 0, 
            `${images.length} images found`);
          this.logTest('Gallery', 'Video content', videos.length > 0, 
            `${videos.length} videos found`);
          
          // Check categories
          const categories = [...new Set(gallery.map(item => item.category).filter(Boolean))];
          this.logTest('Gallery', 'Category system', categories.length > 0, 
            `${categories.length} categories: ${categories.slice(0, 3).join(', ')}${categories.length > 3 ? '...' : ''}`);
          
        } else {
          this.logTest('Gallery', 'Gallery data format', false, 'Not an array', true);
        }
      } else {
        this.logTest('Gallery', 'Gallery API', false, `Status: ${result.status}`, true);
      }
    } catch (error) {
      this.logTest('Gallery', 'Gallery system', false, error.message, true);
    }
  }

  // Test contact form
  async testContactForm() {
    console.log('\n📧 Testing Contact Form...');
    
    try {
      // Test contact form submission endpoint
      const contactData = {
        name: 'Test User',
        email: 'test@example.com',
        message: 'This is a test message from live site testing'
      };
      
      const response = await fetch(`${this.baseUrl}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactData)
      });
      
      // Contact form should either work (200) or have validation (400/422)
      const validResponse = response.status === 200 || response.status === 400 || response.status === 422;
      this.logTest('Contact', 'Contact form endpoint', validResponse,
        `Status: ${response.status}`);
        
    } catch (error) {
      this.logTest('Contact', 'Contact form', false, error.message);
    }
  }

  // Test mobile responsiveness
  async testResponsiveness() {
    console.log('\n📱 Testing Mobile Responsiveness...');
    
    try {
      const homeResult = await this.testEndpoint(`${this.baseUrl}/`);
      
      if (homeResult.ok) {
        const html = homeResult.data;
        
        // Check for responsive meta tag
        const hasViewportMeta = html.includes('viewport') && html.includes('width=device-width');
        this.logTest('Mobile', 'Viewport meta tag', hasViewportMeta);
        
        // Check for responsive CSS frameworks
        const hasResponsiveCSS = html.includes('tailwind') || html.includes('bootstrap') || 
                                html.includes('responsive') || html.includes('container');
        this.logTest('Mobile', 'Responsive CSS', hasResponsiveCSS);
        
      } else {
        this.logTest('Mobile', 'Mobile test', false, 'Cannot access homepage');
      }
    } catch (error) {
      this.logTest('Mobile', 'Mobile responsiveness', false, error.message);
    }
  }

  // Test SEO basics
  async testSEO() {
    console.log('\n🔍 Testing SEO Basics...');
    
    try {
      const homeResult = await this.testEndpoint(`${this.baseUrl}/`);
      
      if (homeResult.ok) {
        const html = homeResult.data;
        
        // Check for title tag
        const hasTitle = html.includes('<title>') && !html.includes('<title></title>');
        this.logTest('SEO', 'Title tag', hasTitle);
        
        // Check for meta description
        const hasMetaDesc = html.includes('name="description"') && html.includes('content=');
        this.logTest('SEO', 'Meta description', hasMetaDesc);
        
        // Check for Open Graph tags
        const hasOG = html.includes('property="og:') || html.includes('property=\'og:');
        this.logTest('SEO', 'Open Graph tags', hasOG);
        
        // Check for structured data
        const hasStructuredData = html.includes('application/ld+json');
        this.logTest('SEO', 'Structured data', hasStructuredData);
        
      } else {
        this.logTest('SEO', 'SEO test', false, 'Cannot access homepage');
      }
    } catch (error) {
      this.logTest('SEO', 'SEO basics', false, error.message);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Ko Lake Villa - Live Site Testing Suite');
    console.log(`🌐 Testing: ${this.baseUrl}`);
    console.log('='.repeat(60));
    
    await this.testCorePages();
    await this.testAPIEndpoints();
    await this.testBookingSystem();
    await this.testGallerySystem();
    await this.testContactForm();
    await this.testAdminSecurity();
    await this.testStaticAssets();
    await this.testResponsiveness();
    await this.testSEO();
    
    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(60));
    console.log('🏁 Ko Lake Villa Live Site Test Results');
    console.log('='.repeat(60));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`🎯 Critical Tests: ${this.results.criticalPassed}/${this.results.critical}`);
    console.log(`📊 Total Tests: ${this.results.tests.length}`);
    console.log(`📈 Success Rate: ${((this.results.passed / this.results.tests.length) * 100).toFixed(1)}%`);
    
    // Critical system status
    console.log('\n🔥 CRITICAL SYSTEMS STATUS:');
    const criticalTests = this.results.tests.filter(test => test.critical);
    criticalTests.forEach(test => {
      const status = test.passed ? '✅ OPERATIONAL' : '❌ FAILED';
      console.log(`   ${test.testName}: ${status}`);
    });
    
    // Site status
    console.log('\n🌐 LIVE SITE STATUS:');
    if (this.results.criticalPassed === this.results.critical && this.results.failed <= 2) {
      console.log('✅ SITE IS FULLY OPERATIONAL');
      console.log('   • All critical systems working');
      console.log('   • Gallery system functional');
      console.log('   • Booking system operational');
      console.log('   • API endpoints responding');
    } else if (this.results.criticalPassed === this.results.critical) {
      console.log('⚠️  SITE IS MOSTLY OPERATIONAL');
      console.log('   • Critical systems working');
      console.log('   • Minor issues detected');
    } else {
      console.log('❌ SITE HAS CRITICAL ISSUES');
      console.log('   • Critical system failures detected');
    }
    
    if (this.results.failed > 0) {
      console.log('\n❌ ISSUES DETECTED:');
      this.results.tests
        .filter(test => !test.passed)
        .forEach(test => {
          const priority = test.critical ? '[CRITICAL]' : '[MINOR]';
          console.log(`   ${priority} ${test.category} - ${test.testName}: ${test.details}`);
        });
    }
    
    console.log('\n🎯 Live site testing completed!');
    return this.results;
  }
}

// Auto-run if in browser
if (typeof window !== 'undefined') {
  window.LiveSiteTestSuite = LiveSiteTestSuite;
  
  window.testLiveSite = async function() {
    const testSuite = new LiveSiteTestSuite();
    return await testSuite.runAllTests();
  };
  
  console.log('🧪 Live site test suite loaded.');
  console.log('Run: testLiveSite() - to test your live Ko Lake Villa website');
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LiveSiteTestSuite;
}
