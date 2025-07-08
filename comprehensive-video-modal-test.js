/**
 * Ko Lake Villa - Comprehensive Video Modal Test
 * Tests video modal functionality and navigation on all pages
 */

class VideoModalTest {
  constructor() {
    this.results = {
      navigation: [],
      videoModal: [],
      adminPages: []
    };
  }

  async testNavigation() {
    console.log('🧭 Testing Navigation on All Pages...\n');

    const pagesToTest = [
      { url: '/', name: 'Home' },
      { url: '/accommodation', name: 'Accommodation' },
      { url: '/gallery', name: 'Gallery' },
      { url: '/experiences', name: 'Experiences' },
      { url: '/dining', name: 'Dining' },
      { url: '/contact', name: 'Contact' }
    ];

    for (let page of pagesToTest) {
      try {
        console.log(`Testing navigation on ${page.name}...`);
        
        // Navigate to page
        window.history.pushState({}, '', page.url);
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check if header exists
        const header = document.querySelector('header');
        const navigation = document.querySelector('nav');
        
        this.results.navigation.push({
          page: page.name,
          hasHeader: !!header,
          hasNavigation: !!navigation,
          status: (header && navigation) ? 'PASS' : 'FAIL'
        });

        console.log(`✓ ${page.name}: ${(header && navigation) ? 'PASS' : 'FAIL'}`);
      } catch (error) {
        console.log(`❌ ${page.name}: ERROR - ${error.message}`);
        this.results.navigation.push({
          page: page.name,
          hasHeader: false,
          hasNavigation: false,
          status: 'ERROR'
        });
      }
    }
  }

  async testAdminNavigation() {
    console.log('\n🔒 Testing Admin Navigation...\n');

    const adminPages = [
      { url: '/admin', name: 'Admin Dashboard' },
      { url: '/admin/gallery', name: 'Admin Gallery' },
      { url: '/admin/statistics', name: 'Admin Statistics' },
      { url: '/admin/calendar', name: 'Admin Calendar' }
    ];

    for (let page of adminPages) {
      try {
        console.log(`Testing admin navigation on ${page.name}...`);
        
        // Navigate to admin page
        window.history.pushState({}, '', page.url);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if AdminNavigation exists
        const adminNav = document.querySelector('header');
        const navLinks = document.querySelectorAll('nav a, header a');
        
        this.results.adminPages.push({
          page: page.name,
          hasAdminNav: !!adminNav,
          navLinksCount: navLinks.length,
          status: (adminNav && navLinks.length > 0) ? 'PASS' : 'FAIL'
        });

        console.log(`✓ ${page.name}: ${(adminNav && navLinks.length > 0) ? 'PASS' : 'FAIL'}`);
      } catch (error) {
        console.log(`❌ ${page.name}: ERROR - ${error.message}`);
        this.results.adminPages.push({
          page: page.name,
          hasAdminNav: false,
          navLinksCount: 0,
          status: 'ERROR'
        });
      }
    }
  }

