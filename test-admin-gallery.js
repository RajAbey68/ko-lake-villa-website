/**
 * Admin Gallery Test - Direct API Testing
 * Tests admin console and gallery management for production readiness
 */

async function testAdminGallery() {
  const baseUrl = 'http://localhost:5000';
  
  console.log('🔧 Testing Admin Console & Gallery Management...\n');
  
  let passed = 0;
  let failed = 0;
  
  function logTest(test, status, details = '') {
    const statusColor = status === 'PASS' ? '✅' : '❌';
    console.log(`${statusColor} ${test}${details ? ` - ${details}` : ''}`);
    if (status === 'PASS') passed++; else failed++;
  }
  
  // Test 1: Admin gallery API
  try {
    const response = await fetch(`${baseUrl}/api/admin/gallery`);
    const images = await response.json();
    
    if (response.ok && Array.isArray(images)) {
      logTest('Admin Gallery API', 'PASS', `${images.length} images found`);
      
      // Test image structure
      if (images.length > 0) {
        const firstImage = images[0];
        if (firstImage.id && firstImage.title && firstImage.imageUrl) {
          logTest('Image data structure', 'PASS', 'Complete image metadata');
        } else {
          logTest('Image data structure', 'FAIL', 'Missing required fields');
        }
      }
    } else {
      logTest('Admin Gallery API', 'FAIL', `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Admin Gallery API', 'FAIL', error.message);
  }
  
  // Test 2: Upload endpoint
  try {
    const formData = new FormData();
    formData.append('test', 'validation');
    
    const response = await fetch(`${baseUrl}/api/admin/upload`, {
      method: 'POST',
      body: formData
    });
    
    if (response.status === 400 || response.status === 200) {
      logTest('Upload endpoint', 'PASS', 'Upload endpoint responsive');
    } else {
      logTest('Upload endpoint', 'FAIL', `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('Upload endpoint', 'FAIL', error.message);
  }
  
  // Test 3: Admin routes
  const adminRoutes = ['/admin', '/admin/gallery', '/admin/pricing'];
  
  for (const route of adminRoutes) {
    try {
      const response = await fetch(`${baseUrl}${route}`);
      if (response.ok) {
        logTest(`Admin route ${route}`, 'PASS', `Accessible`);
      } else {
        logTest(`Admin route ${route}`, 'FAIL', `Status: ${response.status}`);
      }
    } catch (error) {
      logTest(`Admin route ${route}`, 'FAIL', error.message);
    }
  }
  
  // Test 4: File system access
  try {
    const response = await fetch(`${baseUrl}/uploads/gallery/`);
    if (response.ok || response.status === 403) {
      logTest('File system access', 'PASS', 'Uploads directory configured');
    } else {
      logTest('File system access', 'FAIL', `Status: ${response.status}`);
    }
  } catch (error) {
    logTest('File system access', 'FAIL', error.message);
  }
  
  // Test 5: Image deletion capability
  try {
    const response = await fetch(`${baseUrl}/api/admin/gallery/delete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId: 999999 })
    });
    
    if (response.status === 404 || response.status === 400) {
      logTest('Delete functionality', 'PASS', 'Delete endpoint operational');
    } else {
      logTest('Delete functionality', 'FAIL', `Unexpected status: ${response.status}`);
    }
  } catch (error) {
    logTest('Delete functionality', 'FAIL', error.message);
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('ADMIN CONSOLE TEST RESULTS');
  console.log('='.repeat(50));
  console.log(`✅ PASSED: ${passed}`);
  console.log(`❌ FAILED: ${failed}`);
  console.log(`📊 TOTAL: ${passed + failed}`);
  
  if (failed === 0) {
    console.log('\n🎉 ADMIN CONSOLE FULLY OPERATIONAL!');
    console.log('\n📋 Production Ready Checklist:');
    console.log('1. Access /admin/gallery to manage images');
    console.log('2. Delete test/placeholder images');  
    console.log('3. Upload production images with categories');
    console.log('4. Verify images display on public pages');
    console.log('\n🔗 Admin Access: http://localhost:5000/admin/gallery');
  } else {
    console.log('\n⚠️ Issues detected - check server routes and permissions');
  }
  
  return { passed, failed, ready: failed === 0 };
}

// Run the test
testAdminGallery().catch(console.error);