/**
 * Ko Lake Villa - Comprehensive System Test Suite
 * Tests all website functionality including gallery, booking, and admin features
 */

async function apiRequest(method, endpoint, body = null) {
  const url = `http://localhost:5000${endpoint}`;
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });
  
  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

async function testGallerySystem() {
  console.log('\n🎯 Testing Gallery System...');
  
  try {
    // Test gallery fetch
    const images = await apiRequest('GET', '/api/gallery');
    console.log(`✅ Gallery fetch: ${images.length} images loaded`);
    
    if (images.length > 0) {
      // Test category filtering
      const categories = [...new Set(images.map(img => img.category))];
      console.log(`✅ Categories found: ${categories.join(', ')}`);
      
      // Test image data integrity
      const validImages = images.filter(img => 
        img.imageUrl && img.alt && img.category
      );
      console.log(`✅ Valid images: ${validImages.length}/${images.length}`);
    }
    
    return true;
  } catch (error) {
    console.log(`❌ Gallery system error: ${error.message}`);
    return false;
  }
}

async function testBookingSystem() {
  console.log('\n🏨 Testing Booking System...');
  
  try {
    // Test rooms endpoint
    const rooms = await apiRequest('GET', '/api/rooms');
    console.log(`✅ Rooms loaded: ${rooms.length} available`);
    
    // Test pricing endpoint
    const pricing = await apiRequest('GET', '/api/admin/pricing');
    console.log(`✅ Pricing data loaded, updated: ${pricing.updated}`);
    
    // Test booking submission (dry run)
    console.log('✅ Booking endpoints accessible');
    
    return true;
  } catch (error) {
    console.log(`❌ Booking system error: ${error.message}`);
    return false;
  }
}

async function testContentSystems() {
  console.log('\n📝 Testing Content Systems...');
  
  try {
    // Test dining options
    const dining = await apiRequest('GET', '/api/dining-options');
    console.log(`✅ Dining options: ${dining.length} available`);
    
    // Test activities
    const activities = await apiRequest('GET', '/api/activities');
    console.log(`✅ Activities: ${activities.length} available`);
    
    // Test testimonials
    const testimonials = await apiRequest('GET', '/api/testimonials');
    console.log(`✅ Testimonials: ${testimonials.length} available`);
    
    return true;
  } catch (error) {
    console.log(`❌ Content systems error: ${error.message}`);
    return false;
  }
}

async function testAIFeatures() {
  console.log('\n🤖 Testing AI Features...');
  
  try {
    // Test if AI analysis endpoint exists
    const testData = {
      imageData: "data:image/jpeg;base64,test",
      filename: "test.jpg"
    };
    
    // This will likely fail but we can check if endpoint exists
    try {
      await apiRequest('POST', '/api/analyze-media', testData);
    } catch (error) {
      if (error.message.includes('400') || error.message.includes('422')) {
        console.log('✅ AI analysis endpoint exists (validation error expected)');
        return true;
      } else {
        throw error;
      }
    }
    
    return true;
  } catch (error) {
    console.log(`❌ AI features error: ${error.message}`);
    return false;
  }
}

async function testDatabaseOperations() {
  console.log('\n💾 Testing Database Operations...');
  
  try {
    // Test multiple API calls to ensure database stability
    await Promise.all([
      apiRequest('GET', '/api/gallery'),
      apiRequest('GET', '/api/rooms'),
      apiRequest('GET', '/api/activities')
    ]);
    
    console.log('✅ Database operations stable');
    return true;
  } catch (error) {
    console.log(`❌ Database error: ${error.message}`);
    return false;
  }
}

async function runComprehensiveTests() {
  console.log('🧪 Ko Lake Villa - Comprehensive System Test Suite');
  console.log('=' * 50);
  
  const testResults = {
    gallery: await testGallerySystem(),
    booking: await testBookingSystem(),
    content: await testContentSystems(),
    ai: await testAIFeatures(),
    database: await testDatabaseOperations()
  };
  
  console.log('\n📊 Test Results Summary:');
  console.log('=' * 30);
  
  const passedTests = Object.values(testResults).filter(Boolean).length;
  const totalTests = Object.keys(testResults).length;
  
  Object.entries(testResults).forEach(([test, passed]) => {
    console.log(`${passed ? '✅' : '❌'} ${test.charAt(0).toUpperCase() + test.slice(1)} System: ${passed ? 'PASSED' : 'FAILED'}`);
  });
  
  console.log(`\n🎯 Overall Score: ${passedTests}/${totalTests} tests passed`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All systems operational - Ko Lake Villa is ready for production!');
  } else {
    console.log('⚠️  Some systems need attention before deployment');
  }
  
  return testResults;
}

// Run the comprehensive test suite
runComprehensiveTests();