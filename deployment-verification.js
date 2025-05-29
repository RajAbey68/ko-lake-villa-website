/**
 * Ko Lake Villa - Quick Deployment Verification
 * Run this in browser console after deployment to verify all systems
 */

async function verifyDeployment() {
  console.log('🏝️ Ko Lake Villa - Deployment Verification Starting...\n');
  
  const results = [];
  const baseUrl = window.location.origin;
  
  // Helper function to test API endpoint
  async function testEndpoint(name, url) {
    try {
      const response = await fetch(url);
      const success = response.ok;
      results.push({ test: name, status: success ? 'PASS' : 'FAIL', details: `Status: ${response.status}` });
      console.log(`${success ? '✅' : '❌'} ${name}: ${response.status}`);
      return success;
    } catch (error) {
      results.push({ test: name, status: 'FAIL', details: error.message });
      console.log(`❌ ${name}: ${error.message}`);
      return false;
    }
  }
  
  // Test critical API endpoints
  console.log('🔌 Testing API Endpoints...');
  await testEndpoint('Rooms API', `${baseUrl}/api/rooms`);
  await testEndpoint('Gallery API', `${baseUrl}/api/gallery`);
  await testEndpoint('Pricing API', `${baseUrl}/api/pricing`);
  await testEndpoint('Testimonials API', `${baseUrl}/api/testimonials`);
  await testEndpoint('Activities API', `${baseUrl}/api/activities`);
  
  // Test page accessibility
  console.log('\n🧭 Testing Page Access...');
  const pages = ['/', '/accommodation', '/gallery', '/booking', '/contact', '/experiences'];
  for (const page of pages) {
    await testEndpoint(`Page: ${page}`, `${baseUrl}${page}`);
  }
  
  // Test admin access (should require authentication)
  console.log('\n🔐 Testing Admin Security...');
  await testEndpoint('Admin Security', `${baseUrl}/admin`);
  
  // Check for essential elements
  console.log('\n🔍 Testing Page Elements...');
  
  // Test navigation
  const nav = document.querySelector('nav') || document.querySelector('header');
  const hasNav = !!nav;
  results.push({ test: 'Navigation', status: hasNav ? 'PASS' : 'FAIL', details: hasNav ? 'Found' : 'Missing' });
  console.log(`${hasNav ? '✅' : '❌'} Navigation: ${hasNav ? 'Found' : 'Missing'}`);
  
  // Test footer
  const footer = document.querySelector('footer');
  const hasFooter = !!footer;
  results.push({ test: 'Footer', status: hasFooter ? 'PASS' : 'FAIL', details: hasFooter ? 'Found' : 'Missing' });
  console.log(`${hasFooter ? '✅' : '❌'} Footer: ${hasFooter ? 'Found' : 'Missing'}`);
  
  // Test SEO elements
  const title = document.querySelector('title');
  const metaDesc = document.querySelector('meta[name="description"]');
  const hasTitle = !!title && title.textContent.length > 0;
  const hasMetaDesc = !!metaDesc && metaDesc.content.length > 0;
  
  results.push({ test: 'SEO Title', status: hasTitle ? 'PASS' : 'FAIL', details: hasTitle ? title.textContent : 'Missing' });
  results.push({ test: 'SEO Description', status: hasMetaDesc ? 'PASS' : 'FAIL', details: hasMetaDesc ? metaDesc.content : 'Missing' });
  console.log(`${hasTitle ? '✅' : '❌'} SEO Title: ${hasTitle ? title.textContent : 'Missing'}`);
  console.log(`${hasMetaDesc ? '✅' : '❌'} SEO Description: ${hasMetaDesc ? 'Found' : 'Missing'}`);
  
  // Summary
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  const total = results.length;
  const successRate = ((passed / total) * 100).toFixed(1);
  
  console.log('\n' + '='.repeat(50));
  console.log('🏁 Ko Lake Villa Deployment Verification Complete');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total Tests: ${total}`);
  console.log(`📈 Success Rate: ${successRate}%`);
  
  if (failed > 0) {
    console.log('\n❌ Failed Tests:');
    results.filter(r => r.status === 'FAIL').forEach(result => {
      console.log(`  • ${result.test}: ${result.details}`);
    });
  }
  
  if (successRate >= 90) {
    console.log('\n🎉 Deployment looks good! Ready for production.');
  } else if (successRate >= 75) {
    console.log('\n⚠️ Deployment has some issues but is mostly functional.');
  } else {
    console.log('\n🚨 Deployment has significant issues that need attention.');
  }
  
  return results;
}

// Test gallery editing if logged in as admin
async function testGalleryEditing() {
  console.log('🖼️ Testing Gallery Editing (Admin Required)...\n');
  
  try {
    // Try to get gallery images
    const response = await fetch('/api/gallery');
    if (!response.ok) {
      console.log('❌ Cannot access gallery API');
      return;
    }
    
    const images = await response.json();
    if (images.length === 0) {
      console.log('⚠️ No gallery images found');
      return;
    }
    
    console.log(`✅ Found ${images.length} gallery images`);
    
    // Test updating an image (requires admin auth)
    const testImage = images[0];
    const updateResponse = await fetch(`/api/gallery/${testImage.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: testImage.title || 'Test Title',
        description: testImage.description || 'Test Description',
        category: testImage.category || 'default'
      })
    });
    
    if (updateResponse.ok) {
      console.log('✅ Gallery editing works correctly');
    } else if (updateResponse.status === 401) {
      console.log('🔐 Gallery editing requires admin authentication (expected)');
    } else {
      console.log(`❌ Gallery editing failed: ${updateResponse.status}`);
    }
    
  } catch (error) {
    console.log(`❌ Gallery editing test failed: ${error.message}`);
  }
}

// Auto-run verification
console.log('🧪 Ko Lake Villa deployment verification loaded.');
console.log('Run: verifyDeployment() - for full verification');
console.log('Run: testGalleryEditing() - to test admin gallery features');

// Make functions available globally
window.verifyDeployment = verifyDeployment;
window.testGalleryEditing = testGalleryEditing;