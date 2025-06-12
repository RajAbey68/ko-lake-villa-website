
/**
 * Ko Lake Villa - Final Comprehensive Test Battery
 * Complete validation before production release
 */

class FinalTestBattery {
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

  // Test 1: Core Pages Load
  async testCorePages() {
    console.log('\n🏠 Testing Core Pages...');
    
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/accommodation', name: 'Accommodation' },
      { path: '/gallery', name: 'Gallery' },
      { path: '/dining', name: 'Dining' },
      { path: '/experiences', name: 'Experiences' },
      { path: '/contact', name: 'Contact' },
      { path: '/booking', name: 'Booking' },
      { path: '/faq', name: 'FAQ' }
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

  // Test 2: Gallery System
  async testGallerySystem() {
    console.log('\n🖼️ Testing Gallery System...');
    
    try {
      // Test gallery API
      const response = await this.apiRequest('GET', '/api/gallery');
      const galleries = await response.json();
      
      this.logTest('Gallery', 'Gallery API', 
        response.status === 200 && Array.isArray(galleries),
        response.status !== 200 ? `Status: ${response.status}` : `${galleries.length} images loaded`
      );
      
      // Test category filtering
      if (galleries.length > 0) {
        const categories = [...new Set(galleries.map(img => img.category))];
        this.logTest('Gallery', 'Category filtering', 
          categories.length > 0,
          `${categories.length} categories found: ${categories.join(', ')}`
        );
        
        // Test image data integrity
        const validImages = galleries.filter(img => 
          img.imageUrl && img.category && (img.alt || img.title)
        );
        this.logTest('Gallery', 'Image data integrity', 
          validImages.length === galleries.length,
          `${validImages.length}/${galleries.length} images have complete data`
        );
      }
      
    } catch (error) {
      this.logTest('Gallery', 'Gallery system', false, error.message);
    }
  }

  // Test 3: Admin System
  async testAdminSystem() {
    console.log('\n🔐 Testing Admin System...');
    
    const adminPages = [
      { path: '/admin/login', name: 'Admin Login' },
      { path: '/admin/dashboard', name: 'Admin Dashboard' },
      { path: '/admin/gallery', name: 'Admin Gallery' }
    ];

    for (const page of adminPages) {
      try {
        const response = await fetch(`${this.baseUrl}${page.path}`);
        // Admin pages should either load (200) or redirect to login (302)
        const passed = response.status === 200 || response.status === 302;
        this.logTest('Admin', page.name, 
          passed,
          !passed ? `Status: ${response.status}` : 'Accessible'
        );
      } catch (error) {
        this.logTest('Admin', page.name, false, error.message);
      }
    }
  }

  // Test 4: API Endpoints
  async testAPIEndpoints() {
    console.log('\n🔌 Testing API Endpoints...');
    
    const endpoints = [
      { path: '/api/gallery', name: 'Gallery API' },
      { path: '/api/rooms', name: 'Rooms API' },
      { path: '/api/testimonials', name: 'Testimonials API' },
      { path: '/api/activities', name: 'Activities API' },
      { path: '/api/dining-options', name: 'Dining Options API' }
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await this.apiRequest('GET', endpoint.path);
        this.logTest('API', endpoint.name, 
          response.status === 200,
          response.status !== 200 ? `Status: ${response.status}` : 'Working'
        );
      } catch (error) {
        this.logTest('API', endpoint.name, false, error.message);
      }
    }
  }

  // Test 5: Video Handling
  async testVideoHandling() {
    console.log('\n🎥 Testing Video Handling...');
    
    try {
      const response = await this.apiRequest('GET', '/api/gallery');
      if (response.status === 200) {
        const galleries = await response.json();
        const videos = galleries.filter(item => item.mediaType === 'video');
        
        this.logTest('Video', 'Video detection', 
          videos.length > 0,
          `${videos.length} videos found in gallery`
        );
        
        // Test video streaming
        if (videos.length > 0) {
          try {
            const videoResponse = await fetch(`${this.baseUrl}${videos[0].imageUrl}`, {
              headers: { 'Range': 'bytes=0-1023' }
            });
            this.logTest('Video', 'Video streaming', 
              videoResponse.status === 206,
              videoResponse.status === 206 ? 'Partial content supported' : `Status: ${videoResponse.status}`
            );
          } catch (error) {
            this.logTest('Video', 'Video streaming', false, error.message);
          }
        }
      }
    } catch (error) {
      this.logTest('Video', 'Video system', false, error.message);
    }
  }