  async testVideoModal() {
    console.log('\n🎬 Testing Video Modal Functionality...\n');

    try {
      // Navigate to gallery page
      window.history.pushState({}, '', '/gallery');
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get gallery data
      console.log('Fetching gallery data...');
      const response = await fetch('/api/gallery');
      const galleryData = await response.json();
      
      const videos = galleryData.filter(item => 
        item.mediaType === 'video' || 
        item.imageUrl?.endsWith('.mp4') || 
        item.imageUrl?.endsWith('.mov')
      );

      console.log(`Found ${videos.length} videos in gallery`);

      if (videos.length === 0) {
        console.log('⚠️ No videos found - cannot test video modal');
        this.results.videoModal.push({
          test: 'Video availability',
          status: 'SKIP',
          details: 'No videos in gallery'
        });
        return;
      }

      // Test video modal opening
      const videoElements = document.querySelectorAll('video');
      console.log(`Found ${videoElements.length} video elements on page`);

      if (videoElements.length > 0) {
        const firstVideo = videoElements[0];
        const videoContainer = firstVideo.closest('[data-testid="gallery-image"], .cursor-pointer') || firstVideo.parentElement;
        
        if (videoContainer) {
          console.log('Testing video click...');
          
          // Listen for modal state changes
          let modalDetected = false;
          const modalObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
              if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                addedNodes.forEach(node => {
                  if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.classList?.contains('fixed') && node.classList?.contains('inset-0')) {
                      modalDetected = true;
                      console.log('✅ Modal detected in DOM');
                    }
                  }
                });
              }
            });
          });

          modalObserver.observe(document.body, { childList: true, subtree: true });

          // Click the video
          videoContainer.click();
          
          // Wait for modal to appear
          await new Promise(resolve => setTimeout(resolve, 1500));
          
          modalObserver.disconnect();

          // Check for modal presence
          const fullscreenModal = document.querySelector('.fixed.inset-0.z-\\[9999\\]');
          const dialogModal = document.querySelector('[role="dialog"]');
          
          if (fullscreenModal || dialogModal || modalDetected) {
            console.log('✅ Video modal opened successfully');
            
            // Test video in modal
            const modalVideo = (fullscreenModal || dialogModal)?.querySelector('video');
            if (modalVideo) {
              console.log('✅ Video element found in modal');
              
              // Test video controls
              if (modalVideo.controls) {
                console.log('✅ Video has controls');
              }
              
              // Test video source
              const videoSource = modalVideo.querySelector('source')?.src || modalVideo.src;
              if (videoSource) {
                console.log(`✅ Video source: ${videoSource.substring(0, 50)}...`);
              }

              this.results.videoModal.push({
                test: 'Video modal functionality',
                status: 'PASS',
                details: 'Modal opens with video controls'
              });
            } else {
              console.log('❌ No video element in modal');
              this.results.videoModal.push({
                test: 'Video modal functionality',
                status: 'FAIL',
                details: 'Modal opens but no video element'
              });
            }
          } else {
            console.log('❌ Video modal did not open');
            this.results.videoModal.push({
              test: 'Video modal functionality',
              status: 'FAIL',
              details: 'Modal did not open on video click'
            });
          }
        }
      }

    } catch (error) {
      console.log(`❌ Video modal test failed: ${error.message}`);
      this.results.videoModal.push({
        test: 'Video modal functionality',
        status: 'ERROR',
        details: error.message
      });
    }
  }

  async runAllTests() {
    console.log('🚀 Starting Comprehensive Video Modal & Navigation Test\n');
    
    await this.testNavigation();
    await this.testAdminNavigation();
    await this.testVideoModal();
    
    this.generateReport();
  }

  generateReport() {
    console.log('\n📊 TEST RESULTS SUMMARY\n');
    console.log('='.repeat(50));
    
    // Navigation Results
    console.log('\n🧭 NAVIGATION TESTS:');
    this.results.navigation.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.page}: ${result.status}`);
    });
    
    // Admin Navigation Results
    console.log('\n🔒 ADMIN NAVIGATION TESTS:');
    this.results.adminPages.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : '❌';
      console.log(`${status} ${result.page}: ${result.status}`);
    });
    
    // Video Modal Results
    console.log('\n🎬 VIDEO MODAL TESTS:');
    this.results.videoModal.forEach(result => {
      const status = result.status === 'PASS' ? '✅' : result.status === 'SKIP' ? '⏭️' : '❌';
      console.log(`${status} ${result.test}: ${result.status} - ${result.details}`);
    });
    
    // Summary
    const totalTests = this.results.navigation.length + this.results.adminPages.length + this.results.videoModal.length;
    const passedTests = [
      ...this.results.navigation,
      ...this.results.adminPages,
      ...this.results.videoModal
    ].filter(result => result.status === 'PASS').length;
    
    console.log('\n📈 OVERALL SUMMARY:');
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Passed: ${passedTests}`);
    console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));
  }
}

// Auto-run test
const videoModalTest = new VideoModalTest();

// Run immediately if page is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => videoModalTest.runAllTests(), 2000);
  });
} else {
  setTimeout(() => videoModalTest.runAllTests(), 1000);
}

// Export for manual testing
window.videoModalTest = videoModalTest;
console.log('Video modal test suite loaded. Run videoModalTest.runAllTests() manually if needed.');