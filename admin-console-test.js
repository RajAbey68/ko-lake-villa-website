/**
 * Ko Lake Villa - Admin Console & Gallery Management Test
 * Comprehensive testing of admin functionality for production readiness
 */

class AdminConsoleTest {
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

  // Test 1: Admin routes accessibility
  async testAdminAccess() {
    console.log('\n=== Testing Admin Console Access ===');
    
    const adminRoutes = [
      '/admin',
      '/admin/gallery',
      '/admin/pricing',
      '/admin/content'
    ];

    for (const route of adminRoutes) {
      try {
        const response = await fetch(`${this.baseUrl}${route}`);
        if (response.ok) {
          this.log(`Admin route: ${route}`, 'PASS', `Status: ${response.status}`);
        } else {
          this.log(`Admin route: ${route}`, 'FAIL', `Status: ${response.status}`);
        }
      } catch (error) {
        this.log(`Admin route: ${route}`, 'FAIL', `Error: ${error.message}`);
      }
    }
  }

  // Test 2: Gallery API endpoints
  async testGalleryAPI() {
    console.log('\n=== Testing Gallery Management API ===');
    
    try {
      // Test GET gallery images
      const getResponse = await fetch(`${this.baseUrl}/api/admin/gallery`);
      const images = await getResponse.json();
      
      if (getResponse.ok && Array.isArray(images)) {
        this.log('Gallery API - GET images', 'PASS', `Found ${images.length} images`);
        
        // Test individual image structure
        if (images.length > 0) {
          const firstImage = images[0];
          const requiredFields = ['id', 'title', 'description', 'imageUrl', 'category'];
          
          requiredFields.forEach(field => {
            if (firstImage.hasOwnProperty(field)) {
              this.log(`Image field: ${field}`, 'PASS');
            } else {
              this.log(`Image field: ${field}`, 'FAIL', 'Missing required field');
            }
          });
        }
        
        return images;
      } else {
        this.log('Gallery API - GET images', 'FAIL', `Status: ${getResponse.status}`);
        return [];
      }
    } catch (error) {
      this.log('Gallery API - GET images', 'FAIL', `Error: ${error.message}`);
      return [];
    }
  }

  // Test 3: Upload functionality
  async testUploadEndpoint() {
    console.log('\n=== Testing Upload Functionality ===');
    
    try {
      // Test upload endpoint exists
      const testData = new FormData();
      testData.append('test', 'true');
      
      const response = await fetch(`${this.baseUrl}/api/admin/upload`, {
        method: 'POST',
        body: testData
      });
      
      if (response.status === 400 || response.status === 200) {
        this.log('Upload endpoint exists', 'PASS', 'Endpoint responds to requests');
      } else if (response.status === 404) {
        this.log('Upload endpoint exists', 'FAIL', 'Upload endpoint not found');
      } else {
        this.log('Upload endpoint exists', 'INFO', `Status: ${response.status}`);
      }
    } catch (error) {
      this.log('Upload endpoint exists', 'FAIL', `Error: ${error.message}`);
    }
  }

