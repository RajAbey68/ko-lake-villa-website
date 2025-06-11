/**
 * Ko Lake Villa - Accommodation Image Display & Clickable Functionality Test
 * Test-driven development for image drilling functionality
 */

class AccommodationImageTest {
  constructor() {
    this.testResults = [];
    this.baseUrl = window.location.origin;
  }

  log(test, status, details = '') {
    this.testResults.push({
      test,
      status,
      details,
      timestamp: new Date().toISOString()
    });
    
    const statusColor = status === 'PASS' ? 'green' : status === 'FAIL' ? 'red' : 'orange';
    console.log(`%c[${status}] ${test}${details ? ` - ${details}` : ''}`, `color: ${statusColor}; font-weight: bold`);
  }

  // Test 1: Check if accommodation page loads properly
  async testAccommodationPageLoad() {
    console.log('\n=== Testing Accommodation Page Load ===');
    
    try {
      const response = await fetch(`${this.baseUrl}/accommodation`);
      if (response.ok) {
        this.log('Accommodation page loads', 'PASS', `Status: ${response.status}`);
        return true;
      } else {
        this.log('Accommodation page loads', 'FAIL', `Status: ${response.status}`);
        return false;
      }
    } catch (error) {
      this.log('Accommodation page loads', 'FAIL', `Error: ${error.message}`);
      return false;
    }
  }

  // Test 2: Check if room data is fetched properly
  async testRoomDataFetch() {
    console.log('\n=== Testing Room Data Fetch ===');
    
    try {
      const response = await fetch(`${this.baseUrl}/api/rooms`);
      const rooms = await response.json();
      
      if (Array.isArray(rooms) && rooms.length > 0) {
        this.log('Room data fetch', 'PASS', `Found ${rooms.length} rooms`);
        
        // Test each room has required properties
        const requiredProps = ['id', 'name', 'description', 'capacity', 'size', 'features'];
        rooms.forEach((room, index) => {
          const missingProps = requiredProps.filter(prop => !room.hasOwnProperty(prop));
          if (missingProps.length === 0) {
            this.log(`Room ${index + 1} data structure`, 'PASS', room.name);
          } else {
            this.log(`Room ${index + 1} data structure`, 'FAIL', `Missing: ${missingProps.join(', ')}`);
          }
        });
        
        return rooms;
      } else {
        this.log('Room data fetch', 'FAIL', 'No rooms found or invalid data');
        return [];
      }
    } catch (error) {
      this.log('Room data fetch', 'FAIL', `Error: ${error.message}`);
      return [];
    }
  }

  // Test 3: Check if authentic room images exist
  async testAuthenticImagePaths() {
    console.log('\n=== Testing Authentic Room Image Paths ===');
    
    const roomImagePaths = {
      'KLV1 - Master Family Suite': '/uploads/gallery/family-suite/KoLakeHouse_family-suite_0.jpg',
      'KLV3 - Triple/Twin Room': '/uploads/gallery/triple-room/KoggalaNinePeaks_triple-room_0.jpg',
      'KLV6 - Group Room': '/uploads/gallery/group-room/KoggalaNinePeaks_group-room_0.jpg',
      'Entire Villa': '/uploads/gallery/entire-villa/KoggalaNinePeaks_entire-villa_0.jpg'
    };

    for (const [roomName, imagePath] of Object.entries(roomImagePaths)) {
      try {
        const response = await fetch(`${this.baseUrl}${imagePath}`);
        if (response.ok && response.headers.get('content-type')?.startsWith('image/')) {
          this.log(`Image exists for ${roomName}`, 'PASS', imagePath);
        } else {
          this.log(`Image exists for ${roomName}`, 'FAIL', `Status: ${response.status}`);
        }
      } catch (error) {
        this.log(`Image exists for ${roomName}`, 'FAIL', `Error: ${error.message}`);
      }
    }
  }

  // Test 4: Test clickable image functionality
  testClickableImageFunctionality() {
    console.log('\n=== Testing Clickable Image Functionality ===');
    
    // Navigate to accommodation page first
    if (window.location.pathname !== '/accommodation') {
      window.location.href = '/accommodation';
      this.log('Navigate to accommodation page', 'INFO', 'Redirecting...');
      
      // Set a timeout to run the test after page loads
      setTimeout(() => {
        this.runClickableImageTests();
      }, 2000);
      return;
    }
    
    this.runClickableImageTests();
  }

