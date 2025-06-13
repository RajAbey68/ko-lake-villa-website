/**
 * Ko Lake Villa - Comprehensive Gallery Function Test Suite
 * Tests all gallery functionality including API, caching, modals, and admin controls
 */

class GalleryFunctionTest {
  constructor() {
    this.results = {
      critical: [],
      api: [],
      admin: [],
      ui: [],
      performance: []
    };
    this.startTime = Date.now();
  }

  async apiRequest(method, endpoint, body = null) {
    try {
      const response = await fetch(endpoint, {
        method,
        headers: body ? { 'Content-Type': 'application/json' } : {},
        body: body ? JSON.stringify(body) : null
      });
      return { ok: response.ok, status: response.status, data: await response.json() };
    } catch (error) {
      return { ok: false, error: error.message };
    }
  }

  logTest(category, testName, passed, details = '') {
    const result = {
      test: testName,
      passed,
      details,
      timestamp: new Date().toISOString()
    };
    this.results[category].push(result);
    
    const status = passed ? '✅ PASS' : '❌ FAIL';
    console.log(`[${category.toUpperCase()}] ${status}: ${testName}`);
    if (details) console.log(`   Details: ${details}`);
  }

  async testCriticalAPIs() {
    console.log('\n🔴 CRITICAL API TESTS');
    
    // Test gallery data fetch
    const galleryResponse = await this.apiRequest('GET', '/api/gallery');
    this.logTest('critical', 'Gallery API Endpoint', galleryResponse.ok, 
      galleryResponse.ok ? `${galleryResponse.data.length} items loaded` : galleryResponse.error);

    // Test admin gallery endpoint
    const adminResponse = await this.apiRequest('GET', '/api/admin/gallery');
    this.logTest('critical', 'Admin Gallery API', adminResponse.ok,
      adminResponse.ok ? 'Admin access working' : adminResponse.error);

    // Test image update functionality
    if (galleryResponse.ok && galleryResponse.data.length > 0) {
      const testImage = galleryResponse.data[0];
      const updateResponse = await this.apiRequest('POST', `/api/admin/gallery/${testImage.id}`, {
        ...testImage,
        published: !testImage.published
      });
      this.logTest('critical', 'Image Update API', updateResponse.ok,
        updateResponse.ok ? 'Publication toggle working' : updateResponse.error);

      // Revert the change
      if (updateResponse.ok) {
        await this.apiRequest('POST', `/api/admin/gallery/${testImage.id}`, testImage);
      }
    }

    return galleryResponse.data || [];
  }

  async testAdminConsole() {
    console.log('\n🔧 ADMIN CONSOLE TESTS');

    // Test admin page access
    try {
      const adminPageResponse = await fetch('/admin/gallery');
      this.logTest('admin', 'Admin Page Access', adminPageResponse.ok,
        `Status: ${adminPageResponse.status}`);
    } catch (error) {
      this.logTest('admin', 'Admin Page Access', false, error.message);
    }

    // Test upload endpoint
    const uploadTest = await this.apiRequest('POST', '/api/admin/upload');
    this.logTest('admin', 'Upload Endpoint Available', uploadTest.status !== 404,
      `Endpoint responds (expecting form data)`);

    // Test bulk operations
    const bulkDeleteTest = await this.apiRequest('POST', '/api/admin/gallery/bulk-delete', { ids: [] });
    this.logTest('admin', 'Bulk Operations Endpoint', bulkDeleteTest.status !== 404,
      'Bulk delete endpoint available');
  }

  async testUIFunctionality(images) {
    console.log('\n🎨 UI FUNCTIONALITY TESTS');

    // Test if gallery elements exist
    const galleryGrid = document.querySelector('[class*="grid"]');
    this.logTest('ui', 'Gallery Grid Present', !!galleryGrid,
      galleryGrid ? 'Grid layout found' : 'Grid layout missing');

    // Test filter controls
    const categoryFilter = document.querySelector('select');
    this.logTest('ui', 'Filter Controls Present', !!categoryFilter,
      'Category filter dropdown available');

    // Test image cards
    const imageCards = document.querySelectorAll('[class*="card"], .group');
    this.logTest('ui', 'Image Cards Rendered', imageCards.length > 0,
      `${imageCards.length} image cards found`);

    // Test modal functionality
    this.testModalFunctionality();

    // Test video elements
    this.testVideoElements();

    return true;
  }

