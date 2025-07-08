/**
 * Ko Lake Villa - Post-Deployment Test Suite
 * Comprehensive testing of all functionality after deployment
 */

class PostDeploymentTestSuite {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      tests: []
    };
    this.baseUrl = window.location.origin;
  }

  async apiRequest(method, endpoint, body = null) {
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      return response;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  logTest(category, testName, passed, details = '') {
    const result = { category, testName, passed, details };
    this.results.tests.push(result);
    
    if (passed) {
      this.results.passed++;
      console.log(`✅ ${category}: ${testName}`);
    } else {
      this.results.failed++;
      console.log(`❌ ${category}: ${testName} - ${details}`);
    }
  }

  // Test all API endpoints
  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    try {
      // Test rooms endpoint
      const roomsResponse = await this.apiRequest('GET', '/api/rooms');
      this.logTest('API', 'Rooms endpoint', roomsResponse.ok, 
        roomsResponse.ok ? '' : `Status: ${roomsResponse.status}`);
      
      // Test testimonials endpoint
      const testimonialsResponse = await this.apiRequest('GET', '/api/testimonials');
      this.logTest('API', 'Testimonials endpoint', testimonialsResponse.ok,
        testimonialsResponse.ok ? '' : `Status: ${testimonialsResponse.status}`);
      
      // Test activities endpoint
      const activitiesResponse = await this.apiRequest('GET', '/api/activities');
      this.logTest('API', 'Activities endpoint', activitiesResponse.ok,
        activitiesResponse.ok ? '' : `Status: ${activitiesResponse.status}`);
      
      // Test gallery endpoint
      const galleryResponse = await this.apiRequest('GET', '/api/gallery');
      this.logTest('API', 'Gallery endpoint', galleryResponse.ok,
        galleryResponse.ok ? '' : `Status: ${galleryResponse.status}`);
      
      // Test pricing endpoint
      const pricingResponse = await this.apiRequest('GET', '/api/pricing');
      this.logTest('API', 'Pricing endpoint', pricingResponse.ok,
        pricingResponse.ok ? '' : `Status: ${pricingResponse.status}`);
      
    } catch (error) {
      this.logTest('API', 'API endpoints test', false, error.message);
    }
  }

  // Test page navigation
  async testPageNavigation() {
    console.log('\n🧭 Testing Page Navigation...');
    
    const pages = [
      { path: '/', name: 'Home' },
      { path: '/accommodation', name: 'Accommodation' },
      { path: '/gallery', name: 'Gallery' },
      { path: '/experiences', name: 'Experiences' },
      { path: '/contact', name: 'Contact' },
      { path: '/booking', name: 'Booking' }
    ];
    
    for (const page of pages) {
      try {
        // Navigate to page
        window.history.pushState({}, '', page.path);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if page loads without errors
        const hasErrors = document.querySelector('.error') || 
                         document.querySelector('[data-error]') ||
                         document.body.textContent.includes('Error');
        
        this.logTest('Navigation', `${page.name} page loads`, !hasErrors,
          hasErrors ? 'Page contains errors' : '');
        
      } catch (error) {
        this.logTest('Navigation', `${page.name} page loads`, false, error.message);
      }
    }
    
    // Return to home
    window.history.pushState({}, '', '/');
  }

  // Test booking form functionality
  async testBookingForm() {
    console.log('\n📅 Testing Booking Form...');
    
    try {
      // Navigate to booking page
      window.history.pushState({}, '', '/booking');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if booking form elements exist
      const checkInInput = document.querySelector('input[name="checkInDate"]') ||
                          document.querySelector('[data-testid="checkin"]');
      const checkOutInput = document.querySelector('input[name="checkOutDate"]') ||
                           document.querySelector('[data-testid="checkout"]');
      const guestsInput = document.querySelector('input[name="guests"]') ||
                         document.querySelector('select[name="guests"]');
      
      this.logTest('Booking', 'Check-in date field exists', !!checkInInput);
      this.logTest('Booking', 'Check-out date field exists', !!checkOutInput);
      this.logTest('Booking', 'Guests field exists', !!guestsInput);
      
      // Test form submission (if elements exist)
      if (checkInInput && checkOutInput && guestsInput) {
        // Fill form with test data
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const dayAfter = new Date(today);
        dayAfter.setDate(dayAfter.getDate() + 2);
        
        if (checkInInput.type === 'date') {
          checkInInput.value = tomorrow.toISOString().split('T')[0];
          checkOutInput.value = dayAfter.toISOString().split('T')[0];
        }
        
        if (guestsInput.tagName === 'SELECT') {
          guestsInput.value = '2';
        } else {
          guestsInput.value = '2';
        }
        
        // Look for calculate or submit button
        const calculateBtn = document.querySelector('button[type="submit"]') ||
                           document.querySelector('button:contains("Calculate")') ||
                           document.querySelector('button:contains("Book")');
        
        this.logTest('Booking', 'Submit/Calculate button exists', !!calculateBtn);
      }
      
    } catch (error) {
      this.logTest('Booking', 'Booking form test', false, error.message);
    }
  }

  // Test gallery functionality
  async testGallery() {
    console.log('\n🖼️ Testing Gallery...');
    
    try {
      // Navigate to gallery page
      window.history.pushState({}, '', '/gallery');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if gallery images load
      const images = document.querySelectorAll('img');
      const videos = document.querySelectorAll('video');
      
      this.logTest('Gallery', 'Gallery page has images', images.length > 0,
        `Found ${images.length} images`);
      this.logTest('Gallery', 'Gallery page has videos', videos.length > 0,
        `Found ${videos.length} videos`);
      
      // Check if filter buttons exist
      const filterButtons = document.querySelectorAll('button[data-category]') ||
                           document.querySelectorAll('.filter-btn');
      
      this.logTest('Gallery', 'Category filters exist', filterButtons.length > 0,
        `Found ${filterButtons.length} filter buttons`);
      
    } catch (error) {
      this.logTest('Gallery', 'Gallery test', false, error.message);
    }
  }

  // Test contact form
  async testContactForm() {
    console.log('\n📧 Testing Contact Form...');
    
    try {
      // Navigate to contact page
      window.history.pushState({}, '', '/contact');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check contact form elements
      const nameInput = document.querySelector('input[name="name"]');
      const emailInput = document.querySelector('input[name="email"]');
      const messageInput = document.querySelector('textarea[name="message"]') ||
                          document.querySelector('input[name="message"]');
      const submitBtn = document.querySelector('button[type="submit"]');
      
      this.logTest('Contact', 'Name field exists', !!nameInput);
      this.logTest('Contact', 'Email field exists', !!emailInput);
      this.logTest('Contact', 'Message field exists', !!messageInput);
      this.logTest('Contact', 'Submit button exists', !!submitBtn);
      
    } catch (error) {
      this.logTest('Contact', 'Contact form test', false, error.message);
    }
  }

  // Test admin functionality (if accessible)
  async testAdminAccess() {
    console.log('\n🔐 Testing Admin Access...');
    
    try {
      // Try accessing admin page
      const adminResponse = await this.apiRequest('GET', '/admin');
      
      // Admin should redirect to login or show login form
      this.logTest('Admin', 'Admin page accessible', 
        adminResponse.status === 200 || adminResponse.status === 302 || adminResponse.status === 401,
        `Status: ${adminResponse.status}`);
      
    } catch (error) {
      this.logTest('Admin', 'Admin access test', false, error.message);
    }
  }

  // Test pricing functionality
  async testPricingCalculation() {
    console.log('\n💰 Testing Pricing...');
    
    try {
      const response = await this.apiRequest('GET', '/api/pricing');
      
      if (response.ok) {
        const pricing = await response.json();
        
        this.logTest('Pricing', 'Pricing data available', !!pricing);
        this.logTest('Pricing', 'KLV pricing exists', !!pricing.KLV,
          pricing.KLV ? `Base: $${pricing.KLV.basePrice}` : 'Missing KLV pricing');
        
        // Check if pricing includes expected room types
        const expectedRooms = ['KLV', 'KLV1', 'KLV3', 'KLV6'];
        for (const room of expectedRooms) {
          this.logTest('Pricing', `${room} pricing exists`, !!pricing[room]);
        }
      }
      
    } catch (error) {
      this.logTest('Pricing', 'Pricing test', false, error.message);
    }
  }

  // Test responsive design
  testResponsiveDesign() {
    console.log('\n📱 Testing Responsive Design...');
    
    // Test different viewport sizes
    const viewports = [
      { width: 1920, height: 1080, name: 'Desktop' },
      { width: 768, height: 1024, name: 'Tablet' },
      { width: 375, height: 667, name: 'Mobile' }
    ];
    
    const originalWidth = window.innerWidth;
    const originalHeight = window.innerHeight;
    
    viewports.forEach(viewport => {
      try {
        // Simulate viewport change (limited in browser)
        const mediaQuery = window.matchMedia(`(max-width: ${viewport.width}px)`);
        
        // Check if responsive classes are applied
        const body = document.body;
        const hasResponsiveClasses = body.className.includes('responsive') ||
                                   document.querySelector('.container') ||
                                   document.querySelector('.grid') ||
                                   document.querySelector('.flex');
        
        this.logTest('Responsive', `${viewport.name} layout`, hasResponsiveClasses,
          hasResponsiveClasses ? 'Responsive classes found' : 'No responsive classes detected');
        
      } catch (error) {
        this.logTest('Responsive', `${viewport.name} test`, false, error.message);
      }
    });
  }

  // Test SEO elements
  testSEO() {
    console.log('\n🔍 Testing SEO Elements...');
    
    // Check meta tags
    const titleTag = document.querySelector('title');
    const descriptionTag = document.querySelector('meta[name="description"]');
    const keywordsTag = document.querySelector('meta[name="keywords"]');
    const ogTitleTag = document.querySelector('meta[property="og:title"]');
    const ogDescriptionTag = document.querySelector('meta[property="og:description"]');
    
    this.logTest('SEO', 'Title tag exists', !!titleTag,
      titleTag ? `Title: "${titleTag.textContent}"` : 'Missing title tag');
    this.logTest('SEO', 'Meta description exists', !!descriptionTag,
      descriptionTag ? `Description: "${descriptionTag.content}"` : 'Missing meta description');
    this.logTest('SEO', 'Open Graph title exists', !!ogTitleTag);
    this.logTest('SEO', 'Open Graph description exists', !!ogDescriptionTag);
    
    // Check for structured data
    const structuredData = document.querySelector('script[type="application/ld+json"]');
    this.logTest('SEO', 'Structured data exists', !!structuredData);
  }

  // Run all tests
  async runAllTests() {
    console.log('🚀 Starting Ko Lake Villa Post-Deployment Test Suite...\n');
    
    await this.testAPIEndpoints();
    await this.testPageNavigation();
    await this.testBookingForm();
    await this.testGallery();
    await this.testContactForm();
    await this.testAdminAccess();
    await this.testPricingCalculation();
    this.testResponsiveDesign();
    this.testSEO();
    
    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('🏁 Ko Lake Villa Post-Deployment Test Results');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${this.results.passed}`);
    console.log(`❌ Failed: ${this.results.failed}`);
    console.log(`📊 Total: ${this.results.tests.length}`);
    console.log(`📈 Success Rate: ${((this.results.passed / this.results.tests.length) * 100).toFixed(1)}%`);
    
    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`  • ${test.category}: ${test.testName} - ${test.details}`);
        });
    }
    
    console.log('\n🎯 Test completed. Review results above.');
    
    // Return results for programmatic access
    return this.results;
  }
}

// Auto-run if loaded directly
if (typeof window !== 'undefined') {
  window.PostDeploymentTestSuite = PostDeploymentTestSuite;
  
  // Add convenience function to run tests
  window.runDeploymentTests = async function() {
    const testSuite = new PostDeploymentTestSuite();
    return await testSuite.runAllTests();
  };
  
  console.log('🧪 Post-deployment test suite loaded. Run tests with: runDeploymentTests()');
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = PostDeploymentTestSuite;
}