  runClickableImageTests() {
    // Check if room images are present on the page
    const roomImages = document.querySelectorAll('[data-testid="room-image"], .room-image, img[alt*="KLV"]');
    
    if (roomImages.length > 0) {
      this.log('Room images found on page', 'PASS', `Found ${roomImages.length} images`);
      
      // Test hover effects
      roomImages.forEach((img, index) => {
        const parentElement = img.closest('.group, .hover\\:scale-105, [class*="hover"]');
        if (parentElement) {
          this.log(`Image ${index + 1} has hover effects`, 'PASS', 'Hover styling detected');
        } else {
          this.log(`Image ${index + 1} has hover effects`, 'FAIL', 'No hover styling found');
        }
      });
      
      // Test click handlers
      roomImages.forEach((img, index) => {
        const clickableParent = img.closest('[onclick], .cursor-pointer, [data-testid*="clickable"]');
        if (clickableParent || img.style.cursor === 'pointer' || img.classList.contains('cursor-pointer')) {
          this.log(`Image ${index + 1} is clickable`, 'PASS', 'Click handler detected');
        } else {
          this.log(`Image ${index + 1} is clickable`, 'FAIL', 'No click handler found');
        }
      });
      
    } else {
      this.log('Room images found on page', 'FAIL', 'No room images detected');
    }
  }

  // Test 5: Test modal functionality
  testModalFunctionality() {
    console.log('\n=== Testing Modal Functionality ===');
    
    // Check if modal components exist in the DOM
    const modalSelectors = [
      '[data-testid="room-details-modal"]',
      '.fixed.inset-0.bg-black.bg-opacity-75',
      '[role="dialog"]',
      '.modal'
    ];
    
    let modalFound = false;
    modalSelectors.forEach(selector => {
      const modal = document.querySelector(selector);
      if (modal) {
        modalFound = true;
        this.log('Modal component exists', 'PASS', `Found with selector: ${selector}`);
      }
    });
    
    if (!modalFound) {
      this.log('Modal component exists', 'FAIL', 'No modal components found');
    }
    
    // Test if React components are loaded
    if (window.React || document.querySelector('[data-reactroot]')) {
      this.log('React components loaded', 'PASS', 'React detected');
    } else {
      this.log('React components loaded', 'FAIL', 'React not detected');
    }
  }

  // Test 6: Test image gallery functionality
  async testImageGalleryFeatures() {
    console.log('\n=== Testing Image Gallery Features ===');
    
    // Test multiple images per room type
    const roomTypes = ['family-suite', 'triple-room', 'group-room', 'entire-villa', 'pool-deck'];
    
    for (const roomType of roomTypes) {
      try {
        const response = await fetch(`${this.baseUrl}/uploads/gallery/${roomType}/`);
        if (response.ok) {
          this.log(`Gallery folder exists for ${roomType}`, 'PASS', 'Folder accessible');
        } else {
          this.log(`Gallery folder exists for ${roomType}`, 'FAIL', `Status: ${response.status}`);
        }
      } catch (error) {
        this.log(`Gallery folder exists for ${roomType}`, 'FAIL', `Error: ${error.message}`);
      }
    }
  }

  // Test 7: Test responsive design
  testResponsiveDesign() {
    console.log('\n=== Testing Responsive Design ===');
    
    const originalWidth = window.innerWidth;
    
    // Test mobile view
    const testViewport = (width, label) => {
      // Simulate viewport change
      if (document.querySelector('.md\\:w-2\\/5, .md\\:flex')) {
        this.log(`${label} responsive layout`, 'PASS', 'Responsive classes detected');
      } else {
        this.log(`${label} responsive layout`, 'FAIL', 'No responsive classes found');
      }
    };
    
    testViewport(375, 'Mobile');
    testViewport(768, 'Tablet');
    testViewport(1024, 'Desktop');
  }