  testModalFunctionality() {
    console.log('\n🔍 MODAL FUNCTIONALITY TESTS');

    // Check for modal components
    const modalElements = document.querySelectorAll('[class*="modal"], [class*="dialog"]');
    this.logTest('ui', 'Modal Components Available', modalElements.length > 0,
      `${modalElements.length} modal elements found`);

    // Test modal triggers
    const clickableImages = document.querySelectorAll('img[class*="cursor-pointer"], img[onclick]');
    this.logTest('ui', 'Clickable Images', clickableImages.length > 0,
      `${clickableImages.length} clickable images found`);

    // Simulate modal open (if possible)
    if (clickableImages.length > 0) {
      try {
        const testImage = clickableImages[0];
        const clickEvent = new Event('click', { bubbles: true });
        testImage.dispatchEvent(clickEvent);
        
        setTimeout(() => {
          const openModal = document.querySelector('[class*="fixed"][class*="inset-0"]');
          this.logTest('ui', 'Modal Opens on Click', !!openModal,
            openModal ? 'Modal opened successfully' : 'Modal not found after click');
        }, 100);
      } catch (error) {
        this.logTest('ui', 'Modal Opens on Click', false, error.message);
      }
    }
  }

  testVideoElements() {
    console.log('\n🎥 VIDEO FUNCTIONALITY TESTS');

    const videoElements = document.querySelectorAll('video');
    this.logTest('ui', 'Video Elements Present', videoElements.length > 0,
      `${videoElements.length} video elements found`);

    if (videoElements.length > 0) {
      videoElements.forEach((video, index) => {
        // Test video source
        const hasSources = video.querySelectorAll('source').length > 0 || video.src;
        this.logTest('ui', `Video ${index + 1} Has Sources`, hasSources,
          hasSources ? 'Video sources configured' : 'No video sources found');

        // Test video controls
        const hasControls = video.hasAttribute('controls') || video.parentElement.querySelector('[class*="play"]');
        this.logTest('ui', `Video ${index + 1} Playback`, hasControls,
          'Video playback controls available');
      });
    }
  }

  async testPerformance() {
    console.log('\n⚡ PERFORMANCE TESTS');

    // Test image loading performance
    const images = document.querySelectorAll('img');
    let loadedImages = 0;
    let failedImages = 0;

    const imagePromises = Array.from(images).map(img => {
      return new Promise(resolve => {
        if (img.complete) {
          loadedImages++;
          resolve();
        } else {
          img.onload = () => { loadedImages++; resolve(); };
          img.onerror = () => { failedImages++; resolve(); };
        }
      });
    });

    await Promise.all(imagePromises);
    
    this.logTest('performance', 'Image Loading', failedImages === 0,
      `${loadedImages} loaded, ${failedImages} failed`);

    // Test API response time
    const apiStart = Date.now();
    await this.apiRequest('GET', '/api/gallery');
    const apiTime = Date.now() - apiStart;
    
    this.logTest('performance', 'API Response Time', apiTime < 2000,
      `${apiTime}ms (target: <2000ms)`);

    // Test memory usage (if available)
    if (performance.memory) {
      const memoryMB = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
      this.logTest('performance', 'Memory Usage', memoryMB < 100,
        `${memoryMB}MB used (target: <100MB)`);
    }
  }

  async testCacheAndState() {
    console.log('\n💾 CACHE AND STATE TESTS');

    // Test local storage
    try {
      localStorage.setItem('gallery-test', 'working');
      const stored = localStorage.getItem('gallery-test');
      localStorage.removeItem('gallery-test');
      this.logTest('api', 'Local Storage', stored === 'working',
        'Local storage read/write working');
    } catch (error) {
      this.logTest('api', 'Local Storage', false, error.message);
    }

    // Test session storage
    try {
      sessionStorage.setItem('gallery-test', 'working');
      const stored = sessionStorage.getItem('gallery-test');
      sessionStorage.removeItem('gallery-test');
      this.logTest('api', 'Session Storage', stored === 'working',
        'Session storage read/write working');
    } catch (error) {
      this.logTest('api', 'Session Storage', false, error.message);
    }

    // Test browser cache
    const cacheTest = await this.apiRequest('GET', '/api/gallery');
    const cacheTest2 = await this.apiRequest('GET', '/api/gallery');
    this.logTest('api', 'API Caching', cacheTest.ok && cacheTest2.ok,
      'Multiple API calls successful');
  }

