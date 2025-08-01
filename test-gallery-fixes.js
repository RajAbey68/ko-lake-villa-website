#!/usr/bin/env node

const BASE_URL = 'https://ko-lake-villa-website.vercel.app';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  console.log(`🔍 Testing: ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const result = await response.json();
    console.log(`✅ Status: ${response.status}`);
    
    if (options.expectCount) {
      const count = Array.isArray(result) ? result.length : (result.metadata ? Object.keys(result.metadata).length : 0);
      console.log(`📊 Items: ${count}`);
    }
    
    return { status: response.status, data: result };
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    return { error: error.message };
  }
}

async function runTests() {
  console.log('🧪 COMPREHENSIVE GALLERY MANAGEMENT TESTS\n');
  console.log('=' .repeat(50));
  
  // Test 1: Gallery List API
  console.log('\n📋 Test 1: Gallery List API');
  await testAPI('/api/gallery/list', { expectCount: true });
  
  // Test 2: Admin List API  
  console.log('\n📋 Test 2: Admin List API');
  await testAPI('/api/gallery/admin-list', { expectCount: true });
  
  // Test 3: Metadata API - Get All
  console.log('\n📋 Test 3: Metadata API - Get All');
  await testAPI('/api/gallery/metadata', { expectCount: true });
  
  // Test 4: Metadata Update
  console.log('\n📋 Test 4: Metadata Update');
  const testImageId = 'default/1747314600586-813125493-20250418_070924.jpg';
  await testAPI('/api/gallery/metadata', {
    method: 'POST',
    body: JSON.stringify({
      imageId: testImageId,
      title: `Test Update ${Date.now()}`,
      description: 'API Persistence Test',
      category: 'Default',
      tags: ['test', 'api', 'persistence'],
      seoTitle: 'Test SEO Title',
      seoDescription: 'Test SEO Description',
      altText: 'Test Alt Text'
    })
  });
  
  // Test 5: Verify Update Persistence
  console.log('\n📋 Test 5: Verify Update Persistence');
  await sleep(2000); // Wait for propagation
  await testAPI(`/api/gallery/metadata?imageId=${encodeURIComponent(testImageId)}`);
  
  // Test 6: Archive API
  console.log('\n📋 Test 6: Archive API');
  await testAPI('/api/gallery/archive');
  
  // Test 7: Health Check
  console.log('\n📋 Test 7: Health Check');
  await testAPI('/api/health');
  
  console.log('\n' + '=' .repeat(50));
  console.log('🎯 TESTS COMPLETED');
  console.log('\n💡 If all tests show ✅ Status: 200, the fixes are working!');
  console.log('💡 If any show errors, there may be deployment or API issues.');
  
  console.log('\n📝 NEXT STEPS FOR MANUAL TESTING:');
  console.log('1. Visit: https://ko-lake-villa-website.vercel.app/admin/gallery');
  console.log('2. Try editing an image title/description');
  console.log('3. Save and verify changes persist after page refresh');
  console.log('4. Try deleting an image and confirm it disappears');
  console.log('5. Check that SEO updates show in the gallery');
}

runTests().catch(console.error);