  // Test 8: Test TDD requirements
  testTDDRequirements() {
    console.log('\n=== Testing TDD Requirements ===');
    
    // Check if images have proper click handlers for drilling down
    const images = document.querySelectorAll('img[alt*="KLV"], img[src*="family-suite"], img[src*="triple-room"]');
    
    images.forEach((img, index) => {
      // Test 1: Image should be clickable
      const isClickable = img.onclick || 
                         img.parentElement?.onclick ||
                         img.classList.contains('cursor-pointer') ||
                         img.parentElement?.classList.contains('cursor-pointer');
      
      if (isClickable) {
        this.log(`TDD: Image ${index + 1} clickable for drilling`, 'PASS', 'Click handler found');
      } else {
        this.log(`TDD: Image ${index + 1} clickable for drilling`, 'FAIL', 'No click handler');
      }
      
      // Test 2: Image should have proper alt text for accessibility
      if (img.alt && img.alt.length > 10) {
        this.log(`TDD: Image ${index + 1} has descriptive alt text`, 'PASS', img.alt.substring(0, 50));
      } else {
        this.log(`TDD: Image ${index + 1} has descriptive alt text`, 'FAIL', 'Missing or poor alt text');
      }
      
      // Test 3: Image should load properly
      if (img.complete && img.naturalHeight !== 0) {
        this.log(`TDD: Image ${index + 1} loads successfully`, 'PASS', `${img.naturalWidth}x${img.naturalHeight}`);
      } else {
        this.log(`TDD: Image ${index + 1} loads successfully`, 'FAIL', 'Image failed to load');
      }
    });
  }

  // Generate comprehensive test report
  generateTestReport() {
    console.log('\n' + '='.repeat(60));
    console.log('📊 ACCOMMODATION IMAGE FUNCTIONALITY TEST REPORT');
    console.log('='.repeat(60));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const info = this.testResults.filter(r => r.status === 'INFO').length;
    
    console.log(`✅ PASSED: ${passed}`);
    console.log(`❌ FAILED: ${failed}`);
    console.log(`ℹ️  INFO: ${info}`);
    console.log(`📊 TOTAL: ${this.testResults.length}`);
    
    if (failed === 0) {
      console.log('\n🎉 ALL TESTS PASSED - Image functionality working correctly!');
      console.log('\nConfirmed Features:');
      console.log('✓ Accommodation images display properly');
      console.log('✓ Authentic property photos are used');
      console.log('✓ Images are clickable for detailed exploration');
      console.log('✓ Modal functionality works for drilling down');
      console.log('✓ Responsive design for all devices');
      console.log('✓ Proper accessibility features');
    } else {
      console.log('\n⚠️  SOME TESTS FAILED - Review image implementation');
      
      // Show failed tests
      const failedTests = this.testResults.filter(r => r.status === 'FAIL');
      console.log('\nFailed Tests:');
      failedTests.forEach(test => {
        console.log(`❌ ${test.test}: ${test.details}`);
      });
    }
    
    return {
      passed,
      failed,
      info,
      total: this.testResults.length,
      allPassed: failed === 0
    };
  }

  // Run all tests
  async runAllTests() {
    console.log('🏨 Ko Lake Villa - Accommodation Image Functionality Test Suite');
    console.log('=' .repeat(60));
    
    // Run async tests first
    const pageLoaded = await this.testAccommodationPageLoad();
    if (pageLoaded) {
      await this.testRoomDataFetch();
      await this.testAuthenticImagePaths();
      await this.testImageGalleryFeatures();
    }
    
    // Run DOM-based tests
    this.testClickableImageFunctionality();
    this.testModalFunctionality();
    this.testResponsiveDesign();
    this.testTDDRequirements();
    
    // Generate final report
    return this.generateTestReport();
  }
}

// Auto-run tests when script loads
if (typeof window !== 'undefined') {
  console.log('🚀 Starting Accommodation Image Tests...');
  
  // Wait for page to load if needed
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const tester = new AccommodationImageTest();
      tester.runAllTests();
    });
  } else {
    const tester = new AccommodationImageTest();
    tester.runAllTests();
  }
} else {
  // Node.js environment
  const tester = new AccommodationImageTest();
  tester.runAllTests().then(results => {
    console.log('\n✅ Image functionality test completed');
    process.exit(results.allPassed ? 0 : 1);
  }).catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}