  // Test 6: Static Assets
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
          response.status !== 200 ? `Status: ${response.status}` : 'Available'
        );
      } catch (error) {
        this.logTest('Assets', asset.name, false, error.message);
      }
    }
  }

  // Test 7: Performance
  async testPerformance() {
    console.log('\n⚡ Testing Performance...');
    
    try {
      // Test homepage load time
      const startTime = Date.now();
      const response = await fetch(`${this.baseUrl}/`);
      const endTime = Date.now();
      const loadTime = endTime - startTime;
      
      this.logTest('Performance', 'Homepage load time', 
        loadTime < 3000,
        `${loadTime}ms ${loadTime < 3000 ? '(Good)' : '(Slow)'}`
      );
      
      // Test gallery API response time
      const galleryStartTime = Date.now();
      const galleryResponse = await this.apiRequest('GET', '/api/gallery');
      const galleryEndTime = Date.now();
      const galleryLoadTime = galleryEndTime - galleryStartTime;
      
      this.logTest('Performance', 'Gallery API response', 
        galleryLoadTime < 2000,
        `${galleryLoadTime}ms ${galleryLoadTime < 2000 ? '(Good)' : '(Slow)'}`
      );
      
    } catch (error) {
      this.logTest('Performance', 'Performance testing', false, error.message);
    }
  }

  // Test 8: Database Connectivity
  async testDatabaseConnectivity() {
    console.log('\n🗄️ Testing Database Connectivity...');
    
    try {
      // Test database through multiple API calls
      const promises = [
        this.apiRequest('GET', '/api/gallery'),
        this.apiRequest('GET', '/api/rooms'),
        this.apiRequest('GET', '/api/activities')
      ];
      
      const responses = await Promise.all(promises);
      const allSuccessful = responses.every(r => r.status === 200);
      
      this.logTest('Database', 'Database connectivity', 
        allSuccessful,
        allSuccessful ? 'All database queries successful' : 'Some database queries failed'
      );
    } catch (error) {
      this.logTest('Database', 'Database connectivity', false, error.message);
    }
  }

  // Run all tests
  async runAllTests() {
    console.log('🧪 Ko Lake Villa - Final Comprehensive Test Battery');
    console.log('='.repeat(60));
    console.log('Testing for production release readiness...\n');
    
    await this.testCorePages();
    await this.testGallerySystem();
    await this.testAdminSystem();
    await this.testAPIEndpoints();
    await this.testVideoHandling();
    await this.testStaticAssets();
    await this.testPerformance();
    await this.testDatabaseConnectivity();
    
    this.generateFinalReport();
  }

  generateFinalReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🏁 FINAL TEST BATTERY RESULTS');
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
    
    const successRate = (this.results.passed / this.results.total) * 100;
    
    console.log('\n🎯 RELEASE READINESS:');
    if (successRate >= 95) {
      console.log('🟢 READY FOR PRODUCTION RELEASE');
      console.log('   All critical systems tested and operational');
      console.log('   ✅ Proceed with Replit deployment');
    } else if (successRate >= 85) {
      console.log('🟡 MOSTLY READY - Minor issues to address');
      console.log('   Core functionality works, some optimizations needed');
      console.log('   ⚠️ Consider fixing failed tests before release');
    } else {
      console.log('🔴 NOT READY FOR RELEASE');
      console.log('   Critical issues found that must be resolved');
      console.log('   ❌ Do not deploy until issues are fixed');
    }
    
    console.log('\n📦 DEPLOYMENT INSTRUCTIONS:');
    if (successRate >= 85) {
      console.log('1. Click the "Deploy" button in Replit');
      console.log('2. Choose "Autoscale Deployment"');
      console.log('3. Set custom domain: www.KoLakeVilla.com');
      console.log('4. Configure DNS in GoDaddy to point to Replit');
      console.log('5. Monitor deployment logs for any issues');
    } else {
      console.log('Fix the failed tests above before proceeding with deployment.');
    }
    
    console.log('='.repeat(60));
    
    return {
      readyForRelease: successRate >= 85,
      successRate: successRate,
      failedTests: this.results.failed,
      details: this.results.details
    };
  }
}

// Auto-run the comprehensive test battery
async function main() {
  const testBattery = new FinalTestBattery();
  const results = await testBattery.runAllTests();
  
  if (results.readyForRelease) {
    console.log('\n🚀 Ko Lake Villa is ready for production release!');
  } else {
    console.log('\n⚠️ Please address the failed tests before release.');
  }
  
  return results;
}

// Run if called directly
if (typeof window === 'undefined') {
  main().catch(console.error);
}

module.exports = FinalTestBattery;
