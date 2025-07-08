
console.log('🔧 Ko Lake Villa Admin Connectivity Test');
console.log('==========================================');

async function testAdminConnectivity() {
  const baseUrl = window.location.origin;
  
  // Test 1: Check if we're on the right domain
  console.log('🌐 Current URL:', window.location.href);
  console.log('🌐 Base URL:', baseUrl);
  
  // Test 2: Check authentication state
  const authData = localStorage.getItem('firebase:authUser:AIzaSyBHqVGh8N_5E3l9Z3l8v2fQc7U2aJ4K5E0:[DEFAULT]');
  console.log('🔑 Auth data present:', !!authData);
  
  // Test 3: Test core API endpoints
  const endpoints = [
    '/api/gallery',
    '/api/admin/health',
    '/api/admin/gallery',
    '/api/admin/pricing'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`);
      console.log(`✅ ${endpoint}: ${response.status} ${response.statusText}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.message}`);
    }
  }
  
  // Test 4: Check if admin routes are accessible
  const adminRoutes = [
    '/admin',
    '/admin/dashboard',
    '/admin/gallery'
  ];
  
  for (const route of adminRoutes) {
    try {
      const response = await fetch(`${baseUrl}${route}`, { method: 'HEAD' });
      console.log(`🏠 ${route}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${route}: ${error.message}`);
    }
  }
  
  // Test 5: Check React component mounting
  const reactRoot = document.getElementById('root');
  console.log('⚛️ React root element:', !!reactRoot);
  console.log('⚛️ React content:', reactRoot?.innerHTML?.length > 0 ? 'Present' : 'Empty');
  
  // Test 6: Check for JavaScript errors
  const errorCount = window.console.error.length || 0;
  console.log('🐛 Console errors:', errorCount);
  
  console.log('\n📋 CONNECTIVITY SUMMARY:');
  console.log('========================');
  console.log('If you see ❌ errors above, those need to be fixed.');
  console.log('If React content is "Empty", there\'s a rendering issue.');
  console.log('Run this test in the browser console on your admin page.');
}

testAdminConnectivity();
