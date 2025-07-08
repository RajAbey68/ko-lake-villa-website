/**
 * Ko Lake Villa - Comprehensive Deployment & Routing Test Suite
 * Run this test suite after deployment to verify all routes and functionality
 */

class DeploymentRoutingTestSuite {
  constructor(baseUrl = '') {
    this.baseUrl = baseUrl;
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'pass' ? '✅' : type === 'fail' ? '❌' : type === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async testRoute(path, expectedStatus = 200, description = '') {
    this.results.total++;
    
    try {
      const response = await fetch(`${this.baseUrl}${path}`);
      const success = response.status === expectedStatus;
      
      if (success) {
        this.results.passed++;
        this.log(`${description || path}: ${response.status}`, 'pass');
      } else {
        this.results.failed++;
        this.results.errors.push(`${path}: Expected ${expectedStatus}, got ${response.status}`);
        this.log(`${description || path}: Expected ${expectedStatus}, got ${response.status}`, 'fail');
      }
      
      return { success, status: response.status, response };
    } catch (error) {
      this.results.failed++;
      this.results.errors.push(`${path}: ${error.message}`);
      this.log(`${description || path}: ${error.message}`, 'fail');
      return { success: false, error };
    }
  }

  async testAPIEndpoint(endpoint, method = 'GET', body = null, expectedStatus = 200) {
    this.results.total++;
    
    try {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json',
        }
      };
      
      if (body && method !== 'GET') {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${this.baseUrl}${endpoint}`, options);
      const success = response.status === expectedStatus;
      
      if (success) {
        this.results.passed++;
        this.log(`API ${method} ${endpoint}: ${response.status}`, 'pass');
      } else {
        this.results.failed++;
        this.results.errors.push(`API ${method} ${endpoint}: Expected ${expectedStatus}, got ${response.status}`);
        this.log(`API ${method} ${endpoint}: Expected ${expectedStatus}, got ${response.status}`, 'fail');
      }
      
      return { success, status: response.status, response };
    } catch (error) {
      this.results.failed++;
      this.results.errors.push(`API ${method} ${endpoint}: ${error.message}`);
      this.log(`API ${method} ${endpoint}: ${error.message}`, 'fail');
      return { success: false, error };
    }
  }

  async testContentManagement() {
    this.log('Testing Content Management System...', 'info');
    
    // Test content API
    const contentTest = await this.testAPIEndpoint('/api/content', 'GET', null, 200);
    
    if (contentTest.success) {
      try {
        const content = await contentTest.response.json();
        const pages = ['home', 'accommodation', 'dining', 'experiences', 'gallery', 'contact'];
        
        // Verify all pages have content
        for (const page of pages) {
          const pageContent = content.filter(item => item.page === page);
          if (pageContent.length > 0) {
            this.results.passed++;
            this.log(`Content exists for ${page} page`, 'pass');
          } else {
            this.results.failed++;
            this.results.errors.push(`No content found for ${page} page`);
            this.log(`No content found for ${page} page`, 'fail');
          }
          this.results.total++;
        }
        
        // Test content update
        await this.testAPIEndpoint('/api/content', 'POST', { content }, 200);
        
      } catch (error) {
        this.results.failed++;
        this.results.errors.push(`Content parsing error: ${error.message}`);
        this.log(`Content parsing error: ${error.message}`, 'fail');
        this.results.total++;
      }
    }
  }

  async testPageRouting() {
    this.log('Testing Main Website Routes...', 'info');
    
    const routes = [
      { path: '/', description: 'Homepage' },
      { path: '/accommodation', description: 'Accommodation Page' },
      { path: '/dining', description: 'Dining Page' },
      { path: '/experiences', description: 'Experiences Page' },
      { path: '/gallery', description: 'Gallery Page' },
      { path: '/contact', description: 'Contact Page' },
      { path: '/booking', description: 'Booking Page' }
    ];
    
    for (const route of routes) {
      await this.testRoute(route.path, 200, route.description);
    }
  }

  async testAdminRouting() {
    this.log('Testing Admin Routes...', 'info');
    
    const adminRoutes = [
      { path: '/admin', description: 'Admin Landing' },
      { path: '/admin/login', description: 'Admin Login' },
      { path: '/admin/content', description: 'Content Manager' },
      { path: '/admin/content-manager', description: 'Content Manager (Alt)' },
      { path: '/admin/gallery', description: 'Admin Gallery' },
      { path: '/admin/dashboard', description: 'Admin Dashboard' }
    ];
    
    for (const route of adminRoutes) {
      await this.testRoute(route.path, 200, route.description);
    }
  }

  async testAPIEndpoints() {
    this.log('Testing API Endpoints...', 'info');
    
    const endpoints = [
      { endpoint: '/api/content', method: 'GET', description: 'Get Content' },
      { endpoint: '/api/gallery', method: 'GET', description: 'Get Gallery' },
      { endpoint: '/api/testimonials', method: 'GET', description: 'Get Testimonials' },
      { endpoint: '/api/rooms', method: 'GET', description: 'Get Rooms' },
      { endpoint: '/api/pricing', method: 'GET', description: 'Get Pricing' }
    ];
    
    for (const api of endpoints) {
      await this.testAPIEndpoint(api.endpoint, api.method, null, 200);
    }
  }

  async testStaticAssets() {
    this.log('Testing Static Assets...', 'info');
    
    // Test if favicon and other static assets load
    await this.testRoute('/favicon.ico', 200, 'Favicon');
    
    // Test CSS and JS assets (these might have hashed names)
    const response = await fetch(`${this.baseUrl}/`);
    if (response.ok) {
      const html = await response.text();
      
      // Look for CSS links
      const cssMatches = html.match(/href="([^"]*\.css[^"]*)"/g);
      if (cssMatches) {
        for (const match of cssMatches.slice(0, 3)) { // Test first 3 CSS files
          const href = match.match(/href="([^"]*)"/)[1];
          if (href.startsWith('/') || href.startsWith(this.baseUrl)) {
            await this.testRoute(href, 200, `CSS Asset: ${href}`);
          }
        }
      }
      
      // Look for JS scripts
      const jsMatches = html.match(/src="([^"]*\.js[^"]*)"/g);
      if (jsMatches) {
        for (const match of jsMatches.slice(0, 3)) { // Test first 3 JS files
          const src = match.match(/src="([^"]*)"/)[1];
          if (src.startsWith('/') || src.startsWith(this.baseUrl)) {
            await this.testRoute(src, 200, `JS Asset: ${src}`);
          }
        }
      }
    }
  }

  async testErrorPages() {
    this.log('Testing Error Handling...', 'info');
    
    // Test 404 pages
    await this.testRoute('/nonexistent-page', 404, '404 Error Page');
    await this.testRoute('/admin/nonexistent', 404, 'Admin 404 Error Page');
  }

  async testFormSubmissions() {
    this.log('Testing Form Endpoints...', 'info');
    
    // Test contact form endpoint
    await this.testAPIEndpoint('/api/contact', 'POST', {
      name: 'Test User',
      email: 'test@example.com',
      message: 'Test message'
    }, 200);
    
    // Test newsletter signup
    await this.testAPIEndpoint('/api/newsletter', 'POST', {
      email: 'test@example.com'
    }, 200);
  }

  async testMobileResponsiveness() {
    this.log('Testing Mobile Responsiveness...', 'info');
    
    // Test if pages load with mobile user agent
    const mobileUA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15';
    
    try {
      const response = await fetch(`${this.baseUrl}/`, {
        headers: {
          'User-Agent': mobileUA
        }
      });
      
      if (response.ok) {
        this.results.passed++;
        this.log('Mobile user agent test passed', 'pass');
      } else {
        this.results.failed++;
        this.results.errors.push(`Mobile test failed: ${response.status}`);
        this.log(`Mobile test failed: ${response.status}`, 'fail');
      }
      this.results.total++;
    } catch (error) {
      this.results.failed++;
      this.results.errors.push(`Mobile test error: ${error.message}`);
      this.log(`Mobile test error: ${error.message}`, 'fail');
      this.results.total++;
    }
  }

  async runAllTests() {
    this.log('🚀 Starting Comprehensive Deployment Test Suite', 'info');
    this.log(`Testing ${this.baseUrl || 'localhost'}`, 'info');
    
    // Test different aspects
    await this.testPageRouting();
    await this.testAdminRouting();
    await this.testAPIEndpoints();
    await this.testContentManagement();
    await this.testStaticAssets();
    await this.testErrorPages();
    await this.testFormSubmissions();
    await this.testMobileResponsiveness();
    
    // Generate final report
    this.generateReport();
  }

  generateReport() {
    this.log('📊 DEPLOYMENT TEST RESULTS', 'info');
    this.log(`Total Tests: ${this.results.total}`, 'info');
    this.log(`Passed: ${this.results.passed}`, 'pass');
    this.log(`Failed: ${this.results.failed}`, this.results.failed > 0 ? 'fail' : 'pass');
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    this.log(`Success Rate: ${successRate}%`, successRate > 95 ? 'pass' : successRate > 80 ? 'warn' : 'fail');
    
    if (this.results.errors.length > 0) {
      this.log('❌ FAILED TESTS:', 'fail');
      this.results.errors.forEach(error => {
        this.log(`  • ${error}`, 'fail');
      });
    }
    
    if (successRate > 95) {
      this.log('🎉 DEPLOYMENT READY! All critical tests passed.', 'pass');
    } else if (successRate > 80) {
      this.log('⚠️ DEPLOYMENT CAUTION: Some tests failed but core functionality works.', 'warn');
    } else {
      this.log('🚫 DEPLOYMENT NOT RECOMMENDED: Multiple critical failures detected.', 'fail');
    }
    
    return {
      ready: successRate > 95,
      caution: successRate > 80 && successRate <= 95,
      errors: this.results.errors,
      successRate
    };
  }
}

// Usage functions for different environments
async function testLocalhost() {
  const tester = new DeploymentRoutingTestSuite('http://localhost:5000');
  return await tester.runAllTests();
}

async function testProduction(domain) {
  const tester = new DeploymentRoutingTestSuite(`https://${domain}`);
  return await tester.runAllTests();
}

async function testReplit() {
  const tester = new DeploymentRoutingTestSuite(''); // Current domain
  return await tester.runAllTests();
}

// Export for browser console usage
if (typeof window !== 'undefined') {
  window.testDeployment = testReplit;
  window.testLocal = testLocalhost;
  window.testProd = testProduction;
  window.DeploymentRoutingTestSuite = DeploymentRoutingTestSuite;
}

// Export for Node.js usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DeploymentRoutingTestSuite,
    testLocalhost,
    testProduction,
    testReplit
  };
}

// Auto-run if called directly
if (typeof window !== 'undefined' && window.location) {
  console.log('🧪 Deployment Test Suite Loaded');
  console.log('Run testDeployment() in console to test current deployment');
  console.log('Run testLocal() to test localhost');
  console.log('Run testProd("domain.com") to test production domain');
}