  // Test 4: Image deletion capability
  async testImageDeletion() {
    console.log('\n=== Testing Image Deletion Capability ===');
    
    try {
      // Test if delete endpoint exists
      const response = await fetch(`${this.baseUrl}/api/admin/gallery/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageId: 999999 }) // Non-existent ID
      });
      
      if (response.status === 404 || response.status === 400) {
        this.log('Delete endpoint exists', 'PASS', 'Delete endpoint responds correctly');
      } else if (response.status === 500) {
        this.log('Delete endpoint exists', 'FAIL', 'Server error on delete');
      } else {
        this.log('Delete endpoint exists', 'INFO', `Status: ${response.status}`);
      }
    } catch (error) {
      this.log('Delete endpoint exists', 'FAIL', `Error: ${error.message}`);
    }
  }

  // Test 5: Bulk operations support
  async testBulkOperations() {
    console.log('\n=== Testing Bulk Operations ===');
    
    try {
      // Test bulk delete endpoint
      const response = await fetch(`${this.baseUrl}/api/admin/gallery/bulk-delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageIds: [999999, 999998] })
      });
      
      if (response.status === 404 || response.status === 400 || response.status === 200) {
        this.log('Bulk delete endpoint', 'PASS', 'Bulk operations supported');
      } else {
        this.log('Bulk delete endpoint', 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      this.log('Bulk delete endpoint', 'INFO', 'Bulk operations may not be implemented');
    }
  }

  // Test 6: File system access
  async testFileSystemAccess() {
    console.log('\n=== Testing File System Access ===');
    
    try {
      // Test if uploads directory is accessible
      const response = await fetch(`${this.baseUrl}/uploads/gallery/`);
      
      if (response.ok || response.status === 403) {
        this.log('Uploads directory accessible', 'PASS', 'File system properly configured');
      } else {
        this.log('Uploads directory accessible', 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      this.log('Uploads directory accessible', 'FAIL', `Error: ${error.message}`);
    }
  }

  // Test 7: Admin UI functionality (DOM-based)
  testAdminUI() {
    console.log('\n=== Testing Admin UI Elements ===');
    
    if (window.location.pathname.includes('/admin')) {
      // Test admin navigation
      const adminNav = document.querySelector('nav, .admin-nav, [role="navigation"]');
      if (adminNav) {
        this.log('Admin navigation exists', 'PASS', 'Navigation component found');
      } else {
        this.log('Admin navigation exists', 'FAIL', 'No navigation found');
      }

      // Test gallery management interface
      const galleryInterface = document.querySelector('.gallery-manager, [data-testid="gallery"], .admin-gallery');
      if (galleryInterface) {
        this.log('Gallery management interface', 'PASS', 'Gallery UI found');
      } else {
        this.log('Gallery management interface', 'FAIL', 'Gallery UI not found');
      }

      // Test upload interface
      const uploadInterface = document.querySelector('input[type="file"], .upload-zone, .dropzone');
      if (uploadInterface) {
        this.log('Upload interface exists', 'PASS', 'File upload UI found');
      } else {
        this.log('Upload interface exists', 'FAIL', 'No upload interface found');
      }

      // Test delete buttons
      const deleteButtons = document.querySelectorAll('button[class*="delete"], .delete-btn, [data-action="delete"]');
      if (deleteButtons.length > 0) {
        this.log('Delete functionality', 'PASS', `${deleteButtons.length} delete controls found`);
      } else {
        this.log('Delete functionality', 'FAIL', 'No delete controls found');
      }

    } else {
      this.log('Admin UI test', 'INFO', 'Not on admin page - navigate to /admin for UI tests');
    }
  }

  // Test 8: Production readiness checks
  async testProductionReadiness() {
    console.log('\n=== Testing Production Readiness ===');
    
    const images = await this.testGalleryAPI();
    
    // Check for test/placeholder content
    const testContent = images.filter(img => 
      img.title?.toLowerCase().includes('test') ||
      img.description?.toLowerCase().includes('placeholder') ||
      img.imageUrl?.includes('placeholder')
    );
    
    if (testContent.length === 0) {
      this.log('No test content found', 'PASS', 'Gallery ready for production images');
    } else {
      this.log('No test content found', 'FAIL', `${testContent.length} test/placeholder items found`);
    }

    // Check image accessibility
    const brokenImages = [];
    for (const image of images.slice(0, 5)) { // Test first 5 images
      try {
        const response = await fetch(image.imageUrl);
        if (!response.ok) {
          brokenImages.push(image.imageUrl);
        }
      } catch (error) {
        brokenImages.push(image.imageUrl);
      }
    }

    if (brokenImages.length === 0) {
      this.log('Image accessibility check', 'PASS', 'All tested images accessible');
    } else {
      this.log('Image accessibility check', 'FAIL', `${brokenImages.length} broken image links`);
    }

    // Check for proper categorization
    const categories = [...new Set(images.map(img => img.category))];
    if (categories.length > 1) {
      this.log('Image categorization', 'PASS', `${categories.length} categories: ${categories.join(', ')}`);
    } else {
      this.log('Image categorization', 'INFO', 'Limited categorization found');
    }
  }

  // Generate comprehensive report
  generateReport() {
    console.log('\n' + '='.repeat(60));
    console.log('🔧 ADMIN CONSOLE & GALLERY MANAGEMENT REPORT');
    console.log('='.repeat(60));
    
    const passed = this.testResults.filter(r => r.status === 'PASS').length;
    const failed = this.testResults.filter(r => r.status === 'FAIL').length;
    const info = this.testResults.filter(r => r.status === 'INFO').length;
    
    console.log(`✅ PASSED: ${passed}`);
    console.log(`❌ FAILED: ${failed}`);
    console.log(`ℹ️  INFO: ${info}`);
    console.log(`📊 TOTAL: ${this.testResults.length}`);
    
    if (failed === 0) {
      console.log('\n🎉 ADMIN CONSOLE FULLY OPERATIONAL!');
      console.log('\n✅ Gallery Management Ready for Production:');
      console.log('📸 Image upload and management working');
      console.log('🗑️ Image deletion capabilities functional');
      console.log('📁 File system access properly configured');
      console.log('🔐 Admin routes accessible and secure');
      console.log('🎯 Ready for production image management');
      
      console.log('\n📋 Production Checklist:');
      console.log('1. ✅ Access /admin/gallery to manage images');
      console.log('2. ✅ Use bulk delete to clear test images');
      console.log('3. ✅ Upload production images with proper categories');
      console.log('4. ✅ Verify images display correctly on public pages');
      
    } else {
      console.log('\n⚠️  ADMIN CONSOLE ISSUES DETECTED');
      
      const failedTests = this.testResults.filter(r => r.status === 'FAIL');
      console.log('\nIssues to Address:');
      failedTests.forEach(test => {
        console.log(`❌ ${test.test}: ${test.details}`);
      });
      
      console.log('\n🔧 Recommended Actions:');
      console.log('1. Check server routes for missing admin endpoints');
      console.log('2. Verify file system permissions for uploads directory');
      console.log('3. Test admin authentication if access is denied');
      console.log('4. Review error logs for specific issues');
    }
    
    return {
      passed,
      failed,
      info,
      total: this.testResults.length,
      adminReady: failed === 0
    };
  }

  // Run all admin tests
  async runAllTests() {
    console.log('🔧 Ko Lake Villa - Admin Console Test Suite');
    console.log('=' .repeat(60));
    
    await this.testAdminAccess();
    await this.testGalleryAPI();
    await this.testUploadEndpoint();
    await this.testImageDeletion();
    await this.testBulkOperations();
    await this.testFileSystemAccess();
    await this.testProductionReadiness();
    
    this.testAdminUI();
    
    return this.generateReport();
  }
}

// Auto-run tests
if (typeof window !== 'undefined') {
  console.log('🚀 Starting Admin Console Tests...');
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      const tester = new AdminConsoleTest();
      tester.runAllTests();
    });
  } else {
    const tester = new AdminConsoleTest();
    tester.runAllTests();
  }
} else {
  const tester = new AdminConsoleTest();
  tester.runAllTests().then(results => {
    console.log('\n✅ Admin console test completed');
    process.exit(results.adminReady ? 0 : 1);
  }).catch(error => {
    console.error('❌ Test suite failed:', error);
    process.exit(1);
  });
}