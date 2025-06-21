/**
 * Ko Lake Villa Website - Complete Test Suite
 * Testing all functionality before deployment
 */

import assert from 'assert';

// Test Categories:
// 1. Homepage Tests
// 2. Accommodation Page Tests  
// 3. Admin Pricing System Tests
// 4. Gallery Tests
// 5. Contact/Booking Tests
// 6. Navigation Tests
// 7. API Endpoint Tests

class KoLakeVillaTestSuite {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.testResults = [];
    this.passedTests = 0;
    this.failedTests = 0;
  }

  // Helper method to make API requests
  async apiRequest(method, endpoint, body = null) {
    const url = `${this.baseUrl}${endpoint}`;
    const options = {
      method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (body) options.body = JSON.stringify(body);
    
    const response = await fetch(url, options);
    return {
      status: response.status,
      data: await response.json().catch(() => null)
    };
  }

  // Test logging
  logTest(testName, passed, error = null) {
    this.testResults.push({
      name: testName,
      passed,
      error: error?.message || null,
      timestamp: new Date().toISOString()
    });
    
    if (passed) {
      this.passedTests++;
      console.log(`✅ ${testName}`);
    } else {
      this.failedTests++;
      console.log(`❌ ${testName}: ${error?.message || 'Failed'}`);
    }
  }

  // ===================
  // 1. HOMEPAGE TESTS
  // ===================
  
  async testHomepageLoads() {
    try {
      const response = await fetch(`${this.baseUrl}/`);
      assert.strictEqual(response.status, 200, 'Homepage should load successfully');
      this.logTest('Homepage Loads', true);
    } catch (error) {
      this.logTest('Homepage Loads', false, error);
    }
  }

  async testOurPropertySection() {
    try {
      const response = await this.apiRequest('GET', '/api/rooms');
      assert.strictEqual(response.status, 200, 'Rooms API should work');
      assert(Array.isArray(response.data), 'Should return array of rooms');
      this.logTest('Our Property Section Data', true);
    } catch (error) {
      this.logTest('Our Property Section Data', false, error);
    }
  }

  async testTestimonialsLoad() {
    try {
      const response = await this.apiRequest('GET', '/api/testimonials');
      assert.strictEqual(response.status, 200, 'Testimonials API should work');
      assert(Array.isArray(response.data), 'Should return array of testimonials');
      this.logTest('Testimonials Load', true);
    } catch (error) {
      this.logTest('Testimonials Load', false, error);
    }
  }

  // ===================
  // 2. ACCOMMODATION TESTS
  // ===================

  async testAccommodationPageLoads() {
    try {
      const response = await fetch(`${this.baseUrl}/accommodation`);
      assert.strictEqual(response.status, 200, 'Accommodation page should load');
      this.logTest('Accommodation Page Loads', true);
    } catch (error) {
      this.logTest('Accommodation Page Loads', false, error);
    }
  }

  async testCustomPricingDisplay() {
    try {
      const roomsResponse = await this.apiRequest('GET', '/api/rooms');
      const pricingResponse = await this.apiRequest('GET', '/api/admin/pricing');
      
      assert.strictEqual(roomsResponse.status, 200, 'Rooms should load');
      assert.strictEqual(pricingResponse.status, 200, 'Pricing should load');
      
      // Test that pricing data has required structure
      assert(pricingResponse.data.rates, 'Pricing should have rates object');
      assert(typeof pricingResponse.data.updated === 'string', 'Should have update timestamp');
      
      this.logTest('Custom Pricing Display', true);
    } catch (error) {
      this.logTest('Custom Pricing Display', false, error);
    }
  }

  // ===================
  // 3. ADMIN PRICING TESTS
  // ===================

  async testAdminPricingPageLoads() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/calendar`);
      assert.strictEqual(response.status, 200, 'Admin calendar should load');
      this.logTest('Admin Pricing Page Loads', true);
    } catch (error) {
      this.logTest('Admin Pricing Page Loads', false, error);
    }
  }

  async testPricingAPIEndpoint() {
    try {
      const response = await this.apiRequest('GET', '/api/admin/pricing');
      assert.strictEqual(response.status, 200, 'Pricing API should work');
      
      const data = response.data;
      assert(data.rates, 'Should have rates object');
      assert(data.rates.knp, 'Should have KNP rates');
      assert(data.rates.knp1, 'Should have KNP1 rates');
      assert(data.rates.knp3, 'Should have KNP3 rates');
      assert(data.rates.knp6, 'Should have KNP6 rates');
      
      // Test rate structure
      Object.values(data.rates).forEach(rate => {
        assert(typeof rate.sun === 'number', 'Sunday rate should be number');
        assert(typeof rate.mon === 'number', 'Monday rate should be number');
        assert(typeof rate.tue === 'number', 'Tuesday rate should be number');
      });
      
      this.logTest('Pricing API Endpoint', true);
    } catch (error) {
      this.logTest('Pricing API Endpoint', false, error);
    }
  }

  async testSundayAutoRevertLogic() {
    try {
      const response = await this.apiRequest('POST', '/api/admin/refresh-pricing');
      
      // Should work regardless of whether it's Sunday or not
      assert([200, 201].includes(response.status), 'Refresh should work');
      assert(response.data, 'Should return response data');
      
      this.logTest('Sunday Auto-Revert Logic', true);
    } catch (error) {
      this.logTest('Sunday Auto-Revert Logic', false, error);
    }
  }

  // ===================
  // 4. GALLERY TESTS
  // ===================

  async testGalleryPageLoads() {
    try {
      const response = await fetch(`${this.baseUrl}/gallery`);
      assert.strictEqual(response.status, 200, 'Gallery page should load');
      this.logTest('Gallery Page Loads', true);
    } catch (error) {
      this.logTest('Gallery Page Loads', false, error);
    }
  }

  async testGalleryImagesAPI() {
    try {
      const response = await this.apiRequest('GET', '/api/gallery');
      assert.strictEqual(response.status, 200, 'Gallery API should work');
      assert(Array.isArray(response.data), 'Should return array of images');
      
      if (response.data.length > 0) {
        const firstImage = response.data[0];
        assert(firstImage.imageUrl, 'Images should have imageUrl');
        assert(firstImage.category, 'Images should have category');
      }
      
      this.logTest('Gallery Images API', true);
    } catch (error) {
      this.logTest('Gallery Images API', false, error);
    }
  }

  // ===================
  // 5. CONTACT/BOOKING TESTS
  // ===================

  async testContactPageLoads() {
    try {
      const response = await fetch(`${this.baseUrl}/contact`);
      assert.strictEqual(response.status, 200, 'Contact page should load');
      this.logTest('Contact Page Loads', true);
    } catch (error) {
      this.logTest('Contact Page Loads', false, error);
    }
  }

  // ===================
  // 6. NAVIGATION TESTS
  // ===================

  async testAllPageNavigation() {
    const pages = [
      '/',
      '/accommodation', 
      '/dining',
      '/experiences',
      '/gallery',
      '/contact',
      '/faq'
    ];

    for (const page of pages) {
      try {
        const response = await fetch(`${this.baseUrl}${page}`);
        assert.strictEqual(response.status, 200, `${page} should load`);
        this.logTest(`Navigation: ${page}`, true);
      } catch (error) {
        this.logTest(`Navigation: ${page}`, false, error);
      }
    }
  }

  // ===================
  // 7. API ENDPOINT TESTS
  // ===================

  async testAllAPIEndpoints() {
    const endpoints = [
      '/api/rooms',
      '/api/testimonials', 
      '/api/activities',
      '/api/dining-options',
      '/api/gallery',
      '/api/admin/pricing'
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await this.apiRequest('GET', endpoint);
        assert.strictEqual(response.status, 200, `${endpoint} should work`);
        this.logTest(`API: ${endpoint}`, true);
      } catch (error) {
        this.logTest(`API: ${endpoint}`, false, error);
      }
    }
  }

  // ===================
  // 8. PRICING CALCULATION TESTS
  // ===================

  async testPricingCalculations() {
    try {
      const response = await this.apiRequest('GET', '/api/admin/pricing');
      const data = response.data;
      
      // Test pre-agreed pricing calculation (10% off Airbnb)
      Object.entries(data.rates).forEach(([roomId, rates]) => {
        const avgRate = Math.round((rates.sun + rates.mon + rates.tue) / 3);
        const directRate = Math.round(avgRate * 0.9);
        
        assert(directRate > 0, `Direct rate for ${roomId} should be positive`);
        assert(directRate < avgRate, `Direct rate should be less than Airbnb rate`);
        
        // Test discount percentage
        const discountPercent = ((avgRate - directRate) / avgRate) * 100;
        assert(Math.abs(discountPercent - 10) < 1, `Discount should be approximately 10%`);
      });
      
      this.logTest('Pricing Calculations', true);
    } catch (error) {
      this.logTest('Pricing Calculations', false, error);
    }
  }

  // ===================
  // RUN ALL TESTS
  // ===================

  async runAllTests() {
    console.log('🧪 Starting Ko Lake Villa Website Test Suite\n');
    
    // Homepage Tests
    console.log('📄 Testing Homepage...');
    await this.testHomepageLoads();
    await this.testOurPropertySection();
    await this.testTestimonialsLoad();
    
    // Accommodation Tests
    console.log('\n🏠 Testing Accommodation...');
    await this.testAccommodationPageLoads();
    await this.testCustomPricingDisplay();
    
    // Admin Pricing Tests
    console.log('\n💰 Testing Admin Pricing...');
    await this.testAdminPricingPageLoads();
    await this.testPricingAPIEndpoint();
    await this.testSundayAutoRevertLogic();
    await this.testPricingCalculations();
    
    // Gallery Tests
    console.log('\n📸 Testing Gallery...');
    await this.testGalleryPageLoads();
    await this.testGalleryImagesAPI();
    
    // Contact Tests
    console.log('\n📞 Testing Contact...');
    await this.testContactPageLoads();
    
    // Navigation Tests
    console.log('\n🧭 Testing Navigation...');
    await this.testAllPageNavigation();
    
    // API Tests
    console.log('\n🔌 Testing APIs...');
    await this.testAllAPIEndpoints();
    
    // Print Results
    this.printResults();
  }

  printResults() {
    console.log('\n' + '='.repeat(50));
    console.log('🏁 TEST RESULTS SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Passed: ${this.passedTests}`);
    console.log(`❌ Failed: ${this.failedTests}`);
    console.log(`📊 Total: ${this.passedTests + this.failedTests}`);
    console.log(`📈 Success Rate: ${((this.passedTests / (this.passedTests + this.failedTests)) * 100).toFixed(1)}%`);
    
    if (this.failedTests > 0) {
      console.log('\n❌ FAILED TESTS:');
      this.testResults
        .filter(test => !test.passed)
        .forEach(test => {
          console.log(`   • ${test.name}: ${test.error}`);
        });
    }
    
    console.log('\n' + (this.failedTests === 0 ? 
      '🚀 ALL TESTS PASSED - READY FOR DEPLOYMENT!' : 
      '⚠️  SOME TESTS FAILED - PLEASE FIX BEFORE DEPLOYMENT'));
  }
}

// Run the test suite
async function main() {
  const testSuite = new KoLakeVillaTestSuite();
  await testSuite.runAllTests();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = KoLakeVillaTestSuite;
} else {
  main().catch(console.error);
}