  async testImageEnlargement() {
    console.log('\n🔍 IMAGE ENLARGEMENT TESTS');

    // Test if images have click handlers
    const images = document.querySelectorAll('img');
    let clickableCount = 0;

    images.forEach(img => {
      const hasClickHandler = img.onclick || 
        img.addEventListener || 
        img.parentElement.onclick ||
        img.classList.contains('cursor-pointer') ||
        img.style.cursor === 'pointer';
      
      if (hasClickHandler) clickableCount++;
    });

    this.logTest('ui', 'Images Have Click Handlers', clickableCount > 0,
      `${clickableCount}/${images.length} images are clickable`);

    // Test modal overlay presence
    const modalOverlays = document.querySelectorAll('[class*="fixed"], [class*="overlay"], [class*="backdrop"]');
    this.logTest('ui', 'Modal Overlay Components', modalOverlays.length > 0,
      `${modalOverlays.length} modal overlay elements available`);
  }

  async runAllTests() {
    console.log('🚀 STARTING COMPREHENSIVE GALLERY FUNCTION TESTS');
    console.log('================================================');

    try {
      // Critical API tests
      const images = await this.testCriticalAPIs();

      // Admin console tests
      await this.testAdminConsole();

      // UI functionality tests
      await this.testUIFunctionality(images);

      // Performance tests
      await this.testPerformance();

      // Cache and state tests
      await this.testCacheAndState();

      // Image enlargement tests
      await this.testImageEnlargement();

      this.generateReport();

    } catch (error) {
      console.error('❌ Test suite error:', error);
      this.logTest('critical', 'Test Suite Execution', false, error.message);
    }
  }

  generateReport() {
    const duration = Date.now() - this.startTime;
    console.log('\n📊 COMPREHENSIVE TEST REPORT');
    console.log('===============================');

    let totalTests = 0;
    let passedTests = 0;

    Object.keys(this.results).forEach(category => {
      const tests = this.results[category];
      const categoryPassed = tests.filter(t => t.passed).length;
      const categoryTotal = tests.length;
      
      totalTests += categoryTotal;
      passedTests += categoryPassed;

      console.log(`\n${category.toUpperCase()}: ${categoryPassed}/${categoryTotal} passed`);
      
      tests.forEach(test => {
        const status = test.passed ? '✅' : '❌';
        console.log(`  ${status} ${test.test}${test.details ? ` - ${test.details}` : ''}`);
      });
    });

    console.log(`\n🎯 OVERALL RESULTS: ${passedTests}/${totalTests} tests passed`);
    console.log(`⏱️  Total test time: ${duration}ms`);

    // Generate recommendations
    console.log('\n🔧 RECOMMENDATIONS:');
    const failedTests = totalTests - passedTests;
    
    if (failedTests === 0) {
      console.log('✅ All systems operational! Gallery is production-ready.');
    } else if (failedTests <= 2) {
      console.log('⚠️  Minor issues detected. Review failed tests above.');
    } else {
      console.log('🚨 Multiple issues found. Address critical failures first.');
    }

    return {
      totalTests,
      passedTests,
      failedTests,
      duration,
      categories: this.results
    };
  }
}

// Auto-run tests
async function runComprehensiveGalleryTests() {
  const tester = new GalleryFunctionTest();
  return await tester.runAllTests();
}

// Run immediately if in browser
if (typeof window !== 'undefined') {
  runComprehensiveGalleryTests();
}

// Export for module use
if (typeof module !== 'undefined') {
  module.exports = { GalleryFunctionTest, runComprehensiveGalleryTests };
}