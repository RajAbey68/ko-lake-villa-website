/**
 * Ko Lake Villa - Final Comprehensive Test Validation
 * Validates all critical fixes including content API format, contact form, and 404 handling
 */

class FinalTestValidation {
  constructor() {
    this.baseUrl = 'http://localhost:5000';
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      critical: 0,
      errors: []
    };
  }

  async log(category, test, status, details = '') {
    const timestamp = new Date().toISOString();
    const statusIcon = status === 'PASS' ? '✅' : '❌';
    const message = `${statusIcon} [${category}] ${test}${details ? ` - ${details}` : ''}`;
    console.log(message);

    this.results.total++;
    if (status === 'PASS') {
      this.results.passed++;
    } else {
      this.results.failed++;
      this.results.errors.push(`${category}: ${test} - ${details}`);
    }
  }

  async apiRequest(method, endpoint, body = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (body) options.body = JSON.stringify(body);
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      return response;
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }

  async testContentAPIFix() {
    console.log('\n🔧 Testing Content API Format Fix...');
    
    try {
      const response = await this.apiRequest('GET', '/api/content');
      
      if (response.ok) {
        const content = await response.json();
        
        // Test 1: Response should be an array
        if (Array.isArray(content)) {
          await this.log('CONTENT', 'API returns array format', 'PASS', `${content.length} items`);
        } else {
          await this.log('CONTENT', 'API returns array format', 'FAIL', `Got ${typeof content}`);
        }

        // Test 2: Array should have content items
        if (content.length > 0) {
          await this.log('CONTENT', 'Content items exist', 'PASS', `${content.length} sections`);
        } else {
          await this.log('CONTENT', 'Content items exist', 'FAIL', 'Empty array');
        }

        // Test 3: Content items should have proper structure
        if (content.length > 0) {
          const firstItem = content[0];
          const hasValidStructure = firstItem.id && firstItem.page && firstItem.content;
          await this.log('CONTENT', 'Content structure valid', hasValidStructure ? 'PASS' : 'FAIL', 
            `Sample: ${JSON.stringify(firstItem).substring(0, 100)}...`);
        }

        // Test 4: Filter functionality should work now
        try {
          const homeContent = content.filter(item => item.page === 'home');
          await this.log('CONTENT', 'Filter function works', 'PASS', `${homeContent.length} home items`);
        } catch (filterError) {
          await this.log('CONTENT', 'Filter function works', 'FAIL', filterError.message);
        }

      } else {
        await this.log('CONTENT', 'API accessibility', 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      await this.log('CONTENT', 'API accessibility', 'FAIL', error.message);
    }
  }

  async testContactFormFix() {
    console.log('\n📝 Testing Contact Form Subject Field Fix...');
    
    try {
      // Test with missing subject (should fail)
      const invalidData = {
        name: "Test User",
        email: "test@example.com",
        message: "Test message without subject"
      };

      const invalidResponse = await this.apiRequest('POST', '/api/contact', invalidData);
      
      if (invalidResponse.status === 400) {
        const errorData = await invalidResponse.json();
        const hasSubjectError = errorData.message?.includes('subject') || 
                               errorData.errors?.some(e => e.field.includes('subject'));
        await this.log('CONTACT', 'Subject validation working', hasSubjectError ? 'PASS' : 'FAIL', 
          'Missing subject properly rejected');
      } else {
        await this.log('CONTACT', 'Subject validation working', 'FAIL', 
          `Expected 400, got ${invalidResponse.status}`);
      }

      // Test with valid subject (should pass)
      const validData = {
        name: "Test User",
        email: "test@example.com",
        subject: "Test Inquiry",
        message: "Test message with subject"
      };

      const validResponse = await this.apiRequest('POST', '/api/contact', validData);
      
      if (validResponse.status === 201) {
        await this.log('CONTACT', 'Valid submission works', 'PASS', 'Contact form accepts valid data');
      } else {
        const errorText = await validResponse.text();
        await this.log('CONTACT', 'Valid submission works', 'FAIL', 
          `Status: ${validResponse.status}, Error: ${errorText}`);
      }

    } catch (error) {
      await this.log('CONTACT', 'Contact form testing', 'FAIL', error.message);
    }
  }

  async test404Handling() {
    console.log('\n🔍 Testing 404 Error Handling...');
    
    try {
      const response = await this.apiRequest('GET', '/api/nonexistent-endpoint');
      
      if (response.status === 404) {
        await this.log('404', 'Proper 404 status', 'PASS', 'Returns correct 404 status');
      } else {
        await this.log('404', 'Proper 404 status', 'FAIL', `Got ${response.status} instead of 404`);
      }
    } catch (error) {
      await this.log('404', '404 handling test', 'FAIL', error.message);
    }
  }

  async testNewsletterDuplicateHandling() {
    console.log('\n📧 Testing Newsletter Duplicate Email Handling...');
    
    try {
      const testEmail = `test-${Date.now()}@example.com`;
      
      // First subscription (should succeed)
      const firstResponse = await this.apiRequest('POST', '/api/newsletter', { email: testEmail });
      
      if (firstResponse.status === 201) {
        await this.log('NEWSLETTER', 'First subscription works', 'PASS', 'New email accepted');
        
        // Second subscription with same email (should fail)
        const secondResponse = await this.apiRequest('POST', '/api/newsletter', { email: testEmail });
        
        if (secondResponse.status === 400) {
          const errorData = await secondResponse.json();
          const isDuplicateError = errorData.message?.includes('already subscribed') || 
                                  errorData.message?.includes('duplicate');
          await this.log('NEWSLETTER', 'Duplicate email rejected', isDuplicateError ? 'PASS' : 'FAIL', 
            'Duplicate subscription properly handled');
        } else {
          await this.log('NEWSLETTER', 'Duplicate email rejected', 'FAIL', 
            `Expected 400, got ${secondResponse.status}`);
        }
      } else {
        await this.log('NEWSLETTER', 'First subscription works', 'FAIL', 
          `Status: ${firstResponse.status}`);
      }
    } catch (error) {
      await this.log('NEWSLETTER', 'Newsletter testing', 'FAIL', error.message);
    }
  }

  async testCoreAPIs() {
    console.log('\n🔧 Testing Core API Endpoints...');
    
    const coreEndpoints = [
      '/api/gallery',
      '/api/rooms',
      '/api/activities',
      '/api/testimonials',
      '/api/dining'
    ];

    for (const endpoint of coreEndpoints) {
      try {
        const response = await this.apiRequest('GET', endpoint);
        
        if (response.ok) {
          const data = await response.json();
          const isValidArray = Array.isArray(data) && data.length >= 0;
          await this.log('API', `${endpoint} endpoint`, isValidArray ? 'PASS' : 'FAIL', 
            `Returns ${Array.isArray(data) ? 'array' : typeof data} with ${data.length || 0} items`);
        } else {
          await this.log('API', `${endpoint} endpoint`, 'FAIL', `Status: ${response.status}`);
        }
      } catch (error) {
        await this.log('API', `${endpoint} endpoint`, 'FAIL', error.message);
      }
    }
  }

  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
      const startTime = Date.now();
      const response = await this.apiRequest('GET', '/');
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      if (response.ok) {
        await this.log('PERFORMANCE', 'Page load speed', loadTime < 2000 ? 'PASS' : 'FAIL', 
          `${loadTime}ms`);
      } else {
        await this.log('PERFORMANCE', 'Page load speed', 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      await this.log('PERFORMANCE', 'Performance test', 'FAIL', error.message);
    }
  }

  generateReport() {
    console.log('\n' + '='.repeat(80));
    console.log('🏁 FINAL COMPREHENSIVE TEST VALIDATION REPORT');
    console.log('='.repeat(80));
    
    const passRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    
    console.log(`📊 Test Results:`);
    console.log(`   Total Tests: ${this.results.total}`);
    console.log(`   Passed: ${this.results.passed} ✅`);
    console.log(`   Failed: ${this.results.failed} ❌`);
    console.log(`   Pass Rate: ${passRate}%`);
    
    if (this.results.failed > 0) {
      console.log(`\n❌ Failed Tests:`);
      this.results.errors.forEach((error, index) => {
        console.log(`   ${index + 1}. ${error}`);
      });
    }
    
    console.log(`\n🎯 Overall Assessment:`);
    if (passRate >= 95) {
      console.log(`   ✅ EXCELLENT - Ready for production deployment`);
    } else if (passRate >= 85) {
      console.log(`   ✅ GOOD - Minor issues to address before deployment`);
    } else if (passRate >= 75) {
      console.log(`   ⚠️  FAIR - Several issues need fixing`);
    } else {
      console.log(`   ❌ POOR - Major issues require immediate attention`);
    }
    
    console.log('='.repeat(80));
  }

  async runAllTests() {
    console.log('🚀 Starting Final Comprehensive Test Validation...');
    console.log('Testing all critical fixes and functionality...\n');
    
    await this.testContentAPIFix();
    await this.testContactFormFix();
    await this.test404Handling();
    await this.testNewsletterDuplicateHandling();
    await this.testCoreAPIs();
    await this.testPerformance();
    
    this.generateReport();
  }
}

// Run the comprehensive validation
async function runFinalValidation() {
  const validator = new FinalTestValidation();
  await validator.runAllTests();
}

// Execute if run directly
runFinalValidation().catch(console.error);